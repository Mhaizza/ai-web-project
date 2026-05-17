// ─── Modular mission interactions (progressive AI proficiency) ───────────────

/** Bands align with player progression targets (levels 1–5 / 5–10 / 10+). */
export type MissionInteractionBand = "foundation" | "structured" | "mastery";

export interface TapMcqStep {
  kind: "mcq";
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  coachHint?: string;
  explain: string;
}

export interface TapFillStep {
  kind: "fill";
  prefix: string;
  suffix: string;
  chips: string[];
  correct: string;
  coachHint?: string;
  explain: string;
}

export type TapStep = TapMcqStep | TapFillStep;

/** Hybrid: fast tap warmup → scaffolded writing (no blank-page start). */
export interface StructuredMissionFlow {
  band: "structured";
  briefingAccent?: string;
  tapWarmup: TapStep[];
  scaffoldTitle: string;
  scaffoldBullets: string[];
  scaffoldPlaceholder: string;
  scaffoldMinChars: number;
  chipInserts?: { icon?: string; label: string; insert: string }[];
}

/** Warmup taps → deeper written response / reasoning. */
export interface MasteryMissionFlow {
  band: "mastery";
  briefingAccent?: string;
  tapWarmup: TapStep[];
  essayPrompt: string;
  essayPlaceholder: string;
  essayMinChars: number;
  oracleTips: string[];
}

export type GenericMissionFlow = StructuredMissionFlow | MasteryMissionFlow;
