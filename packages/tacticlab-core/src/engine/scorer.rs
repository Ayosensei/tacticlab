use crate::models::tactic::{Tactic, AnalysisResult, PhaseMetrics, ChannelOccupation, Suggestion};
use std::collections::HashMap;

pub fn score(tactic: &Tactic) -> AnalysisResult {
    let mut suggestions = Vec::new();
    
    // 1. Channel Occupation (Movement Vectors)
    let mut channels = ChannelOccupation {
        wide_left: 0.0,
        half_space_left: 0.0,
        center: 0.0,
        half_space_right: 0.0,
        wide_right: 0.0,
    };
    
    let mut rest_defence_count = 0;
    let mut build_up_count = 0;
    let mut creation_count = 0;
    let mut conversion_count = 0;
    
    let mut dms_on_defend = 0;
    let mut attacking_wbs = 0;

    for player in &tactic.players {
        // Calculate Movement Vector (where do they end up in possession?)
        let mut target_x = player.x;
        let mut target_y = player.y;
        
        // Simple role-based movement logic
        match player.role.as_str() {
            "Inverted Wing Back" => {
                target_x = if player.x < 50.0 { 35.0 } else { 65.0 }; // Moves into half-space
                target_y = 60.0; // Moves up to DM strata
            },
            "Inverted Winger" | "Inside Forward" => {
                target_x = if player.x < 50.0 { 35.0 } else { 65.0 }; // Cuts inside
                target_y = 25.0;
            },
            "Mezzala" => {
                target_x = if player.x < 50.0 { 20.0 } else { 80.0 }; // Drifts wide
            },
            "False Nine" | "Deep Lying Forward" => {
                target_y = 35.0; // Drops deep
            },
            _ => {
                // Generic duty-based vertical movement
                if player.duty == "Attack" { target_y -= 15.0; }
                else if player.duty == "Defend" { target_y += 5.0; }
            }
        }
        
        // Map to channels (0-100 width)
        if target_x < 20.0 { channels.wide_left += 1.0; }
        else if target_x < 40.0 { channels.half_space_left += 1.0; }
        else if target_x < 60.0 { channels.center += 1.0; }
        else if target_x < 80.0 { channels.half_space_right += 1.0; }
        else { channels.wide_right += 1.0; }
        
        // Phase counts based on starting strata and duty
        if player.y > 60.0 && player.duty != "Attack" {
            rest_defence_count += 1;
        }
        
        if player.y > 70.0 { build_up_count += 1; }
        if player.y > 40.0 && player.y <= 70.0 { creation_count += 1; }
        if player.y <= 40.0 || player.duty == "Attack" { conversion_count += 1; }
        
        // Specific tracking for insights
        if (player.role == "Defensive Midfielder" || player.role == "Anchor" || player.role == "Half Back") && player.duty == "Defend" {
            dms_on_defend += 1;
        }
        if (player.role == "Wing Back" || player.role == "Complete Wing-Back") && player.duty == "Attack" {
            attacking_wbs += 1;
        }
    }

    // 2. Phase Metrics Calculation (0-100)
    let phases = PhaseMetrics {
        build_up: (build_up_count as f32 * 25.0).min(100.0),
        creation: (creation_count as f32 * 25.0).min(100.0),
        conversion: (conversion_count as f32 * 20.0).min(100.0),
        rest_defence: (rest_defence_count as f32 * 20.0).min(100.0),
        pressing: 50.0, // Default, updated by instructions later
    };

    // 3. FM-Specific Insights
    
    // Channel Occupation Checks
    if channels.wide_left < 1.0 && channels.wide_right < 1.0 {
        suggestions.push(Suggestion {
            severity: "critical".to_string(),
            area: "attack".to_string(),
            message: "No natural width. Your attacks will be forced entirely through the center, making you easy to defend against.".to_string(),
        });
    } else if channels.wide_left < 1.0 {
        suggestions.push(Suggestion {
            severity: "warning".to_string(),
            area: "attack".to_string(),
            message: "Lack of width on the left flank. Consider a winger or an overlapping wing-back to stretch the opposition.".to_string(),
        });
    }
    
    // Half-Space Overcrowding
    if channels.half_space_left > 2.0 || channels.half_space_right > 2.0 {
        suggestions.push(Suggestion {
            severity: "warning".to_string(),
            area: "attack".to_string(),
            message: "Half-space congestion. You have too many players moving into the same creative channels, stepping on each other's toes.".to_string(),
        });
    }

    // Rest Defence Evaluation
    let rest_def_structure = if rest_defence_count == 5 {
        "3-2".to_string()
    } else if rest_defence_count == 4 {
        if dms_on_defend > 0 { "3-1".to_string() } else { "2-2".to_string() }
    } else if rest_defence_count < 4 {
        "Vulnerable".to_string()
    } else {
        "Solid".to_string()
    };
    
    if rest_defence_count < 4 {
        suggestions.push(Suggestion {
            severity: "critical".to_string(),
            area: "defence".to_string(),
            message: "Extremely weak Rest Defence. Leaving fewer than 4 players back exposes your center-backs to dangerous counter-attacks.".to_string(),
        });
    }
    
    if attacking_wbs > 1 && dms_on_defend == 0 {
         suggestions.push(Suggestion {
            severity: "critical".to_string(),
            area: "defence".to_string(),
            message: "Both Wing-Backs are attacking, but there is no holding midfielder (Anchor/Half-Back) to drop in and form a back three. Huge counter-attack risk.".to_string(),
        });
    }

    AnalysisResult {
        phases,
        channel_occupation: channels,
        rest_defence_structure: rest_def_structure,
        partnerships: Vec::new(),
        suggestions,
    }
}
