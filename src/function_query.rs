/**
 * Unless explicitly stated otherwise all files in this repository are licensed under the Apache-2.0 License.
 * This product includes software developed at Datadog (<https://www.datadoghq.com>/). Copyright 2025 Datadog, Inc.
 **/
use swc_core::ecma::ast::{FnDecl, FnExpr, Function};

#[derive(Debug, Clone)]
pub enum FunctionType {
    FunctionDeclaration,
    FunctionExpression,
    Method,
}

#[derive(Debug, Clone)]
pub enum FunctionKind {
    Sync,
    Async,
    Generator,
    AsyncGenerator,
}

impl FunctionKind {
    #[must_use]
    pub fn is_async(&self) -> bool {
        matches!(self, FunctionKind::Async | FunctionKind::AsyncGenerator)
    }

    #[must_use]
    pub fn is_generator(&self) -> bool {
        matches!(self, FunctionKind::Generator | FunctionKind::AsyncGenerator)
    }

    #[must_use]
    pub fn matches(&self, func: &Function) -> bool {
        match self {
            FunctionKind::Sync => !func.is_async && !func.is_generator,
            FunctionKind::Async => func.is_async && !func.is_generator,
            FunctionKind::Generator => !func.is_async && func.is_generator,
            FunctionKind::AsyncGenerator => func.is_async && func.is_generator,
        }
    }
}

#[derive(Debug, Clone)]
pub struct FunctionQuery {
    pub name: String,
    pub class: Option<String>,
    pub typ: FunctionType,
    pub kind: FunctionKind,
    pub index: usize,
}

impl FunctionQuery {
    fn maybe_increment_count(&self, matches_except_count: bool, count: &mut usize) -> bool {
        if matches_except_count {
            if self.index == *count {
                true
            } else {
                *count += 1;
                false
            }
        } else {
            false
        }
    }

    pub fn matches_decl(&self, func: &FnDecl, count: &mut usize) -> bool {
        let matches_except_count = matches!(self.typ, FunctionType::FunctionDeclaration)
            && self.kind.matches(&func.function)
            && func.ident.sym == self.name;
        self.maybe_increment_count(matches_except_count, count)
    }

    pub fn matches_expr(&self, func: &FnExpr, count: &mut usize, name: &str) -> bool {
        let matches_except_count = matches!(self.typ, FunctionType::FunctionExpression)
            && self.kind.matches(&func.function)
            && name == self.name;
        self.maybe_increment_count(matches_except_count, count)
    }

    pub fn matches_method(&self, func: &Function, count: &mut usize, name: &str) -> bool {
        let matches_except_count = matches!(self.typ, FunctionType::Method)
            && self.kind.matches(func)
            && name == self.name;
        self.maybe_increment_count(matches_except_count, count)
    }
}
