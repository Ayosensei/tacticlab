mod models;
mod engine;

use wasm_bindgen::prelude::*;
use crate::models::tactic::{Tactic, AnalysisResult};

#[wasm_bindgen]
pub fn score_tactic(tactic_json: &str) -> String {
    let tactic_result: Result<Tactic, _> = serde_json::from_str(tactic_json);
    
    match tactic_result {
        Ok(tactic) => {
            let mut result = engine::scorer::score(&tactic);
            result.partnerships = engine::partnerships::analyze(&tactic);
            serde_json::to_string(&result).unwrap_or_else(|_| "{}".to_string())
        },
        Err(e) => format!("{{\"error\": \"Failed to parse tactic JSON: {}\"}}", e),
    }
}

#[wasm_bindgen]
pub fn analyze_partnerships(tactic_json: &str) -> String {
    let tactic_result: Result<Tactic, _> = serde_json::from_str(tactic_json);
    
    match tactic_result {
        Ok(tactic) => {
            let result = engine::partnerships::analyze(&tactic);
            serde_json::to_string(&result).unwrap_or_else(|_| "[]".to_string())
        },
        Err(_) => "[]".to_string(),
    }
}
