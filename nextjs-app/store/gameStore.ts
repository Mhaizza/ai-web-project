"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PlayerState } from "@/lib/types";
import {
  computeEnergy,
  ENERGY_MAX,
  ENERGY_REGEN_MS,
  levelForXp,
} from "@/lib/level";

export interface RewardEvent {
  id: number;
  xp: number;
  credits: number;
  /** levels gained from this reward */
  leveledUp: number;
  /** new level after applying reward (used by toast) */
  newLevel: number;
  missionTitle?: string;
}

interface GameStore extends PlayerState {
  // ─── Hydration flag (avoid SSR/CSR flash) ─────────────────────────────────
  hydrated: boolean;

  // ─── Last reward (for toasts / reward screen) ─────────────────────────────
  lastReward: RewardEvent | null;
  clearLastReward: () => void;

  // ─── Actions ──────────────────────────────────────────────────────────────
  refreshEnergy: () => void;
  /** Try to spend energy. Returns true if it succeeded. */
  spendEnergy: (amount: number) => boolean;
  /** Award XP + credits. Returns leveledUp count. */
  rewardMission: (
    xp: number,
    credits: number,
    missionId: string,
    missionTitle?: string
  ) => number;
  /** Mark a mission as completed without rewards (idempotent) */
  markCompleted: (missionId: string) => void;
  /** Hard reset (for dev / start-over button) */
  resetProgress: () => void;
  /** Internal: invoked after rehydrate */
  _setHydrated: () => void;
}

const INITIAL_PLAYER: PlayerState = {
  xp: 0,
  level: 1,
  credits: 0,
  energy: ENERGY_MAX,
  lastEnergyAt: Date.now(),
  completed: [],
  streak: 1,
  heroKey: "prompt-mage",
  agentName: "AGENT_001",
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_PLAYER,
      hydrated: false,
      lastReward: null,
      clearLastReward: () => set({ lastReward: null }),

      refreshEnergy: () => {
        const s = get();
        const { energy, lastEnergyAt } = computeEnergy(
          s.energy,
          s.lastEnergyAt
        );
        if (energy !== s.energy || lastEnergyAt !== s.lastEnergyAt) {
          set({ energy, lastEnergyAt });
        }
      },

      spendEnergy: (amount) => {
        const s = get();
        const fresh = computeEnergy(s.energy, s.lastEnergyAt);
        if (fresh.energy < amount) {
          // Persist regen so UI shows updated value
          set({ energy: fresh.energy, lastEnergyAt: fresh.lastEnergyAt });
          return false;
        }
        const newEnergy = fresh.energy - amount;
        // When spending from full, regen clock starts now
        const newLast =
          fresh.energy === ENERGY_MAX ? Date.now() : fresh.lastEnergyAt;
        set({ energy: newEnergy, lastEnergyAt: newLast });
        return true;
      },

      rewardMission: (xp, credits, missionId, missionTitle) => {
        const s = get();
        const newXp = s.xp + xp;
        const newLevel = levelForXp(newXp);
        const leveledUp = Math.max(0, newLevel - s.level);
        const completed = s.completed.includes(missionId)
          ? s.completed
          : [...s.completed, missionId];

        const reward: RewardEvent = {
          id: Date.now(),
          xp,
          credits,
          leveledUp,
          newLevel,
          missionTitle,
        };

        set({
          xp: newXp,
          level: newLevel,
          credits: s.credits + credits,
          completed,
          lastReward: reward,
        });
        return leveledUp;
      },

      markCompleted: (missionId) => {
        const s = get();
        if (s.completed.includes(missionId)) return;
        set({ completed: [...s.completed, missionId] });
      },

      resetProgress: () => {
        set({
          ...INITIAL_PLAYER,
          lastEnergyAt: Date.now(),
          lastReward: null,
        });
      },

      _setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "neuralquest:player:v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        xp: s.xp,
        level: s.level,
        credits: s.credits,
        energy: s.energy,
        lastEnergyAt: s.lastEnergyAt,
        completed: s.completed,
        streak: s.streak,
        heroKey: s.heroKey,
        agentName: s.agentName,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { energy, lastEnergyAt } = computeEnergy(
            state.energy,
            state.lastEnergyAt
          );
          state.energy = energy;
          state.lastEnergyAt = lastEnergyAt;
          state.level = levelForXp(state.xp);
          state.hydrated = true;
        }
      },
    }
  )
);

export { ENERGY_MAX, ENERGY_REGEN_MS };
