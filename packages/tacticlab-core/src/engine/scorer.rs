use crate::models::tactic::{Tactic, AnalysisResult, PhaseMetrics, ChannelOccupation, Suggestion, PassingTriangle};
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

    // Transition & Defensive Instructions Analysis
    let mut pressing_intensity = 50.0;
    
    // Counter-Press vs Rest Defence
    if let Some(pos_lost) = tactic.in_transition.get("when_possession_lost") {
        if let Some(action) = pos_lost.as_str() {
            if action == "Counter-Press" {
                pressing_intensity += 20.0;
                if rest_defence_count < 4 {
                    suggestions.push(Suggestion {
                        severity: "critical".to_string(),
                        area: "defence".to_string(),
                        message: "Counter-Press selected with a vulnerable Rest Defence. If the initial press is beaten, your center-backs are completely exposed.".to_string(),
                    });
                }
            } else if action == "Regroup" {
                pressing_intensity -= 20.0;
            }
        }
    }

    // Counter-Attack Intent
    if let Some(pos_won) = tactic.in_transition.get("when_possession_won") {
        if let Some(action) = pos_won.as_str() {
            if action == "Counter" {
                let attack_duties = tactic.players.iter().filter(|p| p.duty == "Attack").count();
                if attack_duties < 2 {
                    suggestions.push(Suggestion {
                        severity: "warning".to_string(),
                        area: "attack".to_string(),
                        message: "Counter-attack selected, but you have very few Attack duties to provide sprinting outlets.".to_string(),
                    });
                }
            }
        }
    }

    // GK Distribution
    if let Some(gk_dist) = tactic.in_transition.get("gk_distribution_area") {
        if let Some(area) = gk_dist.as_str() {
            if area == "Distribute Over Opposition Defence" {
                let has_pace_forward = tactic.players.iter().any(|p| p.role == "Advanced Forward" || p.role == "Poacher");
                if !has_pace_forward {
                    suggestions.push(Suggestion {
                        severity: "warning".to_string(),
                        area: "attack".to_string(),
                        message: "Distribute over defence selected, but you lack a pacey forward (e.g., Advanced Forward) to chase those long balls.".to_string(),
                    });
                }
            }
        }
    }

    // Out of Possession Logic
    let mut high_line = false;
    let mut low_loe = false;
    
    if let Some(dl) = tactic.out_of_possession.get("defensive_line") {
        if let Some(dl_str) = dl.as_str() {
            if dl_str == "Higher" || dl_str == "Much Higher" {
                high_line = true;
                let has_sweeper_keeper = tactic.players.iter().any(|p| p.role == "Sweeper Keeper");
                if !has_sweeper_keeper {
                    suggestions.push(Suggestion {
                        severity: "warning".to_string(),
                        area: "defence".to_string(),
                        message: "High defensive line selected without a Sweeper Keeper. You are vulnerable to balls over the top.".to_string(),
                    });
                }
            }
        }
    }

    if let Some(loe) = tactic.out_of_possession.get("line_of_engagement") {
        if let Some(loe_str) = loe.as_str() {
            if loe_str == "Lower" || loe_str == "Much Lower" {
                low_loe = true;
            }
        }
    }

    if let Some(press) = tactic.out_of_possession.get("trigger_press") {
        if let Some(press_str) = press.as_str() {
            if press_str == "Much More Often" {
                pressing_intensity += 30.0;
                if low_loe {
                    suggestions.push(Suggestion {
                        severity: "warning".to_string(),
                        area: "defence".to_string(),
                        message: "Trigger Press Much More Often selected alongside a Low Line of Engagement. Your pressing strategy is disconnected and easily bypassed.".to_string(),
                    });
                }
            } else if press_str == "Much Less Often" {
                pressing_intensity -= 30.0;
            }
        }
    }
    
    if let Some(prev_short) = tactic.out_of_possession.get("prevent_short_gk_distribution") {
        // prevent_short is a toggle, represented as bool in the record
        if prev_short.as_bool().unwrap_or(false) {
             let forward_count = tactic.players.iter().filter(|p| p.y < 35.0).count();
             if forward_count < 2 {
                 suggestions.push(Suggestion {
                    severity: "warning".to_string(),
                    area: "defence".to_string(),
                    message: "Prevent Short GK Distribution selected with only one forward. They will be easily bypassed while trying to press alone.".to_string(),
                });
             }
        }
    }
    
    let mut phases = PhaseMetrics {
        build_up: (build_up_count as f32 * 25.0).min(100.0),
        creation: (creation_count as f32 * 25.0).min(100.0),
        conversion: (conversion_count as f32 * 20.0).min(100.0),
        rest_defence: (rest_defence_count as f32 * 20.0).min(100.0),
        pressing: pressing_intensity.clamp(0.0, 100.0),
    };

    // 4. Real-World Tactical Metrics
    
    // Vertical Compactness
    let mut min_y = 100.0_f32;
    let mut max_y = 0.0_f32;
    for p in &tactic.players {
        if p.role != "Goalkeeper" && p.role != "Sweeper Keeper" {
            if p.y < min_y { min_y = p.y; }
            if p.y > max_y { max_y = p.y; }
        }
    }
    let vertical_compactness = (max_y - min_y) * 1.05; // ~meters (assuming 105m pitch length)
    
    if vertical_compactness > 55.0 {
        suggestions.push(Suggestion {
            severity: "critical".to_string(),
            area: "central".to_string(),
            message: "Stretched Block. Your team is vertically stretched over 55 meters, leaving massive spaces between the lines for the opposition to exploit.".to_string(),
        });
    } else if vertical_compactness < 25.0 {
        suggestions.push(Suggestion {
            severity: "warning".to_string(),
            area: "central".to_string(),
            message: "Extremely compact. While defensively solid, you may struggle to transition effectively if players are stepping on each other's toes.".to_string(),
        });
    }

    // Build-Up Structure
    let defenders = tactic.players.iter().filter(|p| p.y > 65.0).count();
    let deep_mids = tactic.players.iter().filter(|p| p.y > 45.0 && p.y <= 65.0).count();
    
    let build_up_structure = format!("{}-{}", defenders, deep_mids);
    
    if build_up_structure == "4-0" || build_up_structure == "3-0" || build_up_structure == "2-0" {
        suggestions.push(Suggestion {
            severity: "critical".to_string(),
            area: "defence".to_string(),
            message: "Flat build-up structure with no pivot. You will struggle to play through the first line of an opposition press.".to_string(),
        });
    }

    // Passing Triangles (Basic geometric detection)
    let mut passing_triangles = Vec::new();
    let num_players = tactic.players.len();
    
    // O(N^3) is fine since N=11
    for i in 0..num_players {
        for j in i+1..num_players {
            for k in j+1..num_players {
                let p1 = &tactic.players[i];
                let p2 = &tactic.players[j];
                let p3 = &tactic.players[k];
                
                let dist12 = ((p1.x - p2.x).powi(2) + (p1.y - p2.y).powi(2)).sqrt();
                let dist23 = ((p2.x - p3.x).powi(2) + (p2.y - p3.y).powi(2)).sqrt();
                let dist31 = ((p3.x - p1.x).powi(2) + (p3.y - p1.y).powi(2)).sqrt();
                
                // A good passing triangle has distances between ~15 and ~35 units
                if dist12 > 10.0 && dist12 < 35.0 && 
                   dist23 > 10.0 && dist23 < 35.0 && 
                   dist31 > 10.0 && dist31 < 35.0 {
                       
                    // Rough strength based on how equilateral it is (closer to 1.0 is better)
                    let avg_dist = (dist12 + dist23 + dist31) / 3.0;
                    let variance = ((dist12 - avg_dist).powi(2) + (dist23 - avg_dist).powi(2) + (dist31 - avg_dist).powi(2)) / 3.0;
                    let strength = (1.0 - (variance / 100.0)).clamp(0.0, 1.0);
                    
                    passing_triangles.push(PassingTriangle {
                        player1_id: p1.id.clone(),
                        player2_id: p2.id.clone(),
                        player3_id: p3.id.clone(),
                        strength,
                    });
                }
            }
        }
    }
    
    // Sort and keep top 5 strongest triangles to avoid visual clutter
    passing_triangles.sort_by(|a, b| b.strength.partial_cmp(&a.strength).unwrap_or(std::cmp::Ordering::Equal));
    passing_triangles.truncate(5);

    AnalysisResult {
        phases,
        channel_occupation: channels,
        rest_defence_structure: rest_def_structure,
        build_up_structure,
        vertical_compactness,
        passing_triangles,
        suggestions,
    }
}
