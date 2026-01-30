use crate::{Config, InstrumentationConfig, InstrumentationVisitor, Instrumentor, TransformOutput};
use std::path::PathBuf;
use swc::config::IsModule;
use wasm_bindgen::prelude::*;

#[cfg_attr(
    feature = "serde",
    derive(serde::Serialize, serde::Deserialize),
    serde(rename_all = "lowercase")
)]
#[cfg_attr(
    feature = "wasm",
    derive(tsify::Tsify),
    tsify(into_wasm_abi, from_wasm_abi)
)]
/// The type of module being passed - ESM, CJS or unknown
pub enum ModuleType {
    ESM,
    CJS,
    Unknown,
}

impl From<ModuleType> for IsModule {
    fn from(value: ModuleType) -> Self {
        match value {
            ModuleType::ESM => IsModule::Bool(true),
            ModuleType::CJS => IsModule::Bool(false),
            ModuleType::Unknown => IsModule::Unknown,
        }
    }
}

#[wasm_bindgen]
/// The `InstrumentationMatcher` is responsible for matching specific modules
pub struct InstrumentationMatcher(Instrumentor);

#[wasm_bindgen]
impl InstrumentationMatcher {
    #[wasm_bindgen(js_name = "getTransformer")]
    /// Get a transformer for the given module name, version and file path.
    /// Returns `undefined` if no matching instrumentations are found.
    pub fn get_transformer(
        &mut self,
        module_name: &str,
        version: &str,
        file_path: &str,
    ) -> Option<Transformer> {
        let instrumentations =
            self.0
                .get_matching_instrumentations(module_name, version, &PathBuf::from(file_path));

        if instrumentations.has_instrumentations() {
            Some(Transformer(instrumentations))
        } else {
            None
        }
    }
}

#[wasm_bindgen]
/// The Transformer is responsible for transforming JavaScript code.
pub struct Transformer(InstrumentationVisitor);

#[wasm_bindgen]
impl Transformer {
    /// Transform JavaScript code and optionally sourcemap.
    ///
    /// # Errors
    /// Returns an error if the transformation fails to find injection points.
    #[wasm_bindgen]
    #[allow(clippy::needless_pass_by_value)]
    pub fn transform(
        &mut self,
        code: String,
        module_type: ModuleType,
        sourcemap: Option<String>,
    ) -> Result<TransformOutput, JsError> {
        self.0
            .transform(&code, module_type.into(), sourcemap.as_deref())
            .map_err(|e| JsError::new(&e.to_string()))
    }
}

/// Create a new instrumentation matcher from an array of instrumentation configs.
#[wasm_bindgen]
#[must_use]
pub fn create(
    configs: Vec<InstrumentationConfig>,
    dc_module: Option<String>,
) -> InstrumentationMatcher {
    InstrumentationMatcher(Instrumentor::new(Config::new(configs, dc_module)))
}

/// Debug function to show how paths are normalized in WASM.
/// Returns a JSON string with the normalized paths.
#[wasm_bindgen(js_name = "debugPathNormalization")]
#[must_use]
pub fn debug_path_normalization(config_path: &str, runtime_path: &str) -> String {
    let config_buf = PathBuf::from(config_path);
    let runtime_buf = PathBuf::from(runtime_path);

    let config_normalized = config_buf.to_string_lossy().replace('\\', "/");
    let runtime_normalized = runtime_buf.to_string_lossy().replace('\\', "/");

    // Escape backslashes for JSON
    let config_escaped = config_path.replace('\\', "\\\\");
    let runtime_escaped = runtime_path.replace('\\', "\\\\");

    format!(
        r#"{{"configOriginal":"{}","configNormalized":"{}","runtimeOriginal":"{}","runtimeNormalized":"{}","match":{}}}"#,
        config_escaped,
        config_normalized,
        runtime_escaped,
        runtime_normalized,
        config_normalized == runtime_normalized
    )
}
