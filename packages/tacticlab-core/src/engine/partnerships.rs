use crate::models::tactic::{Tactic, Partnership};

pub fn analyze(tactic: &Tactic) -> Vec<Partnership> {
    let mut partnerships = Vec::new();

    for i in 0..tactic.players.len() {
        for j in i + 1..tactic.players.len() {
            let p1 = &tactic.players[i];
            let p2 = &tactic.players[j];

            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let distance = (dx * dx + dy * dy).sqrt();

            // Distance threshold for partnership (increased to capture more links)
            if distance < 35.0 {
                let mut strength = (1.0 - (distance / 35.0)).max(0.0);
                let mut p_type = "neutral".to_string();

                // 1. Double Pivot Synergy (Central Midfielders)
                if p1.y > 45.0 && p1.y < 70.0 && p2.y > 45.0 && p2.y < 70.0 {
                    let is_p1_creative = is_creative_role(&p1.role);
                    let is_p2_defensive = is_defensive_mid_role(&p2.role);
                    
                    if (is_p1_creative && is_p2_defensive) || (is_creative_role(&p2.role) && is_defensive_mid_role(&p1.role)) {
                        strength += 0.2;
                        p_type = "positive".to_string();
                    }
                }

                // 2. Wide Overlap Synergy
                if (p1.x < 30.0 && p2.x < 30.0) || (p1.x > 70.0 && p2.x > 70.0) {
                    if is_wing_back(&p1.role) && is_winger(&p2.role) {
                        strength += 0.2;
                        p_type = "positive".to_string();
                    }
                }

                // 3. Strike Partnership
                if p1.y < 30.0 && p2.y < 30.0 {
                    if is_creator_striker(&p1.role) && is_finisher_striker(&p2.role) {
                        strength += 0.3;
                        p_type = "positive".to_string();
                    } else if is_finisher_striker(&p1.role) && is_finisher_striker(&p2.role) {
                        // Two poachers might clash
                        strength -= 0.1;
                        p_type = "negative".to_string();
                    }
                }

                if strength > 0.0 {
                    partnerships.push(Partnership {
                        player1_id: p1.id.clone(),
                        player2_id: p2.id.clone(),
                        strength: strength.min(1.0),
                        partnership_type: p_type,
                    });
                }
            }
        }
    }

    partnerships
}

fn is_creative_role(role: &str) -> bool {
    matches!(role, "Advanced Playmaker" | "Deep Lying Playmaker" | "Roaming Playmaker" | "Trequartista" | "Mezzala")
}

fn is_defensive_mid_role(role: &str) -> bool {
    matches!(role, "Anchor" | "Defensive Midfielder" | "Ball Winning Midfielder" | "Half Back")
}

fn is_wing_back(role: &str) -> bool {
    matches!(role, "Full Back" | "Wing Back" | "Inverted Wing Back" | "Complete Wing-Back")
}

fn is_winger(role: &str) -> bool {
    matches!(role, "Winger" | "Inside Forward" | "Inverted Winger" | "Raumdeuter")
}

fn is_creator_striker(role: &str) -> bool {
    matches!(role, "Deep Lying Forward" | "Target Forward" | "False Nine" | "Complete Forward")
}

fn is_finisher_striker(role: &str) -> bool {
    matches!(role, "Advanced Forward" | "Poacher" | "Pressing Forward")
}
