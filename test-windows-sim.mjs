import { create } from "./index.js";
import path from "path";

// Save original path module
const originalPath = { ...path };

// Monkey-patch path module to simulate Windows
Object.assign(path, path.win32);

console.log("=== SIMULATING WINDOWS PATH BEHAVIOR ===");
console.log(`path.sep = "${path.sep}"`);
console.log(`path.delimiter = "${path.delimiter}"`);

// Now import module-details-from-path which will use the Windows path module
const moduleDetailsFromPath = (await import("module-details-from-path")).default;

// Test Windows-style paths
const testPaths = [
    "C:\\project\\node_modules\\openai\\resources\\chat\\completions.mjs",
    "D:\\workspace\\node_modules\\openai\\resources\\embeddings.mjs",
];

const instrumentor = create([
    {
        channelName: "test:openai:chat:completions",
        module: {
            name: "openai",
            versionRange: ">=4.0.0",
            filePath: "resources/chat/completions.mjs", // Config: always forward slashes
        },
        functionQuery: {
            className: "Completions",
            methodName: "create",
            kind: "Async",
        },
    },
    {
        channelName: "test:openai:embeddings",
        module: {
            name: "openai",
            versionRange: ">=4.0.0",
            filePath: "resources/embeddings.mjs", // Config: always forward slashes
        },
        functionQuery: {
            className: "Embeddings",
            methodName: "create",
            kind: "Async",
        },
    },
]);

console.log("\nTesting Windows paths with simulated Windows environment:\n");

for (const filePath of testPaths) {
    console.log(`Testing: ${filePath}`);

    const details = moduleDetailsFromPath(filePath);

    if (details) {
        console.log(`  Module: ${details.name}`);
        console.log(`  Path: "${details.path}"`);
        console.log(`  Has backslashes: ${details.path.includes('\\')}`);
        console.log(`  Has forward slashes: ${details.path.includes('/')}`);

        // This is what the bundler plugin would pass to getTransformer
        const transformer = instrumentor.getTransformer(
            details.name,
            "4.87.0",
            details.path
        );

        console.log(`  Match result: ${transformer ? "✓ MATCHED" : "✗ NO MATCH"}`);

        if (!transformer) {
            console.log(`  ❌ PROBLEM: Config has forward slashes, runtime has backslashes`);
        }

        if (transformer) {
            transformer.free();
        }
    } else {
        console.log(`  ✗ module-details-from-path returned null`);
    }
    console.log();
}

// Restore original path module
Object.assign(path, originalPath);

console.log("=== DIAGNOSIS ===");
console.log("If matches failed above, it confirms the Windows path issue.");
console.log("Configs use forward slashes, but Windows runtime uses backslashes.");
