import type { PlayerRank } from "./types";

// XP required per level grows quadratically — feels rewarding early, then meaty
// Level n requires totalXP >= 300 * (n-1)^1.55
export const XP_BASE = 300;
export const XP_GROWTH = 1.55;

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(XP_BASE * Math.pow(level - 1, XP_GROWTH));
}

export function levelForXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
}

export interface LevelProgress {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  intoLevel: number;
  span: number;
  pct: number;
}

export function levelProgress(xp: number): LevelProgress {
  const level = levelForXp(xp);
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const span = Math.max(1, nextLevelXp - currentLevelXp);
  const intoLevel = xp - currentLevelXp;
  return {
    level,
    currentLevelXp,
    nextLevelXp,
    intoLevel,
    span,
    pct: Math.min(100, Math.max(0, Math.round((intoLevel / span) * 100))),
  };
}

const RANK_THRESHOLDS: Array<{ min: number; rank: PlayerRank }> = [
  { min: 0, rank: "INITIATE" },
  { min: 5, rank: "OPERATIVE" },
  { min: 10, rank: "AGENT" },
  { min: 18, rank: "VETERAN" },
  { min: 28, rank: "ELITE" },
  { min: 45, rank: "LEGEND" },
];

export function rankForLevel(level: number): PlayerRank {
  let rank: PlayerRank = "INITIATE";
  for (const t of RANK_THRESHOLDS) if (level >= t.min) rank = t.rank;
  return rank;
}

// ─── Energy regen ───────────────────────────────────────────────────────────
export const ENERGY_MAX = 5;
/** ms required to regenerate +1 energy */
export const ENERGY_REGEN_MS = 6 * 60 * 1000; // 6 minutes per pip

export function computeEnergy(
  storedEnergy: number,
  lastEnergyAt: number,
  now: number = Date.now()
): { energy: number; lastEnergyAt: number; msToNext: number } {
  if (storedEnergy >= ENERGY_MAX) {
    return { energy: ENERGY_MAX, lastEnergyAt: now, msToNext: 0 };
  }
  const elapsed = Math.max(0, now - lastEnergyAt);
  const regen = Math.floor(elapsed / ENERGY_REGEN_MS);
  const newEnergy = Math.min(ENERGY_MAX, storedEnergy + regen);
  const newLast = lastEnergyAt + regen * ENERGY_REGEN_MS;
  const msToNext =
    newEnergy >= ENERGY_MAX ? 0 : ENERGY_REGEN_MS - (now - newLast);
  return { energy: newEnergy, lastEnergyAt: newLast, msToNext };
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "FULL";
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
