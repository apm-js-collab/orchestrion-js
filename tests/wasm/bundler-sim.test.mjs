import { create } from "../../index.js";
import { describe, test, expect } from "vitest";
import path from "path";

/**
 * This test simulates what the bundler-plugins package does:
 * 1. Gets a file path from the bundler (could be Windows or Unix style)
 * 2. Uses PathBuf to convert it to a path
 * 3. Calls getTransformer with the module name, version, and relative path
 */
describe('Bundler Plugin Simulation', () => {
    test('simulates bundler plugin behavior on Windows', () => {
        // Create instrumentor with forward slash config (like sdk-ts does)
        const instrumentor = create([
            {
                channelName: "test:openai:chat:completions",
                module: {
                    name: "openai",
                    versionRange: ">=4.0.0",
                    filePath: "resources/chat/completions.mjs", // Config always uses forward slashes
                },
                functionQuery: {
                    className: "Completions",
                    methodName: "create",
                    kind: "Async",
                },
            },
        ]);

        // Simulate what module-details-from-path returns on different platforms
        // On Windows: backslashes
        // On Unix: forward slashes
        const windowsPath = "resources\\chat\\completions.mjs";
        const unixPath = "resources/chat/completions.mjs";

        // Test Windows path
        const windowsTransformer = instrumentor.getTransformer(
            "openai",
            "4.87.0",
            windowsPath
        );
        expect(windowsTransformer, "Windows path should match").toBeTruthy();
        if (windowsTransformer) windowsTransformer.free();

        // Test Unix path
        const unixTransformer = instrumentor.getTransformer(
            "openai",
            "4.87.0",
            unixPath
        );
        expect(unixTransformer, "Unix path should match").toBeTruthy();
        if (unixTransformer) unixTransformer.free();

        instrumentor.free();
    });

    test('shows what paths look like on this platform', () => {
        console.log("\n=== PLATFORM PATH INFO ===");
        console.log(`Platform: ${process.platform}`);
        console.log(`Path separator: ${path.sep}`);

        // Show how path.join behaves
        const joined = path.join("resources", "chat", "completions.mjs");
        console.log(`path.join("resources", "chat", "completions.mjs") = "${joined}"`);
        console.log(`Contains backslashes: ${joined.includes("\\")}`);
        console.log(`Contains forward slashes: ${joined.includes("/")}`);
        console.log("=========================\n");
    });
});
