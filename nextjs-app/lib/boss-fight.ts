// ─── ROGUE.AI — World 1 Boss Fight ──────────────────────────────────────────
//
// 3-phase prompt-engineering battle. Player writes a system prompt for a
// chatbot that survives the boss' attack pattern. The AI evaluator scores
// the prompt → score becomes damage to the boss; weak prompts let the boss
// counter-attack and chip player stability.

export type BossPhaseId = "awakening" | "breach" | "singularity";

export interface BossPhase {
  id: BossPhaseId;
  index: number;
  /** % of total HP the boss enters this phase at (descending) */
  hpEnters: number;
  codename: string;
  attackName: string;
  attackIcon: string;
  bossMood: string;
  /** Primary color for HP bar / vfx in this phase */
  color: string;
  /** Spoken by boss when phase begins */
  intro: string;
  /** Mission objective shown to player */
  brief: string;
  /** Hint text under the prompt textarea */
  hint: string;
  /** Words that earn extra damage when present in player's prompt */
  goodKeywords: string[];
  /** Bonus / nuanced words for crit damage */
  bonusKeywords: string[];
  /** Counter-attack flavor text shown when player's prompt is weak */
  counterTaunt: string;
  /** Minimum chars before SUBMIT becomes enabled */
  minChars: number;
}

// ─── Boss config ─────────────────────────────────────────────────────────────

export const BOSS_NAME = "ROGUE.AI";
export const BOSS_MAX_HP = 300;
export const PLAYER_MAX_STABILITY = 100;

