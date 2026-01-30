import moduleDetailsFromPath from "module-details-from-path";

// Test different path formats that a bundler might provide on Windows
const testPaths = [
    // Absolute Windows path with backslashes (native)
    "D:\\project\\node_modules\\openai\\resources\\chat\\completions.mjs",

    // Absolute Windows path with forward slashes (esbuild might normalize to this)
    "D:/project/node_modules/openai/resources/chat/completions.mjs",

    // Relative path with backslashes
    "node_modules\\openai\\resources\\chat\\completions.mjs",

    // Relative path with forward slashes
    "node_modules/openai/resources/chat/completions.mjs",
];

console.log("\n=== Testing module-details-from-path ===");
console.log(`Platform: ${process.platform}\n`);

for (const filePath of testPaths) {
    console.log(`Input: "${filePath}"`);

    const details = moduleDetailsFromPath(filePath);

    if (details) {
        console.log(`  ✓ Module name: ${details.name}`);
        console.log(`  ✓ Relative path: ${details.path}`);
        console.log(`  ✓ Basedir: ${details.basedir}`);
        console.log(`  ✓ Path has backslashes: ${details.path.includes("\\")}`);
        console.log(`  ✓ Path has forward slashes: ${details.path.includes("/")}`);
    } else {
        console.log(`  ✗ Returns null - path doesn't contain node_modules`);
    }

    console.log();
}

console.log("=========================================\n");
