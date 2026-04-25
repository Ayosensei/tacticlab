import { create } from "zustand";
import { Tactic, AnalysisResult, Duty } from "@/types/tactic";
import { FORMATIONS, getValidRolesForPosition, getClosestSlot } from "../lib/tacticsData";
import { ROLES_DB } from "../lib/rolesData";

interface TacticState {
  currentTactic: Tactic;
  analysis: AnalysisResult | null;
  isLoading: boolean;
  activeSidebarTab: string | null;
  selectedPlayerId: string | null;
  
  // Actions
  setTactic: (tactic: Tactic) => void;
  updatePlayerPosition: (playerId: string, newX: number, newY: number) => void;
  setFormation: (formationId: string) => void;
  updatePlayerRole: (playerId: string, role: string, duty: Duty) => void;
  setStyle: (style: string) => void;
  setMentality: (mentality: Tactic["mentality"]) => void;
  setAnalysis: (analysis: AnalysisResult) => void;
  setLoading: (isLoading: boolean) => void;
  setActiveSidebarTab: (tab: string | null) => void;
  setSelectedPlayerId: (id: string | null) => void;
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
  activeSidebarTab: null,
  selectedPlayerId: null,

  setTactic: (tactic) => set({ currentTactic: tactic }),
  
  updatePlayerPosition: (playerId, newX, newY) =>
    set((state) => {
      const closestSlot = getClosestSlot(newX, newY);
      
      const players = [...state.currentTactic.players];
      const draggedIndex = players.findIndex(p => p.id === playerId);
      if (draggedIndex === -1) return state;
      
      const originalX = players[draggedIndex].x;
      const originalY = players[draggedIndex].y;
      
      // Check collision
      const occupantIndex = players.findIndex(p => p.x === closestSlot.x && p.y === closestSlot.y && p.id !== playerId);
      
      // Update dragged player
      const draggedPlayer = { ...players[draggedIndex], x: closestSlot.x, y: closestSlot.y };
      const validRoles = getValidRolesForPosition(closestSlot.x, closestSlot.y);
      if (!validRoles.includes(draggedPlayer.role)) {
        draggedPlayer.role = validRoles[0];
      }
      players[draggedIndex] = draggedPlayer;
      
      // Swap occupant
      if (occupantIndex !== -1) {
        const occupant = { ...players[occupantIndex], x: originalX, y: originalY };
        const occupantRoles = getValidRolesForPosition(originalX, originalY);
        if (!occupantRoles.includes(occupant.role)) {
          occupant.role = occupantRoles[0];
        }
        players[occupantIndex] = occupant;
      }
      
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
      const players = state.currentTactic.players.map((p) => {
        if (p.id === playerId) {
          let finalDuty = duty;
          const roleData = ROLES_DB[role];
          if (roleData && roleData.duties) {
            // If the new duty isn't valid for the role, pick the first valid duty.
            const validDuties = Object.keys(roleData.duties) as Duty[];
            if (!validDuties.includes(finalDuty)) {
              finalDuty = validDuties[0] || duty;
            }
          }
          return { ...p, role, duty: finalDuty };
        }
        return p;
      });
      return { currentTactic: { ...state.currentTactic, players } };
    }),

  setStyle: (styleName) =>
    set((state) => ({
      currentTactic: { ...state.currentTactic, style: styleName }
    })),

  setMentality: (mentality) =>
    set((state) => ({
      currentTactic: { ...state.currentTactic, mentality }
    })),

  setAnalysis: (analysis) => set({ analysis }),
  setLoading: (isLoading) => set({ isLoading }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  setSelectedPlayerId: (id) => set({ selectedPlayerId: id }),
}));
