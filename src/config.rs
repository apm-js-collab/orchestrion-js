/**
 * Unless explicitly stated otherwise all files in this repository are licensed under the Apache-2.0 License.
 * This product includes software developed at Datadog (<https://www.datadoghq.com>/). Copyright 2025 Datadog, Inc.
 **/
use crate::function_query::FunctionQuery;
use nodejs_semver::{Range, Version};
use std::path::PathBuf;

#[derive(Clone, Debug)]
pub enum InstrumentationOperator {
    Callback,
    Promise,
    Sync,
    Async,
}

impl InstrumentationOperator {
    #[must_use]
    pub fn as_str(&self) -> &'static str {
        match self {
            InstrumentationOperator::Callback => "traceCallback",
            InstrumentationOperator::Promise => "tracePromise",
            InstrumentationOperator::Sync => "traceSync",
            InstrumentationOperator::Async => "traceAsync",
        }
    }
}

#[derive(Debug, Clone)]
pub struct InstrumentationConfig {
    pub module_name: String,
    pub version_range: Range,
    pub file_path: PathBuf,
    pub function_query: FunctionQuery,
    pub operator: InstrumentationOperator,
    pub channel_name: String,
}

#[derive(Debug, Clone)]
pub struct Config {
    pub instrumentations: Vec<InstrumentationConfig>,
    pub dc_module: String,
}

impl Config {
    #[must_use]
    pub fn new(instrumentations: Vec<InstrumentationConfig>, dc_module: String) -> Self {
        Self {
            instrumentations,
            dc_module,
        }
    }

    #[must_use]
    pub fn new_single_with_default_dc_module(instrumentation: InstrumentationConfig) -> Self {
        Self {
            instrumentations: vec![instrumentation],
            dc_module: "diagnostics_channel".to_string(),
        }
    }
}

impl InstrumentationConfig {
    #[must_use]
    pub fn matches(&self, module_name: &str, version: &str, file_path: &PathBuf) -> bool {
        let version: Version = match version.parse() {
            Ok(v) => v,
            Err(e) => {
                println!("Failed to parse version {version}: {e}");
                return false;
            }
        };

        self.module_name == module_name
            && version.satisfies(&self.version_range)
            && self.file_path == *file_path
    }
}
