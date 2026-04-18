import { create } from "zustand";
import { Tactic, AnalysisResult } from "@/types/tactic";

interface TacticState {
  currentTactic: Tactic;
  analysis: AnalysisResult | null;
  isLoading: boolean;
  
  // Actions
  setTactic: (tactic: Tactic) => void;
  updatePlayerPosition: (playerId: string, x: number, y: number) => void;
  setAnalysis: (analysis: AnalysisResult) => void;
  setLoading: (isLoading: boolean) => void;
}

const initialTactic: Tactic = {
  title: "Strategic Hub Primary",
  formation: "4-3-3",
  style: "Vertical Tiki-Taka",
  mentality: "Attacking",
  inPossession: [],
  inTransition: [],
  outOfPossession: [],
  players: [
    { id: "1", role: "Goalkeeper", duty: "Defend", x: 50, y: 92 },
    { id: "2", role: "Full Back", duty: "Support", x: 12, y: 73 },
    { id: "3", role: "Central Defender", duty: "Defend", x: 38, y: 78 },
    { id: "4", role: "Ball Playing Defender", duty: "Defend", x: 62, y: 78 },
    { id: "5", role: "Full Back", duty: "Defend", x: 88, y: 73 },
    { id: "6", role: "Deep Lying Playmaker", duty: "Defend", x: 50, y: 60 },
    { id: "7", role: "Advanced Playmaker", duty: "Support", x: 35, y: 48 },
    { id: "8", role: "Mezzala", duty: "Attack", x: 65, y: 48 },
    { id: "9", role: "Winger", duty: "Support", x: 10, y: 28 },
    { id: "10", role: "Winger", duty: "Support", x: 90, y: 28 },
    { id: "11", role: "Center Forward", duty: "Attack", x: 50, y: 15 },
  ],
  arrows: [],
};

export const useTacticStore = create<TacticState>((set) => ({
  currentTactic: initialTactic,
  analysis: null,
  isLoading: false,

  setTactic: (tactic) => set({ currentTactic: tactic }),
  
  updatePlayerPosition: (playerId, x, y) => 
    set((state) => ({
      currentTactic: {
        ...state.currentTactic,
        players: state.currentTactic.players.map((p) => 
          p.id === playerId ? { ...p, x, y } : p
        ),
      },
    })),

  setAnalysis: (analysis) => set({ analysis }),
  setLoading: (isLoading) => set({ isLoading }),
}));
