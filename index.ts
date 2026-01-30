import type { InstrumentationConfig, InstrumentationMatcher, create as internalCreate, debugPathNormalization as internalDebugPathNormalization } from './pkg/orchestrion_js';

// ./pkg/orchestrion_js.js has a side effect of loading the wasm binary.
// We only want that if the library is actually used!
let cachedCreate: typeof internalCreate | undefined;
let cachedDebugPathNormalization: typeof internalDebugPathNormalization | undefined;

/**
 * Create a new instrumentation matcher from an array of instrumentation configs.
 */
export function create(configs: InstrumentationConfig[], dc_module?: string | null): InstrumentationMatcher {
    if (!cachedCreate) {
        cachedCreate = require('./pkg/orchestrion_js.js').create;
    }

    if (cachedCreate === undefined) {
        throw new Error("Failed to load '@apm-js-collab/code-transformer'");
    }

    return cachedCreate(configs, dc_module);
}

/**
 * Debug function to show how paths are normalized in WASM.
 * Returns a JSON string with the normalized paths.
 */
export function debugPathNormalization(configPath: string, runtimePath: string): string {
    if (!cachedDebugPathNormalization) {
        cachedDebugPathNormalization = require('./pkg/orchestrion_js.js').debugPathNormalization;
    }

    if (cachedDebugPathNormalization === undefined) {
        throw new Error("Failed to load '@apm-js-collab/code-transformer'");
    }

    return cachedDebugPathNormalization(configPath, runtimePath);
}

export type {
    FunctionKind,
    FunctionQuery,
    InstrumentationConfig,
    InstrumentationMatcher,
    ModuleMatcher,
    ModuleType,
    TransformOutput,
    Transformer,
} from './pkg/orchestrion_js'
