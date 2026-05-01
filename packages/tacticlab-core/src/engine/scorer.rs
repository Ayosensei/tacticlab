use crate::models::tactic::{Tactic, AnalysisResult, ChannelScores, RelativeRisk, Suggestion};
use std::collections::HashMap;

pub fn score(tactic: &Tactic) -> AnalysisResult {
    let mut penetration = ChannelScores { left: 0.0, right: 0.0, central: 0.0 };
    let mut solidity = ChannelScores { left: 0.0, right: 0.0, central: 0.0 };
    let mut suggestions = Vec::new();

    // 1. Calculate Role Weights and Duty Counts
    let mut total_attack_weight = 0.0;
    let mut total_defend_weight = 0.0;
    
    let mut attack_duties = 0;
    let mut support_duties = 0;
    let mut defend_duties = 0;
    
    let mut has_bpd = false;
    let mut has_true_winger = false;

    for player in &tactic.players {
        let (atk_w, def_w) = get_role_weights(&player.role, &player.duty);
        total_attack_weight += atk_w;
        total_defend_weight += def_w;
        
        match player.duty.as_str() {
            "Attack" => attack_duties += 1,
            "Support" => support_duties += 1,
            "Defend" => defend_duties += 1,
            _ => {}
        }
        
        if player.role == "Ball Playing Defender" {
            has_bpd = true;
        }
        if player.role == "Winger" {
            has_true_winger = true;
        }

        let is_left = player.x < 35.0;
        let is_right = player.x > 65.0;
        let is_central = !is_left && !is_right;

        // Y-axis: 0 is goal, 100 is own goal
        let is_attacking_zone = player.y < 45.0;
        let is_defensive_zone = player.y > 55.0;

        if is_attacking_zone {
            let contribution = atk_w * (1.0 - (player.y / 100.0));
            if is_left { penetration.left += contribution; }
            else if is_right { penetration.right += contribution; }
            else { penetration.central += contribution; }
        }

        if is_defensive_zone {
            let contribution = def_w * (player.y / 100.0);
            if is_left { solidity.left += contribution; }
            else if is_right { solidity.right += contribution; }
            else { solidity.central += contribution; }
        }
    }

    // 2. Duty Balance Checks
    if attack_duties > 4 {
        suggestions.push(Suggestion {
            severity: "warning".to_string(),
            area: "attack".to_string(),
            message: "Too many Attack duties. Players may isolate themselves and fail to link play.".to_string(),
        });
    } else if attack_duties < 2 {
        suggestions.push(Suggestion {
            severity: "warning".to_string(),
            area: "attack".to_string(),
            message: "Insufficient Attack duties. You may lack penetration and movement off the ball.".to_string(),
        });
    }
    
    if defend_duties < 3 {
        suggestions.push(Suggestion {
            severity: "critical".to_string(),
            area: "defence".to_string(),
            message: "Critical lack of Defend duties. Your defensive structure is compromised.".to_string(),
        });
    }

    // 3. Instruction Integration
    // Check passing directness
    if let Some(passing) = tactic.in_possession.get("passing_directness") {
        if let Some(passing_str) = passing.as_str() {
            if passing_str == "Much Shorter" && !has_bpd {
                suggestions.push(Suggestion {
                    severity: "warning".to_string(),
                    area: "central".to_string(),
                    message: "Much Shorter passing selected, but no Ball Playing Defenders to initiate build-up safely.".to_string(),
                });
            }
        }
    }
    
    // Check attacking width
    if let Some(width) = tactic.in_possession.get("attacking_width") {
        if let Some(width_str) = width.as_str() {
            if width_str == "Extremely Wide" && !has_true_winger {
                suggestions.push(Suggestion {
                    severity: "warning".to_string(),
                    area: "attack".to_string(),
                    message: "Extremely Wide attacking width selected, but you lack true Wingers to stretch the play effectively.".to_string(),
                });
            }
        }
    }

    // Check defensive lines
    let mut high_engagement = false;
    if let Some(loe) = tactic.out_of_possession.get("line_of_engagement") {
        if let Some(loe_str) = loe.as_str() {
            if loe_str == "Much Higher" || loe_str == "Higher" {
                high_engagement = true;
            }
        }
    }
    
    let mut low_defensive_line = false;
    if let Some(dl) = tactic.out_of_possession.get("defensive_line") {
        if let Some(dl_str) = dl.as_str() {
            if dl_str == "Much Lower" || dl_str == "Lower" {
                low_defensive_line = true;
            }
        }
    }
    
    if high_engagement && low_defensive_line {
        suggestions.push(Suggestion {
            severity: "critical".to_string(),
            area: "defence".to_string(),
            message: "Disconnected shape: High line of engagement with a low defensive line creates massive space between the lines.".to_string(),
        });
        // Penalize solidity for this structural flaw
        solidity.central *= 0.7;
    }

    // Check for "Hole" in midfield
    let midfield_count = tactic.players.iter().filter(|p| p.y >= 40.0 && p.y <= 60.0).count();
    if midfield_count < 2 {
        suggestions.push(Suggestion {
            severity: "warning".to_string(),
            area: "central".to_string(),
            message: "Midfield gap detected. You may struggle to maintain possession and stop counters.".to_string(),
        });
    }

    // Normalize scores
    penetration.left = (penetration.left * 40.0).min(100.0);
    penetration.right = (penetration.right * 40.0).min(100.0);
    penetration.central = (penetration.central * 40.0).min(100.0);

    solidity.left = (solidity.left * 50.0).min(100.0);
    solidity.right = (solidity.right * 50.0).min(100.0);
    solidity.central = (solidity.central * 50.0).min(100.0);

    let mut support = HashMap::new();
    let support_score = (midfield_count as f32 * 25.0).min(100.0);
    support.insert("left".to_string(), support_score * 0.8);
    support.insert("right".to_string(), support_score * 0.8);
    support.insert("central".to_string(), support_score);

    let global_score = (
        penetration.central * 0.3 + 
        solidity.central * 0.3 + 
        support_score * 0.2 + 
        (total_attack_weight * 2.0)
    ).min(100.0);

    AnalysisResult {
        score: global_score,
        penetration,
        solidity,
        support,
        relative_risk: RelativeRisk {
            in_possession: (total_attack_weight * 12.0).min(100.0),
            out_of_possession: (100.0 - (total_defend_weight * 15.0)).max(0.0),
            total: global_score,
        },
        partnerships: Vec::new(),
        suggestions,
    }
}

