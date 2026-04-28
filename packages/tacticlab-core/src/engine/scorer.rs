use crate::models::tactic::{Tactic, AnalysisResult, ChannelScores, RelativeRisk, Suggestion};
use std::collections::HashMap;

pub fn score(tactic: &Tactic) -> AnalysisResult {
    let mut penetration = ChannelScores { left: 0.0, right: 0.0, central: 0.0 };
    let mut solidity = ChannelScores { left: 0.0, right: 0.0, central: 0.0 };
    let mut suggestions = Vec::new();

    // 1. Basic counts
    let attacking_count = tactic.players.iter().filter(|p| p.duty == "Attack").count();
    let defending_count = tactic.players.iter().filter(|p| p.duty == "Defend").count();

    // 2. Channel Analysis
    for player in &tactic.players {
        let is_left = player.x < 40.0;
        let is_right = player.x > 60.0;
        let is_central = !is_left && !is_right;

        // Penetration logic (High Y is closer to goal in this system's coords? Wait.)
        // In the React app: GK is at y: 96, ST is at y: 15.
        // So LOWER Y is MORE ATTACKING.
        let is_attacking_zone = player.y < 40.0;
        let is_defensive_zone = player.y > 60.0;

        if is_attacking_zone {
            if is_left { penetration.left += 1.0; }
            else if is_right { penetration.right += 1.0; }
            else { penetration.central += 1.0; }
        }

        if is_defensive_zone {
            if is_left { solidity.left += 1.0; }
            else if is_right { solidity.right += 1.0; }
            else { solidity.central += 1.0; }
        }
    }

    // Normalize scores to 0-100
    penetration.left = (penetration.left * 25.0).min(100.0);
    penetration.right = (penetration.right * 25.0).min(100.0);
    penetration.central = (penetration.central * 25.0).min(100.0);

    solidity.left = (solidity.left * 30.0).min(100.0);
    solidity.right = (solidity.right * 30.0).min(100.0);
    solidity.central = (solidity.central * 30.0).min(100.0);

    // 3. Rule-based Suggestions
    if attacking_count > 5 {
        suggestions.push(Suggestion {
            severity: "warning".to_string(),
            area: "attack".to_string(),
            message: "Too many attacking duties may leave you exposed on the break.".to_string(),
        });
    }

    if defending_count < 3 {
        suggestions.push(Suggestion {
            severity: "critical".to_string(),
            area: "defence".to_string(),
            message: "Insufficient defensive cover. Ensure at least 3 players have defensive duties.".to_string(),
        });
    }

    if penetration.left < 20.0 && penetration.right < 20.0 {
        suggestions.push(Suggestion {
            severity: "warning".to_string(),
            area: "central".to_string(),
            message: "Lack of wide threat. The opposition may find it easy to congest the middle.".to_string(),
        });
    }

    let mut support = HashMap::new();
    support.insert("left".to_string(), 75.0);
    support.insert("right".to_string(), 75.0);

    let global_score = (penetration.central * 0.4 + solidity.central * 0.4 + (attacking_count as f32 * 5.0)).min(100.0);

    AnalysisResult {
        score: global_score,
        penetration,
        solidity,
        support,
        relative_risk: RelativeRisk {
            in_possession: 45.0,
            out_of_possession: 65.0,
            total: 55.0,
        },
        partnerships: Vec::new(), // Will be filled by partnerships engine
        suggestions,
    }
}
