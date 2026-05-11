import { scoreTactic } from "./apps/web/src/lib/wasm";
import { Tactic } from "./apps/web/src/types/tactic";

const initialTactic: Tactic = {
  title: "Strategic Hub Primary",
  formation: "4-3-3",
  style: "Vertical Tiki-Taka",
  mentality: "Attacking",
  inPossession: {},
  inTransition: {},
  outOfPossession: {},
  players: [
    { id: "1", role: "Goalkeeper", duty: "Defend", x: 50, y: 96 },
    { id: "2", role: "Full Back", duty: "Support", x: 12, y: 80 },
    { id: "3", role: "Central Defender", duty: "Defend", x: 35, y: 82 },
    { id: "4", role: "Ball Playing Defender", duty: "Defend", x: 65, y: 82 },
    { id: "5", role: "Full Back", duty: "Defend", x: 88, y: 80 },
    { id: "6", role: "Deep Lying Playmaker", duty: "Defend", x: 50, y: 66 },
    { id: "7", role: "Advanced Playmaker", duty: "Support", x: 35, y: 48 },
    { id: "8", role: "Mezzala", duty: "Attack", x: 65, y: 48 },
    { id: "9", role: "Winger", duty: "Support", x: 12, y: 25 },
    { id: "10", role: "Winger", duty: "Support", x: 88, y: 25 },
    { id: "11", role: "Advanced Forward", duty: "Attack", x: 50, y: 15 },
  ],
  arrows: [],
};

async function run() {
  const res = await scoreTactic(initialTactic);
  console.log("Synergies:", res.synergies);
  console.log("Triangles:", res.compatibilityTriangles);
}
run();
