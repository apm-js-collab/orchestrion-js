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
pub struct InstrumentationMatcher(Instrumentor);

#[wasm_bindgen]
impl InstrumentationMatcher {
    #[wasm_bindgen(js_name = "getTransformer")]
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
pub struct Transformer(InstrumentationVisitor);

#[wasm_bindgen]
impl Transformer {
    /// Transform the given JavaScript code with optional sourcemap support.
    /// # Errors
    /// Returns an error if the transformation fails to find injection points.
    #[wasm_bindgen]
    #[allow(clippy::needless_pass_by_value)]
    pub fn transform(
        &mut self,
        contents: String,
        is_module: ModuleType,
        sourcemap: Option<String>,
    ) -> Result<TransformOutput, JsError> {
        self.0
            .transform(&contents, is_module.into(), sourcemap.as_deref())
            .map_err(|e| JsError::new(&e.to_string()))
    }
}

#[wasm_bindgen]
#[must_use]
pub fn create(
    configs: Vec<InstrumentationConfig>,
    dc_module: Option<String>,
) -> InstrumentationMatcher {
    InstrumentationMatcher(Instrumentor::new(Config::new(configs, dc_module)))
}
