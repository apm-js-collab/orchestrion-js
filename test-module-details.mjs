import { create } from "./index.js";
import moduleDetailsFromPath from "module-details-from-path";
import path from "path";

// Simulate different Windows file paths that esbuild might provide
const testPaths = [
    // Unix-style (what we get on macOS/Linux)
    "/project/node_modules/openai/resources/chat/completions.mjs",
    // Windows-style with forward slashes (esbuild might normalize to this)
    "C:/project/node_modules/openai/resources/chat/completions.mjs",
    // Windows-style with backslashes (native Windows paths)
    "C:\\project\\node_modules\\openai\\resources\\chat\\completions.mjs",
];

// Create instrumentor with config using forward slashes (like sdk-ts does)
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

console.log("Testing path matching with module-details-from-path:\n");

for (const filePath of testPaths) {
    console.log(`\nTesting file path: ${filePath}`);

    const details = moduleDetailsFromPath(filePath);

    if (details) {
        console.log(`  Module name: ${details.name}`);
        console.log(`  Relative path: ${details.path}`);
        console.log(`  Path contains backslashes: ${details.path.includes('\\')}`);
        console.log(`  Path contains forward slashes: ${details.path.includes('/')}`);

        // Try to get transformer with the path module-details-from-path returns
        const transformer = instrumentor.getTransformer(
            details.name,
            "4.87.0",
            details.path
        );

        console.log(`  getTransformer result: ${transformer ? "MATCHED" : "NO MATCH"}`);

        if (transformer) {
            transformer.free();
        }
    } else {
        console.log("  module-details-from-path returned null");
    }
}