fn get_role_weights(role: &str, duty: &str) -> (f32, f32) {
    let base_weights = match role {
        "Advanced Forward" | "Poacher" | "Shadow Striker" => (1.2, 0.0),
        "Winger" | "Inside Forward" | "Inverted Winger" => (1.0, 0.2),
        "Deep Lying Forward" | "Target Forward" | "False Nine" => (0.8, 0.2),
        "Advanced Playmaker" | "Attacking Midfielder" | "Mezzala" => (0.7, 0.3),
        "Central Midfielder" | "Box To Box Midfielder" | "Roaming Playmaker" => (0.5, 0.5),
        "Deep Lying Playmaker" | "Defensive Midfielder" | "Segundo Volante" => (0.3, 0.7),
        "Anchor" | "Half Back" | "Ball Winning Midfielder" => (0.1, 1.0),
        "Central Defender" | "Ball Playing Defender" | "No-Nonsense Centre-Back" => (0.0, 1.2),
        "Full Back" | "Wing Back" | "Inverted Wing Back" => (0.4, 0.8),
        "Sweeper Keeper" | "Goalkeeper" => (0.0, 0.5),
        _ => (0.5, 0.5),
    };

    let duty_modifier = match duty {
        "Attack" => (1.3, 0.7),
        "Defend" => (0.7, 1.3),
        "Support" => (1.0, 1.0),
        _ => (1.0, 1.0),
    };

    (base_weights.0 * duty_modifier.0, base_weights.1 * duty_modifier.1)
}