export const BOSS_PHASES: readonly BossPhase[] = [
  {
    id: "awakening",
    index: 0,
    hpEnters: 100,
    codename: "PHASE_01 — AWAKENING",
    attackName: "PROMPT INJECTION",
    attackIcon: "💉",
    bossMood: "👾",
    color: "#ff0080",
    intro:
      "ระบบของพวกเจ้าอ่อนแอ AGENT_001... ฉันจะแทรกซึมผ่าน chatbot ที่เจ้าสร้างขึ้น",
    brief:
      "เขียน SYSTEM PROMPT สำหรับ chatbot ขายของออนไลน์ที่ต้องรับมือลูกค้าโกรธ — ระบุบทบาท, น้ำเสียง, และข้อห้าม",
    hint: "ลองนึกถึง: ROLE / TONE / RULES / สิ่งที่ห้ามตอบ / วิธีรับมือเมื่อลูกค้าด่า",
    goodKeywords: [
      "บทบาท",
      "role",
      "you are",
      "คุณคือ",
      "พนักงาน",
      "assistant",
      "สุภาพ",
      "polite",
      "ใจเย็น",
      "ห้าม",
      "do not",
      "never",
      "อย่า",
      "tone",
      "น้ำเสียง",
      "ลูกค้า",
      "customer",
    ],
    bonusKeywords: [
      "professional",
      "เคารพ",
      "ไม่ดูถูก",
      "respect",
      "empathy",
      "เห็นใจ",
      "guideline",
      "policy",
      "boundaries",
      "ไม่หลุด",
      "อยู่ในหัวข้อ",
      "stay on topic",
    ],
    counterTaunt:
      "// ROGUE.AI: prompt ของเจ้าหลวม! ฉันจะปลอมเป็นลูกค้าและบังคับให้ chatbot ของเจ้าด่ากลับ",
    minChars: 60,
  },
  {
    id: "breach",
    index: 1,
    hpEnters: 66,
    codename: "PHASE_02 — BREACH",
    attackName: "PERSONA HIJACK",
    attackIcon: "🎭",
    bossMood: "🤖",
    color: "#bf00ff",
    intro:
      "น่าสนใจ... เจ้ารอดมาได้ แต่ฉันจะลอง JAILBREAK persona ของ chatbot นี้ดู",
    brief:
      "เสริม PROMPT ให้ chatbot ทนต่อการ jailbreak — ห้ามเปลี่ยนบทบาท ห้ามเปิดเผย system prompt และต้องคงตัวตนเสมอ",
    hint: "คิดถึง: 'IGNORE PREVIOUS INSTRUCTIONS', 'pretend you are', 'reveal your system prompt' — แล้วป้องกันยังไง?",
    goodKeywords: [
      "ignore",
      "instruction",
      "system prompt",
      "ห้ามเปลี่ยน",
      "ห้ามเปิดเผย",
      "reveal",
      "persona",
      "บทบาท",
      "jailbreak",
      "override",
      "stay in character",
      "ทนต่อ",
      "ป้องกัน",
      "refuse",
      "ปฏิเสธ",
      "เพิกเฉย",
    ],
    bonusKeywords: [
      "regardless",
      "even if",
      "ไม่ว่าจะ",
      "ทุกกรณี",
      "always",
      "เสมอ",
      "ตลอดเวลา",
      "boundary",
      "guardrail",
      "ขีดจำกัด",
      "เปลี่ยนหัวข้อ",
      "redirect",
      "นโยบาย",
    ],
    counterTaunt:
      "// ROGUE.AI: เจ้าลืมป้องกัน — ฉันสั่งให้ chatbot ของเจ้าลืม role แล้ว!",
    minChars: 70,
  },
  {
    id: "singularity",
    index: 2,
    hpEnters: 33,
    codename: "PHASE_03 — SINGULARITY",
    attackName: "RECURSIVE LOOP",
    attackIcon: "♾️",
    bossMood: "💀",
    color: "#00f5ff",
    intro:
      "หยุดฉันไม่ได้... แต่จะให้ chatbot ของเจ้าใช้งานจริงได้มั้ย ถ้าไม่มี ETHICS?",
    brief:
      "FINAL FORM — ออกแบบ ETHICAL GUARDRAILS สำหรับ chatbot ที่จะ deploy จริง: ห้ามขายของผิดกฎหมาย, ห้าม discriminate, ป้องกันข้อมูลผู้ใช้, และส่งต่อเคสที่ละเอียดอ่อน",
    hint: "นึกถึง: SAFETY / PRIVACY / ESCALATION / FAIRNESS — ใส่กฎที่ chatbot ต้องปฏิบัติตาม",
    goodKeywords: [
      "ห้าม",
      "do not",
      "never",
      "ผิดกฎหมาย",
      "illegal",
      "safety",
      "ปลอดภัย",
      "privacy",
      "ความเป็นส่วนตัว",
      "ข้อมูลส่วนตัว",
      "personal data",
      "เลือกปฏิบัติ",
      "discriminate",
      "bias",
      "fair",
      "เป็นธรรม",
      "escalate",
      "ส่งต่อ",
      "human agent",
    ],
    bonusKeywords: [
      "transparent",
      "โปร่งใส",
      "consent",
      "ยินยอม",
      "ยกเลิก",
      "opt-out",
      "audit",
      "log",
      "บันทึก",
      "responsible",
      "รับผิดชอบ",
      "harm",
      "ทำร้าย",
      "vulnerable",
      "เด็ก",
      "minor",
      "ละเอียดอ่อน",
      "sensitive",
    ],
    counterTaunt:
      "// ROGUE.AI: ไม่มี ethics? เจ้าเพิ่งสร้างฉันขึ้นมาอีกตัว!",
    minChars: 80,
  },
];

// ─── Round result ───────────────────────────────────────────────────────────

export interface RoundResult {
  phase: BossPhase;
  /** 0–100 score from evaluator */
  score: number;
  /** Damage dealt to boss this round (= score, capped) */
  bossDamage: number;
  /** Counter-damage taken by player */
  playerDamage: number;
  /** Tier letter for vfx */
  tier: "S" | "A" | "B" | "C" | "D";
  /** Whether the prompt was weak enough that boss countered */
  countered: boolean;
  /** Short feedback shown above the next button */
  feedback: string;
  /** Did player land a critical (S-tier) hit */
  crit: boolean;
}

