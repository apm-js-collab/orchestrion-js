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
/// Describes the module and file path you would like to match
pub struct ModuleMatcher {
    /// The name of the module you want to match
    pub name: String,
    /// The semver range that you want to match
    #[cfg_attr(feature = "wasm", tsify(type = "string"))]
    pub version_range: Range,
    /// The path of the file you want to match from the module root
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
/// Configuration for injecting instrumentation code
pub struct InstrumentationConfig {
    /// The name of the diagnostics channel to publish to
    pub channel_name: String,
    /// The module matcher to identify the module and file to instrument
    pub module: ModuleMatcher,
    /// The function query to identify the function to instrument
    pub function_query: FunctionQuery,
}

impl InstrumentationConfig {
    #[must_use]
    pub fn new(channel_name: &str, module: ModuleMatcher, function_query: FunctionQuery) -> Self {
        Self {
            channel_name: channel_name.to_string(),
            module,
            function_query,
        }
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
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_module_matcher_with_forward_slashes() {
        let matcher = ModuleMatcher::new("openai", ">=4.0.0", "resources/chat/completions.mjs")
            .expect("Failed to create matcher");

        // Test with forward slashes (Unix-style)
        let file_path = PathBuf::from("resources/chat/completions.mjs");
        assert!(
            matcher.matches("openai", "4.87.0", &file_path),
            "Should match with forward slashes"
        );
    }

    #[test]
    fn test_module_matcher_with_backslashes() {
        let matcher = ModuleMatcher::new("openai", ">=4.0.0", "resources/chat/completions.mjs")
            .expect("Failed to create matcher");

        // Test with backslashes (Windows-style)
        // This simulates what happens on Windows when actual file paths use backslashes
        let file_path = PathBuf::from("resources\\chat\\completions.mjs");
        assert!(
            matcher.matches("openai", "4.87.0", &file_path),
            "Should match even with backslashes (Windows paths)"
        );
    }

    #[test]
    fn test_module_matcher_mixed_separators() {
        let matcher = ModuleMatcher::new("openai", ">=4.0.0", "resources/beta/chat/completions.mjs")
            .expect("Failed to create matcher");

        // Config has forward slashes, file path has backslashes
        let file_path = PathBuf::from("resources\\beta\\chat\\completions.mjs");
        assert!(
            matcher.matches("openai", "4.87.0", &file_path),
            "Should match with mixed separators"
        );
    }
}
