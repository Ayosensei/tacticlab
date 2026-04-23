import { create } from "zustand";
import { Tactic, AnalysisResult, Duty } from "@/types/tactic";
import { FORMATIONS, getValidRolesForPosition } from "../lib/tacticsData";

interface TacticState {
  currentTactic: Tactic;
  analysis: AnalysisResult | null;
  isLoading: boolean;
  
  // Actions
  setTactic: (tactic: Tactic) => void;
  updatePlayerPosition: (playerId: string, newX: number, newY: number) => void;
  setFormation: (formationId: string) => void;
  updatePlayerRole: (playerId: string, role: string, duty: Duty) => void;
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
    { id: "11", role: "Center Forward", duty: "Attack", x: 50, y: 15 },
  ],
  arrows: [],
};

export const useTacticStore = create<TacticState>((set) => ({
  currentTactic: initialTactic,
  analysis: null,
  isLoading: false,

  setTactic: (tactic) => set({ currentTactic: tactic }),
  
  updatePlayerPosition: (playerId, newX, newY) =>
    set((state) => {
      const players = state.currentTactic.players.map((p) => {
        if (p.id === playerId) {
          const updatedPlayer = { ...p, x: newX, y: newY };
          
          // Dynamic Role Switching
          const validRoles = getValidRolesForPosition(newX, newY);
          if (!validRoles.includes(updatedPlayer.role)) {
            updatedPlayer.role = validRoles[0];
          }
          
          return updatedPlayer;
        }
        return p;
      });
      return { currentTactic: { ...state.currentTactic, players } };
    }),
    
  setFormation: (formationId) =>
    set((state) => {
      const formation = FORMATIONS.find(f => f.id === formationId);
      if (!formation) return state;
      
      return {
        currentTactic: {
          ...state.currentTactic,
          formation: formation.name,
          players: JSON.parse(JSON.stringify(formation.players)) // Deep clone array
        }
      };
    }),
    
  updatePlayerRole: (playerId, role, duty) =>
    set((state) => {
      const players = state.currentTactic.players.map((p) =>
        p.id === playerId ? { ...p, role, duty } : p
      );
      return { currentTactic: { ...state.currentTactic, players } };
    }),

  setAnalysis: (analysis) => set({ analysis }),
  setLoading: (isLoading) => set({ isLoading }),
}));
