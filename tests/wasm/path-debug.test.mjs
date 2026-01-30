import { debugPathNormalization } from "../../index.js";
import { describe, test } from "vitest";

describe('Path Normalization Debug', () => {
    test('show how WASM normalizes paths on this platform', () => {
        // Test pairs that should match after normalization
        const testCases = [
            {
                config: "resources/chat/completions.mjs",
                runtime: "resources/chat/completions.mjs",
                description: "Unix-style (forward slashes)"
            },
            {
                config: "resources/chat/completions.mjs",
                runtime: "resources\\chat\\completions.mjs",
                description: "Config forward, runtime backslash"
            },
            {
                config: "resources\\chat\\completions.mjs",
                runtime: "resources/chat/completions.mjs",
                description: "Config backslash, runtime forward"
            },
            {
                config: "resources\\chat\\completions.mjs",
                runtime: "resources\\chat\\completions.mjs",
                description: "Both backslashes"
            },
        ];

        console.log("\n=== PATH NORMALIZATION DEBUG ===");
        console.log(`Platform: ${process.platform}`);
        console.log(`Node path.sep: ${require('path').sep}`);
        console.log();

        for (const testCase of testCases) {
            const result = JSON.parse(debugPathNormalization(testCase.config, testCase.runtime));

            console.log(`Test: ${testCase.description}`);
            console.log(`  Config:   "${testCase.config}" → "${result.configNormalized}"`);
            console.log(`  Runtime:  "${testCase.runtime}" → "${result.runtimeNormalized}"`);
            console.log(`  Match: ${result.match ? "✓ YES" : "✗ NO"}`);
            console.log();
        }

        console.log("This output shows how WASM PathBuf handles different separators.");
        console.log("WASM is platform-agnostic and always uses Unix path semantics.");
        console.log("=================================\n");
    });
});
