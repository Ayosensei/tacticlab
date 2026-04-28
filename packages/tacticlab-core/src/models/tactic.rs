use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PlayerPosition {
    pub id: String,
    pub role: String,
    pub duty: String,
    pub x: f32,
    pub y: f32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TacticArrow {
    pub id: String,
    pub from_player_id: String,
    pub to_player_id: String,
    pub arrow_type: String, // rename 'type' to 'arrow_type' for rust keywords
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Tactic {
    pub title: String,
    pub formation: String,
    pub style: String,
    pub mentality: String,
    pub in_possession: HashMap<String, serde_json::Value>,
    pub in_transition: HashMap<String, serde_json::Value>,
    pub out_of_possession: HashMap<String, serde_json::Value>,
    pub players: Vec<PlayerPosition>,
    pub arrows: Vec<TacticArrow>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChannelScores {
    pub left: f32,
    pub right: f32,
    pub central: f32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RelativeRisk {
    pub in_possession: f32,
    pub out_of_possession: f32,
    pub total: f32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Partnership {
    pub player1_id: String,
    pub player2_id: String,
    pub strength: f32,
    pub partnership_type: String, // rename 'type' to 'partnership_type'
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Suggestion {
    pub severity: String, // "critical", "warning", "positive"
    pub area: String,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AnalysisResult {
    pub score: f32,
    pub penetration: ChannelScores,
    pub solidity: ChannelScores,
    pub support: HashMap<String, f32>, // e.g., {"left": 0.5, "right": 0.8}
    pub relative_risk: RelativeRisk,
    pub partnerships: Vec<Partnership>,
    pub suggestions: Vec<Suggestion>,
}
