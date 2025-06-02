import { create } from "../../pkg/orchestrion_js.js";
import * as assert from "node:assert";
import fs from 'node:fs/promises'
import path from 'node:path'

const instrumentor = create([
    {
        channelName: "up:constructor",
        module: { name: "one", versionRange: ">=1", filePath: "index.js" },
        functionQuery: { className: "Up" },
    },
    {
        channelName: "up:fetch",
        module: { name: "one", versionRange: ">=1", filePath: "index.js" },
        functionQuery: {
            className: "Up",
            methodName: "fetch",
            kind: "Sync",
        },
    },
]);

const matchedTransforms = instrumentor.getTransformer(
    "one",
    "1.0.0",
    "index.js",
);

assert.ok(matchedTransforms);

const original = await fs.readFile(path.join(import.meta.dirname, './testdata/original.mjs'))
const output = matchedTransforms.transform(original.toString('utf8'), true);

const expected = await fs.readFile(path.join(import.meta.dirname, './testdata/expected.mjs'))
assert.strictEqual(output, expected.toString('utf8'));
