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

const originalCjs = await fs.readFile(path.join(import.meta.dirname, './testdata/original-cjs.js'))
const outputCjs = matchedTransforms.transform(originalCjs.toString('utf8'), false);


const expectedCjs = await fs.readFile(path.join(import.meta.dirname, './testdata/expected-cjs.js'))
assert.strictEqual(outputCjs, expectedCjs.toString('utf8'));

const noMatch = await fs.readFile(path.join(import.meta.dirname, './testdata/no-match.mjs'));

assert.throws(() => {
    matchedTransforms.transform(noMatch.toString('utf8'), true);
}, { message: "Failed to find injection points for: [\"constructor\", \"fetch\"]" });
