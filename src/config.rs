/**
 * Unless explicitly stated otherwise all files in this repository are licensed under the Apache-2.0 License.
 * This product includes software developed at Datadog (<https://www.datadoghq.com>/). Copyright 2025 Datadog, Inc.
 **/
use crate::function_query::FunctionQuery;
use nodejs_semver::{Range, SemverError, Version};
use std::path::PathBuf;

#[cfg_attr(feature = "wasm", derive(tsify::Tsify))]
#[cfg_attr(
    feature = "serde",
    derive(serde::Serialize, serde::Deserialize),
    serde(rename_all = "camelCase")
)]
#[derive(Debug, Clone)]
pub struct ModuleMatcher {
    pub name: String,
    pub version_range: Range,
    pub file_path: PathBuf,
}

impl ModuleMatcher {
    /// Creates a new `ModuleMatcher` instance.
    /// # Errors
    /// Returns an error if the version range cannot be parsed.
    pub fn new(name: &str, version_range: &str, file_path: &str) -> Result<Self, SemverError> {
        Ok(Self {
            name: name.to_string(),
            version_range: Range::parse(version_range)?,
            file_path: PathBuf::from(file_path),
        })
    }

    #[must_use]
    pub fn matches(&self, module_name: &str, version: &str, file_path: &PathBuf) -> bool {
        let version: Version = match version.parse() {
            Ok(v) => v,
            Err(e) => {
                println!("Failed to parse version {version}: {e}");
                return false;
            }
        };

        self.name == module_name
            && version.satisfies(&self.version_range)
            && self.file_path == *file_path
    }
}

#[cfg_attr(feature = "wasm", derive(tsify::Tsify))]
#[cfg_attr(
    feature = "serde",
    derive(serde::Serialize, serde::Deserialize),
    serde(rename_all = "camelCase")
)]
#[derive(Debug, Clone)]
/// `CallbackConfig` represents details needed when wrapping a function that
/// accepts a callback. These details will be used to construct the
/// `tracingChannel.traceCallback` invocation.
pub struct CallbackConfig {
    /// `position` is the ordinal of the callback function within the wrapped
    /// function's parameter list. A value of `-1` indicates that the callback
    /// is the last parameter in the list. The value is zero based.
    pub position: i32,
}

#[cfg_attr(
    feature = "serde",
    derive(serde::Serialize, serde::Deserialize),
    serde(rename_all = "camelCase")
)]
#[cfg_attr(
    feature = "wasm",
    derive(tsify::Tsify),
    tsify(into_wasm_abi, from_wasm_abi)
)]
#[derive(Debug, Clone)]
pub struct InstrumentationConfig {
    pub channel_name: String,
    pub module: ModuleMatcher,
    pub function_query: FunctionQuery,
    #[tsify(optional)]
    #[serde(default = "InstrumentationConfig::empty_callback_config")]
    pub callback_config: CallbackConfig,
}

impl InstrumentationConfig {
    #[must_use]
    pub fn new(channel_name: &str, module: ModuleMatcher, function_query: FunctionQuery) -> Self {
        return Self::new_with_callback_config(
            channel_name,
            module,
            function_query,
            CallbackConfig { position: -1 },
        );
    }

    #[must_use]
    pub fn new_with_callback_config(
        channel_name: &str,
        module: ModuleMatcher,
        function_query: FunctionQuery,
        callback_config: CallbackConfig,
    ) -> Self {
        return Self {
            channel_name: channel_name.to_string(),
            module,
            function_query,
            callback_config,
        };
    }

    #[must_use]
    pub fn get_identifier_name(&self) -> String {
        self.channel_name
            .chars()
            .map(|c| if c.is_ascii_alphanumeric() { c } else { '_' })
            .collect()
    }
}

#[cfg_attr(
    feature = "serde",
    derive(serde::Serialize, serde::Deserialize),
    serde(rename_all = "camelCase")
)]
#[derive(Debug, Clone)]
pub struct Config {
    pub instrumentations: Vec<InstrumentationConfig>,
    pub dc_module: String,
}

impl Config {
    #[must_use]
    pub fn new(instrumentations: Vec<InstrumentationConfig>, dc_module: Option<String>) -> Self {
        Self {
            instrumentations,
            dc_module: dc_module.unwrap_or_else(|| "diagnostics_channel".to_string()),
        }
    }

    #[must_use]
    pub fn new_single(instrumentation: InstrumentationConfig) -> Self {
        Self::new(vec![instrumentation], None)
    }
}

impl InstrumentationConfig {
    #[must_use]
    pub fn matches(&self, module_name: &str, version: &str, file_path: &PathBuf) -> bool {
        self.module.matches(module_name, version, file_path)
    }

    #[must_use]
    pub fn empty_callback_config() -> CallbackConfig {
        return CallbackConfig { position: -1 };
    }
}
