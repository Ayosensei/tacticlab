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
  title: "Untitled Tactic",
  formation: "4-4-2",
  style: "Balanced",
  mentality: "Balanced",
  inPossession: [],
  inTransition: [],
  outOfPossession: [],
  players: [
    { id: "1", role: "Goalkeeper", duty: "Defend", x: 50, y: 92 },
    { id: "2", role: "Full Back", duty: "Support", x: 10, y: 72 },
    { id: "3", role: "Central Defender", duty: "Defend", x: 35, y: 80 },
    { id: "4", role: "Central Defender", duty: "Defend", x: 65, y: 80 },
    { id: "5", role: "Full Back", duty: "Support", x: 90, y: 72 },
    { id: "6", role: "Winger", duty: "Support", x: 10, y: 45 },
    { id: "7", role: "Central Midfielder", duty: "Support", x: 38, y: 55 },
    { id: "8", role: "Central Midfielder", duty: "Support", x: 62, y: 55 },
    { id: "9", role: "Winger", duty: "Support", x: 90, y: 45 },
    { id: "10", role: "Deep Lying Forward", duty: "Support", x: 40, y: 25 },
    { id: "11", role: "Advanced Forward", duty: "Attack", x: 60, y: 18 },
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
