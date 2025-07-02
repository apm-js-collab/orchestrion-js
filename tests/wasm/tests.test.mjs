import { create } from "../../pkg/orchestrion_js.js";
import { describe, test, expect } from "vitest";

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

    test('should transform TypeScript with source map correctly', () => {
        const originalTypescript = `export class Up {
    constructor() {
        console.log('constructor');
    }
    fetch(url) {
        console.log('fetch');
    }
}`;

        const originalTypescriptSourceMap = `{"version":3,"file":"typescript.js","sourceRoot":"","sources":["typescript.ts"],"names":[],"mappings":"AAAA,MAAM,OAAO,EAAE;IACd;QACC,OAAO,CAAC,GAAG,CAAC,aAAa,CAAC,CAAA;IAC3B,CAAC;IAED,KAAK,CAAC,GAAW;QAChB,OAAO,CAAC,GAAG,CAAC,OAAO,CAAC,CAAA;IACrB,CAAC;CACD"}`;

        const outputTs = matchedTransforms.transformWithSourcemap(
            "typescript.js",
            originalTypescript,
            "esm",
            originalTypescriptSourceMap,
        );

        expect(outputTs.code).toMatchSnapshot();
        expect(outputTs.map).toMatchSnapshot();
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