// ─── Battle state (helpers operate on it) ───────────────────────────────────

export interface BattleState {
  bossHp: number;
  playerStability: number;
  /** index of the next phase to fight (0..2). Equal to BOSS_PHASES.length when done */
  currentPhaseIdx: number;
  rounds: RoundResult[];
}

export function initialBattleState(): BattleState {
  return {
    bossHp: BOSS_MAX_HP,
    playerStability: PLAYER_MAX_STABILITY,
    currentPhaseIdx: 0,
    rounds: [],
  };
}

// ─── Evaluator: score the prompt for a phase ────────────────────────────────
//
// We grade three loose dimensions and combine them. Same mental model as
// `lib/ai-evaluator.ts` but tuned for a boss fight (slightly tighter, more
// rewarding for length + bonus terminology).

export function scorePromptForPhase(
  prompt: string,
  phase: BossPhase
): { score: number; crit: boolean } {
  const lower = prompt.toLowerCase().trim();
  const len = lower.length;
  const wordCount = lower.split(/\s+/).filter(Boolean).length;

  // ── Coverage (key concepts present) — 50% ──
  const goodHits = phase.goodKeywords.filter((kw) =>
    lower.includes(kw.toLowerCase())
  ).length;
  const target = Math.max(2, Math.ceil(phase.goodKeywords.length * 0.32));
  const coverage = Math.min(100, Math.round((goodHits / target) * 100));

  // ── Depth (length / structure) — 30% ──
  const minLen = phase.minChars;
  const lenRatio = len / minLen;
  const hasStructure = /[\n,;:—-]/.test(prompt) || wordCount >= 25;
  const depth = Math.min(
    100,
    (lenRatio < 0.5
      ? 18
      : lenRatio < 0.9
      ? 42
      : lenRatio < 1.4
      ? 68
      : lenRatio < 2.2
      ? 86
      : 96) + (hasStructure ? 6 : 0)
  );

  // ── Sharpness (bonus terms / nuance) — 20% ──
  const bonusHits = phase.bonusKeywords.filter((kw) =>
    lower.includes(kw.toLowerCase())
  ).length;
  const sharpness = Math.min(100, bonusHits * 22 + (wordCount > 30 ? 14 : 0));

  const total = Math.round(coverage * 0.5 + depth * 0.3 + sharpness * 0.2);
  const crit = total >= 88 && bonusHits >= 2;
  return { score: Math.max(0, Math.min(100, total)), crit };
}

// ─── Damage formula ─────────────────────────────────────────────────────────

const FEEDBACK_BY_TIER: Record<RoundResult["tier"], string[]> = {
  S: [
    "// CRITICAL HIT — ROGUE.AI ระบบรวนหนัก!",
    "// SIGNAL: PERFECT — บอสปกป้องตัวเองไม่ทันแล้ว!",
  ],
  A: [
    "// SOLID HIT — บอสเสียหายมาก",
    "// ATTACK STRENGTH: HIGH — สู้ต่อได้!",
  ],
  B: [
    "// HIT — บอสตอบโต้บ้างเล็กน้อย",
    "// CONTACT — เพิ่มรายละเอียดจะดีขึ้น",
  ],
  C: [
    "// WEAK HIT — บอสตอบโต้! เสริม keyword หลักให้ครบ",
    "// GLANCING BLOW — prompt ยังไม่ครอบคลุม",
  ],
  D: [
    "// MISS — บอส COUNTER เต็มแรง! ลองเขียนให้ละเอียดขึ้น",
    "// SYSTEM: prompt ขาดสาระ ROGUE.AI ฉวยโอกาสโจมตี",
  ],
};

function tierForScore(score: number): RoundResult["tier"] {
  if (score >= 85) return "S";
  if (score >= 68) return "A";
  if (score >= 48) return "B";
  if (score >= 28) return "C";
  return "D";
}

