import { create } from "../../index.js";
import { describe, test, expect } from "vitest";

describe('Windows Path Matching', () => {
    test('should match config forward slashes with runtime backslashes', () => {
        // This simulates the real-world scenario:
        // - Config uses forward slashes (as written in JS configs)
        // - Runtime path on Windows uses backslashes (from Node.js)

        const instrumentor = create([
            {
                channelName: "test:method",
                module: {
                    name: "openai",
                    versionRange: ">=4.0.0",
                    filePath: "resources/chat/completions.mjs", // Forward slashes
                },
                functionQuery: {
                    className: "Completions",
                    methodName: "create",
                    kind: "Async",
                },
            },
        ]);

        // Test 1: Forward slashes (Unix/macOS)
        const unixTransformer = instrumentor.getTransformer(
            "openai",
            "4.87.0",
            "resources/chat/completions.mjs"
        );
        expect(unixTransformer).toBeTruthy();
        if (unixTransformer) unixTransformer.free();

        // Test 2: Backslashes (Windows)
        const windowsTransformer = instrumentor.getTransformer(
            "openai",
            "4.87.0",
            "resources\\chat\\completions.mjs"  // Backslashes as Node.js would provide on Windows
        );
        expect(windowsTransformer).toBeTruthy();
        if (windowsTransformer) windowsTransformer.free();

        instrumentor.free();
    });

    test('should match various path formats', () => {
        const instrumentor = create([
            {
                channelName: "test:beta",
                module: {
                    name: "openai",
                    versionRange: ">=4.0.0",
                    filePath: "resources/beta/chat/completions.mjs",
                },
                functionQuery: {
                    className: "Completions",
                    methodName: "parse",
                    kind: "Async",
                },
            },
        ]);

        // All these should match:
        const paths = [
            "resources/beta/chat/completions.mjs",      // Forward slashes
            "resources\\beta\\chat\\completions.mjs",   // Backslashes
            "resources/beta\\chat/completions.mjs",     // Mixed (shouldn't happen but be robust)
        ];

        for (const path of paths) {
            const transformer = instrumentor.getTransformer("openai", "4.87.0", path);
            expect(transformer, `Should match path: ${path}`).toBeTruthy();
            if (transformer) transformer.free();
        }

        instrumentor.free();
    });
});
