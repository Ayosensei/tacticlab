use crate::models::tactic::{Tactic, Partnership};

pub fn analyze(tactic: &Tactic) -> Vec<Partnership> {
    let mut partnerships = Vec::new();

    // Simple proximity-based partnership detection
    for i in 0..tactic.players.len() {
        for j in i + 1..tactic.players.len() {
            let p1 = &tactic.players[i];
            let p2 = &tactic.players[j];

            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let distance = (dx * dx + dy * dy).sqrt();

            // If players are close, they might have a partnership
            if distance < 25.0 {
                let strength = (1.0 - (distance / 25.0)).max(0.0);
                
                partnerships.push(Partnership {
                    player1_id: p1.id.clone(),
                    player2_id: p2.id.clone(),
                    strength,
                    partnership_type: if strength > 0.7 { "positive".to_string() } else { "neutral".to_string() },
                });
            }
        }
    }

    partnerships
}
