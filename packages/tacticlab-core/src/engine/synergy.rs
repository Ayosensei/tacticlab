use crate::models::tactic::{Tactic, Synergy, RiskFactor};

pub fn analyze(tactic: &Tactic) -> (Vec<Synergy>, Vec<RiskFactor>) {
    let mut synergies = Vec::new();
    let mut risks = Vec::new();

    let num_players = tactic.players.len();

    // 1. Structural Risk Factors
    let mut has_dm = false;
    let mut attack_cms = 0;
    
    let mut left_flank_cover = false;
    let mut right_flank_cover = false;
    let mut left_attack_wb = false;
    let mut right_attack_wb = false;
    let mut left_inside_forward = false;
    let mut right_inside_forward = false;
    
    let mut ams = 0;
    let mut attack_strikers = 0;

    for player in &tactic.players {
        // Midfield gap
        if player.y > 60.0 && player.y < 70.0 { has_dm = true; }
        if player.y >= 40.0 && player.y <= 60.0 && player.x > 30.0 && player.x < 70.0 && player.duty == "Attack" {
            attack_cms += 1;
        }
        
        // Flank Exposure
        if is_wing_back(&player.role) && player.duty == "Attack" {
            if player.x < 50.0 { left_attack_wb = true; } else { right_attack_wb = true; }
        }
        if is_inside_forward(&player.role) {
            if player.x < 50.0 { left_inside_forward = true; } else { right_inside_forward = true; }
        }
        // Covering mids (Carrilero, BWM on Defend, DM on side)
        if player.y > 40.0 && player.y <= 70.0 {
            if player.x < 40.0 && (player.duty == "Defend" || player.role == "Carrilero") { left_flank_cover = true; }
            if player.x > 60.0 && (player.duty == "Defend" || player.role == "Carrilero") { right_flank_cover = true; }
        }
        
        // Striker isolation
        if player.y > 20.0 && player.y < 40.0 && player.x > 30.0 && player.x < 70.0 { ams += 1; }
        if player.y <= 20.0 && player.duty == "Attack" { attack_strikers += 1; }
    }

    if !has_dm && attack_cms >= 2 {
        risks.push(RiskFactor {
            area: "central".to_string(),
            severity: "critical".to_string(),
            message: "Massive Midfield Gap. You have no defensive midfielder and multiple CMs bombing forward. The center is completely vacant on transition.".to_string(),
        });
    }
    
    if left_attack_wb && left_inside_forward && !left_flank_cover {
        risks.push(RiskFactor {
            area: "left_flank".to_string(),
            severity: "critical".to_string(),
            message: "Left Flank Exposed. Your Wing-Back is attacking and your winger is cutting inside, with no midfielder covering the space. Extreme counter-attack risk.".to_string(),
        });
    }
    
    if right_attack_wb && right_inside_forward && !right_flank_cover {
        risks.push(RiskFactor {
            area: "right_flank".to_string(),
            severity: "critical".to_string(),
            message: "Right Flank Exposed. Your Wing-Back is attacking and your winger is cutting inside, with no midfielder covering the space. Extreme counter-attack risk.".to_string(),
        });
    }
    
    if attack_strikers == 1 && ams == 0 {
        risks.push(RiskFactor {
            area: "attack".to_string(),
            severity: "warning".to_string(),
            message: "Striker Isolation. Your lone striker is on Attack duty with no attacking midfielder behind them. They will be easily crowded out by center-backs.".to_string(),
        });
    }

    // 2. Role Synergies (O(N^2) pairing)
    for i in 0..num_players {
        for j in i + 1..num_players {
            let p1 = &tactic.players[i];
            let p2 = &tactic.players[j];

            let dist = ((p1.x - p2.x).powi(2) + (p1.y - p2.y).powi(2)).sqrt();

            if dist < 35.0 {
                // Central Midfield Playmakers
                if p1.y > 40.0 && p1.y < 70.0 && p2.y > 40.0 && p2.y < 70.0 && p1.x > 30.0 && p1.x < 70.0 && p2.x > 30.0 && p2.x < 70.0 {
                    let p1_playmaker = is_playmaker(&p1.role);
                    let p2_playmaker = is_playmaker(&p2.role);
                    let p1_destroyer = is_destroyer(&p1.role);
                    let p2_destroyer = is_destroyer(&p2.role);
                    
                    if (p1_playmaker && p2_destroyer) || (p2_playmaker && p1_destroyer) {
                        synergies.push(Synergy {
                            player1_id: p1.id.clone(),
                            player2_id: p2.id.clone(),
                            r#type: "positive".to_string(),
                            message: "Classic Pivot Synergy (Creator + Destroyer)".to_string(),
                        });
                    }
                    
                    if p1_playmaker && p2_playmaker {
                        synergies.push(Synergy {
                            player1_id: p1.id.clone(),
                            player2_id: p2.id.clone(),
                            r#type: "negative".to_string(),
                            message: "Playmaker Congestion (Demanding same space)".to_string(),
                        });
                    }
                }

                // Wide Overlaps
                let same_flank = (p1.x < 35.0 && p2.x < 35.0) || (p1.x > 65.0 && p2.x > 65.0);
                if same_flank {
                    if (is_wing_back(&p1.role) && is_inside_forward(&p2.role)) || (is_wing_back(&p2.role) && is_inside_forward(&p1.role)) {
                        let wb_attack = (is_wing_back(&p1.role) && p1.duty == "Attack") || (is_wing_back(&p2.role) && p2.duty == "Attack");
                        if wb_attack {
                             synergies.push(Synergy {
                                player1_id: p1.id.clone(),
                                player2_id: p2.id.clone(),
                                r#type: "positive".to_string(),
                                message: "Devastating Wide Overlap".to_string(),
                            });
                        }
                    }
                    
                    if is_winger(&p1.role) && is_wing_back(&p2.role) && p1.duty == p2.duty {
                         synergies.push(Synergy {
                            player1_id: p1.id.clone(),
                            player2_id: p2.id.clone(),
                            r#type: "negative".to_string(),
                            message: "Flank Crowding (Same vertical channel)".to_string(),
                        });
                    }
                }

                // Strikers
                if p1.y < 30.0 && p2.y < 30.0 && p1.x > 30.0 && p1.x < 70.0 && p2.x > 30.0 && p2.x < 70.0 {
                    if (is_creator_striker(&p1.role) && is_finisher_striker(&p2.role)) || (is_creator_striker(&p2.role) && is_finisher_striker(&p1.role)) {
                        synergies.push(Synergy {
                            player1_id: p1.id.clone(),
                            player2_id: p2.id.clone(),
                            r#type: "positive".to_string(),
                            message: "Classic Striker Duo (Creator + Finisher)".to_string(),
                        });
                    } else if is_finisher_striker(&p1.role) && is_finisher_striker(&p2.role) {
                        synergies.push(Synergy {
                            player1_id: p1.id.clone(),
                            player2_id: p2.id.clone(),
                            r#type: "negative".to_string(),
                            message: "Disconnected Forwards (No drop-in link player)".to_string(),
                        });
                    }
                }
            }
        }
    }

    (synergies, risks)
}

fn is_playmaker(role: &str) -> bool {
    matches!(role, "Advanced Playmaker" | "Deep Lying Playmaker" | "Roaming Playmaker" | "Trequartista" | "Regista")
}

fn is_destroyer(role: &str) -> bool {
    matches!(role, "Anchor" | "Defensive Midfielder" | "Ball Winning Midfielder" | "Half Back")
}

fn is_wing_back(role: &str) -> bool {
    matches!(role, "Full Back" | "Wing Back" | "Inverted Wing Back" | "Complete Wing-Back")
}

fn is_inside_forward(role: &str) -> bool {
    matches!(role, "Inside Forward" | "Inverted Winger")
}

fn is_winger(role: &str) -> bool {
    matches!(role, "Winger")
}

fn is_creator_striker(role: &str) -> bool {
    matches!(role, "Deep Lying Forward" | "Target Forward" | "False Nine" | "Complete Forward")
}

fn is_finisher_striker(role: &str) -> bool {
    matches!(role, "Advanced Forward" | "Poacher" | "Pressing Forward")
}
