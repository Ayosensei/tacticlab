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
#[serde(rename_all = "camelCase")]
pub struct PhaseMetrics {
    pub build_up: f32,
    pub creation: f32,
    pub conversion: f32,
    pub rest_defence: f32,
    pub pressing: f32,
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
pub struct Partnership {
    pub player1_id: String,
    pub player2_id: String,
    pub strength: f32,
    pub partnership_type: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Suggestion {
    pub severity: String,
    pub area: String,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AnalysisResult {
    pub phases: PhaseMetrics,
    pub channel_occupation: ChannelOccupation,
    pub rest_defence_structure: String,
    pub partnerships: Vec<Partnership>,
    pub suggestions: Vec<Suggestion>,
}
