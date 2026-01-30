import { create } from "./index.js";
import path from "path";

// Manually simulate what module-details-from-path does on Windows
function simulateModuleDetailsWindows(filePath) {
    const sep = '\\';  // Windows separator
    const segments = filePath.split(sep);
    const index = segments.lastIndexOf('node_modules');

    if (index === -1) return null;
    if (!segments[index + 1]) return null;

    const scoped = segments[index + 1][0] === '@';
    const name = scoped
        ? segments[index + 1] + '/' + segments[index + 2]
        : segments[index + 1];
    const offset = scoped ? 3 : 2;

    // Reconstruct the relative path using Windows separators
    let relativePath = '';
    const lastSegmentIndex = segments.length - 1;
    for (let i = index + offset; i <= lastSegmentIndex; i++) {
        if (i === lastSegmentIndex) {
            relativePath += segments[i];
        } else {
            relativePath += segments[i] + sep;  // Use backslash on Windows
        }
    }

    return {
        name,
        path: relativePath
    };
}

// Create instrumentor with configs (always forward slashes)
const instrumentor = create([
    {
        channelName: "test:openai:chat:completions",
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
    {
        channelName: "test:openai:embeddings",
        module: {
            name: "openai",
            versionRange: ">=4.0.0",
            filePath: "resources/embeddings.mjs", // Config: forward slashes
        },
        functionQuery: {
            className: "Embeddings",
            methodName: "create",
            kind: "Async",
        },
    },
]);

console.log("=== SIMULATING WINDOWS MODULE-DETAILS-FROM-PATH ===\n");

const windowsPaths = [
    "D:\\workspace\\node_modules\\openai\\resources\\chat\\completions.mjs",
    "D:\\workspace\\node_modules\\openai\\resources\\embeddings.mjs",
    "C:\\project\\node_modules\\openai\\resources\\chat\\completions.mjs",
];

for (const windowsPath of windowsPaths) {
    console.log(`Windows file path: ${windowsPath}`);

    const details = simulateModuleDetailsWindows(windowsPath);

    if (details) {
        console.log(`  Module: ${details.name}`);
        console.log(`  Relative path: "${details.path}"`);
        console.log(`  Contains backslashes: ${details.path.includes('\\')}`);
        console.log(`  Contains forward slashes: ${details.path.includes('/')}`);

        // This is what would be passed to getTransformer on Windows
        const transformer = instrumentor.getTransformer(
            details.name,
            "4.87.0",
            details.path  // This will have backslashes on Windows
        );

        if (transformer) {
            console.log(`  ✓ MATCHED`);
            transformer.free();
        } else {
            console.log(`  ✗ NO MATCH`);
            console.log(`  ISSUE: Config path "resources/chat/completions.mjs" (forward slashes)`);
            console.log(`         Runtime path "${details.path}" (backslashes)`);
        }
    } else {
        console.log(`  ✗ Failed to parse module details`);
    }
    console.log();
}

console.log("=== KEY FINDING ===");
console.log("This shows exactly what happens on Windows:");
console.log("- Configs always use forward slashes");
console.log("- module-details-from-path returns paths with backslashes on Windows");
console.log("- Path comparison fails unless we normalize separators");
