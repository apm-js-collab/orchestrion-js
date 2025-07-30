import { create } from "../../pkg/orchestrion_js.js";
import { describe, test, expect } from "vitest";
import tsc from "typescript";
import { SourceMapConsumer } from "source-map";

describe('Orchestrion JS Transformer', () => {
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

    test('should get transformer for matching module', () => {
        expect(matchedTransforms).toBeTruthy();
    });

    test('should transform ESM module correctly', () => {
        const originalEsm = `export class Up {
	constructor() {
		console.log('constructor')
	}

	fetch() {
		console.log('fetch')
	}
}`;

        const output = matchedTransforms.transform(originalEsm, 'esm');
        expect(output).toMatchSnapshot();
    });

    test('should transform CommonJS module correctly', () => {
        const originalCjs = `module.exports = class Up {
	constructor() {
		console.log('constructor')
	}

	fetch() {
		console.log('fetch')
	}
}

`;
        const outputCjs = matchedTransforms.transform(originalCjs, 'cjs');
        expect(outputCjs).toMatchSnapshot();
    });

    test('should transform TypeScript with source map correctly', async () => {
        const originalTypescript = `type Url = { href: string };

export class Up {
    constructor() {
        console.log('constructor');
    }
    fetch(url: Url): void {
        console.log('fetch');
    }
}`;

        const { outputText: outputJavaScript, sourceMapText: originalTypescriptSourceMap } = tsc.transpileModule(originalTypescript, {
            compilerOptions: {
                module: tsc.ModuleKind.ESNext,
                target: tsc.ScriptTarget.ESNext,
                sourceMap: true,
            }
        });

        const outputTs = matchedTransforms.transform(
            outputJavaScript,
            "esm",
            originalTypescriptSourceMap,
        );

        expect(outputTs).toMatchSnapshot();

        const sourceMapConsumer = (await new SourceMapConsumer(JSON.parse(outputTs.map)));

        const originalPosition = sourceMapConsumer.originalPositionFor({
            // This is the position of the fetch function in the transformed JavaScript
            line: 31,
            column: 4,
        });

        // This is the position of the fetch function in the original TypeScript
        expect(originalPosition.line).toEqual(7);
        expect(originalPosition.column).toEqual(4);

        sourceMapConsumer.destroy();
    });

    test('should throw error when no injection points are found', () => {
        const noMatchSource = `export class Down {
	constructor() {
		console.log('constructor')
	}

	fetch() {
		console.log('fetch')
	}
}`;

        expect(() => {
            matchedTransforms.transform(noMatchSource, 'unknown');
        }).toThrow('Failed to find injection points for: ["constructor", "fetch"]');
    });
});
