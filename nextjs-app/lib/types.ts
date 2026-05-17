// ─── Core Game Types ─────────────────────────────────────────────────────────

export type MissionDifficulty = "EASY" | "MEDIUM" | "HARD" | "BOSS";
export type MissionStatus = "available" | "in_progress" | "locked" | "completed";

export type WorldId = "ai-origins" | "machine-mind" | "deep-network";

export interface MissionReward {
  xp: number;
  credits: number;
}

export interface Mission {
  id: string;
  code: string;
  worldId: WorldId;
  title: string;
  description: string;
  icon: string;
  difficulty: MissionDifficulty;
  energyCost: number;
  reward: MissionReward;
  /** route to use for this mission */
  href: string;
  /** order within the world for unlock chain */
  order: number;
}

export interface World {
  id: WorldId;
  name: string;
  tagline: string;
  description: string;
  color: string;
  unlockLevel: number;
  icon: string;
}

export type PlayerRank =
  | "INITIATE"
  | "OPERATIVE"
  | "AGENT"
  | "VETERAN"
  | "ELITE"
  | "LEGEND";

export interface PlayerState {
  xp: number;
  level: number;
  credits: number;
  energy: number;
  /** Unix-ms when energy was last reduced (used to compute regen) */
  lastEnergyAt: number;
  /** Completed mission IDs */
  completed: string[];
  /** Daily streak counter */
  streak: number;
  /** Active hero key */
  heroKey: string;
  /** Code-name shown in UI */
  agentName: string;
}
