import test from "node:test";
import { create } from "../pkg/orchestrion_js.js";

test("test the wasm", async (t) => {
    const transformer = create([
        {
            module: { name: "one", versionRange: ">=1", filePath: "index.js" },
            functionQuery: { className: "Up" },
            channelName: "up:constructor",
        },
        {
            module: { name: "one", versionRange: ">=1", filePath: "index.js" },
            functionQuery: {
                className: "Up",
                methodName: "fetch",
                kind: "Sync",
            },
            channelName: "up:fetch",
        },
    ]);

    const matchedTransforms = transformer.getTransformer(
        "one",
        "1.0.0",
        "index.js",
    );

    t.assert.ok(matchedTransforms);

    const output = matchedTransforms.transform(
        "export class Up { constructor() {console.log('constructor')} fetch() {console.log('fetch')} }",
        true,
    );

    t.assert.snapshot(output);
});
