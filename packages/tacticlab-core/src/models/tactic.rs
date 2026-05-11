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
    pub arrow_type: String,
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
#[serde(rename_all = "camelCase")]
pub struct ChannelOccupation {
    pub wide_left: f32,
    pub half_space_left: f32,
    pub center: f32,
    pub half_space_right: f32,
    pub wide_right: f32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Synergy {
    pub player1_id: String,
    pub player2_id: String,
    pub r#type: String,   // "positive" | "negative" | "tension"
    pub score: u32,       // 0–100
    pub label: String,
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CompatibilityTriangle {
    pub player1_id: String,
    pub player2_id: String,
    pub player3_id: String,
    pub score: u32,
    pub label: String,
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RiskFactor {
    pub area: String,
    pub severity: String,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Suggestion {
    pub severity: String,
    pub area: String,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DutyBalance {
    pub defend: u32,
    pub support: u32,
    pub attack: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AnalysisResult {
    pub tactical_narrative: String,
    pub in_possession_rating: f32,
    pub out_of_possession_rating: f32,
    pub channel_occupation: ChannelOccupation,
    pub rest_defence_structure: String,
    pub build_up_structure: String,
    pub duty_balance: DutyBalance,
    pub penetration: f32,
    pub solidity: f32,
    pub synergies: Vec<Synergy>,
    pub compatibility_triangles: Vec<CompatibilityTriangle>,
    pub risk_factors: Vec<RiskFactor>,
    pub suggestions: Vec<Suggestion>,
}
