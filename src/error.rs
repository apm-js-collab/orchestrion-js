/**
 * Unless explicitly stated otherwise all files in this repository are licensed under the Apache-2.0 License.
 * This product includes software developed at Datadog (<https://www.datadoghq.com>/). Copyright 2025 Datadog, Inc.
 **/
use std::fmt::{self, Display, Formatter};

#[derive(Debug)]
pub enum OrchestrionError {
    InjectionMatchFailure(Vec<String>),
}

impl std::error::Error for OrchestrionError {}

impl Display for OrchestrionError {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        match self {
            OrchestrionError::InjectionMatchFailure(missing) => {
                write!(f, "Failed to find injection points for: {missing:?}")
            }
        }
    }
}
