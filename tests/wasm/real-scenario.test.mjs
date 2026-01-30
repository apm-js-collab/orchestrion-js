import { create } from "../../index.js";
import { describe, test, expect } from "vitest";
import { fileURLToPath } from "url";
import path from "path";

describe('Real Scenario - Module Details Path', () => {
    test('should match paths exactly as bundler plugins would provide them', () => {
        // This is how configs are defined - always with forward slashes
        const instrumentor = create([
            {
                channelName: "test:openai:chat:completions",
                module: {
                    name: "openai",
                    versionRange: ">=4.0.0",
                    filePath: "resources/chat/completions.mjs",
                },
                functionQuery: {
                    className: "Completions",
                    methodName: "create",
                    kind: "Async",
                },
            },
        ]);

        // Simulate what module-details-from-path does on different platforms
        // On Windows: splits by backslash, reconstructs with backslash
        // On Unix: splits by forward slash, reconstructs with forward slash

        // Test 1: Unix-style path (what we'd get on macOS/Linux)
        const unixPath = "resources/chat/completions.mjs";
        const unixTransformer = instrumentor.getTransformer("openai", "4.87.0", unixPath);
        expect(unixTransformer, "Unix path should match").toBeTruthy();
        if (unixTransformer) unixTransformer.free();

        // Test 2: Windows-style path (what we'd get on Windows)
        // This is what module-details-from-path would return on Windows
        const windowsPath = "resources\\chat\\completions.mjs";
        const windowsTransformer = instrumentor.getTransformer("openai", "4.87.0", windowsPath);
        expect(windowsTransformer, "Windows path should match").toBeTruthy();
        if (windowsTransformer) windowsTransformer.free();
    });

    test('should handle paths with platform-specific separators from actual file IDs', () => {
        const instrumentor = create([
            {
                channelName: "test:openai:embeddings",
                module: {
                    name: "openai",
                    versionRange: ">=4.0.0",
                    filePath: "resources/embeddings.mjs",
                },
                functionQuery: {
                    className: "Embeddings",
                    methodName: "create",
                    kind: "Async",
                },
            },
        ]);

        // Simulate what happens in a real bundler scenario:
        // File ID on Windows might be: D:\project\node_modules\openai\resources\embeddings.mjs
        // module-details-from-path splits by \ and returns: resources\embeddings.mjs

        // On Unix, file ID: /project/node_modules/openai/resources/embeddings.mjs
        // module-details-from-path splits by / and returns: resources/embeddings.mjs

        const paths = [
            "resources/embeddings.mjs",    // Unix
            "resources\\embeddings.mjs",    // Windows
        ];

        for (const testPath of paths) {
            const transformer = instrumentor.getTransformer("openai", "4.87.0", testPath);
            expect(transformer, `Should match path: ${testPath}`).toBeTruthy();
            if (transformer) transformer.free();
        }
    });

    test('should demonstrate the actual failure case if fix is wrong', () => {
        // This test will PASS with the fix, FAIL without it
        const instrumentor = create([
            {
                channelName: "test:method",
                module: {
                    name: "openai",
                    versionRange: ">=4.0.0",
                    filePath: "resources/chat/completions.mjs", // Config: forward slashes
                },
                functionQuery: {
                    className: "Completions",
                    methodName: "create",
                    kind: "Async",
                },
            },
        ]);

        // Runtime on Windows: backslashes from module-details-from-path
        const windowsRuntimePath = "resources\\chat\\completions.mjs";

        const transformer = instrumentor.getTransformer(
            "openai",
            "4.87.0",
            windowsRuntimePath
        );

        // This assertion documents the expected behavior
        expect(
            transformer,
            "CRITICAL: Windows paths must match config paths for instrumentation to work"
        ).toBeTruthy();

        if (transformer) transformer.free();
    });

    test('test println output from WASM', () => {
        // Try to trigger a version parse error to see if println! works
        const instrumentor = create([
            {
                channelName: "test:println",
                module: {
                    name: "testmodule",
                    versionRange: ">=1.0.0",
                    filePath: "test.js",
                },
                functionQuery: {
                    className: "Test",
                    methodName: "test",
                    kind: "Async",
                },
            },
        ]);

        // This should trigger println! for version parse error
        const transformer = instrumentor.getTransformer(
            "testmodule",
            "invalid-version-format",
            "test.js"
        );

        expect(transformer).toBeFalsy();
    });
});