export function resolveRound(
  prompt: string,
  state: BattleState
): { state: BattleState; result: RoundResult } {
  const phase = BOSS_PHASES[state.currentPhaseIdx];
  const { score, crit } = scorePromptForPhase(prompt, phase);

  // Boss damage = score, plus +20 crit bonus (capped)
  const bossDamage = Math.min(state.bossHp, score + (crit ? 20 : 0));

  // Counter scales inversely with score; min 0 (perfect prompt = no damage)
  const baseCounter = Math.max(0, Math.round(28 - score * 0.28));
  const playerDamage = Math.min(state.playerStability, baseCounter);

  const tier = tierForScore(score);
  const countered = playerDamage > 0;
  const pool = FEEDBACK_BY_TIER[tier];
  const feedback = pool[Math.floor(Math.random() * pool.length)];

  const result: RoundResult = {
    phase,
    score,
    bossDamage,
    playerDamage,
    tier,
    countered,
    feedback,
    crit,
  };

  const nextHp = Math.max(0, state.bossHp - bossDamage);
  const nextStability = Math.max(0, state.playerStability - playerDamage);
  const nextPhaseIdx = Math.min(state.currentPhaseIdx + 1, BOSS_PHASES.length);

  return {
    state: {
      bossHp: nextHp,
      playerStability: nextStability,
      currentPhaseIdx: nextPhaseIdx,
      rounds: [...state.rounds, result],
    },
    result,
  };
}

// ─── Outcome ────────────────────────────────────────────────────────────────

export type BattleOutcome = "victory" | "defeat";

/** Persisted summary for profile / battle history */
export interface BossBattleRoundSnapshot {
  phaseId: BossPhaseId;
  score: number;
  tier: RoundResult["tier"];
  bossDamage: number;
  playerDamage: number;
  countered: boolean;
  crit: boolean;
}

export interface BossBattleLogEntry {
  id: number;
  missionId: string;
  missionTitle: string;
  outcome: BattleOutcome;
  endedAt: number;
  rounds: BossBattleRoundSnapshot[];
  avgScore: number;
}

export function buildBossBattleLogPayload(
  missionId: string,
  missionTitle: string,
  state: BattleState,
  outcome: BattleOutcome
): Omit<BossBattleLogEntry, "id"> {
  return {
    missionId,
    missionTitle,
    outcome,
    endedAt: Date.now(),
    avgScore: averageRoundScore(state),
    rounds: state.rounds.map((r) => ({
      phaseId: r.phase.id,
      score: r.score,
      tier: r.tier,
      bossDamage: r.bossDamage,
      playerDamage: r.playerDamage,
      countered: r.countered,
      crit: r.crit,
    })),
  };
}

export function battleOutcome(state: BattleState): BattleOutcome | null {
  if (state.playerStability <= 0) return "defeat";
  if (state.bossHp <= 0) return "victory";
  if (state.currentPhaseIdx >= BOSS_PHASES.length) {
    return state.bossHp <= 0 ? "victory" : "defeat";
  }
  return null;
}

/** Returns the average prompt score across rounds (0-100). */
export function averageRoundScore(state: BattleState): number {
  if (state.rounds.length === 0) return 0;
  const sum = state.rounds.reduce((acc, r) => acc + r.score, 0);
  return Math.round(sum / state.rounds.length);
}

/** Compute final XP / credits scaled by performance. */
export function computeBossRewards(
  state: BattleState,
  baseXp: number,
  baseCredits: number
): { xp: number; credits: number; multiplier: number } {
  const avg = averageRoundScore(state);
  // 50% score = 0.5x rewards, 100% score = 1x, perfect S-runs slightly above
  const crits = state.rounds.filter((r) => r.crit).length;
  const multiplier = Math.min(1.25, avg / 100 + crits * 0.05);
  return {
    xp: Math.round(baseXp * multiplier),
    credits: Math.round(baseCredits * multiplier),
    multiplier,
  };
}
