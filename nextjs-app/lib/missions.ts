import type { Mission, World, WorldId } from "./types";

// ─── Worlds ──────────────────────────────────────────────────────────────────

export const WORLDS: World[] = [
  {
    id: "ai-origins",
    name: "AI ORIGINS",
    tagline: "Where the awakening began",
    description:
      "เขตเริ่มต้นของ Neural Network — เรียนรู้รากฐานของ AI และตื่นรู้ในฐานะนักรบดิจิทัล",
    color: "#00f5ff",
    unlockLevel: 1,
    icon: "🌐",
  },
  {
    id: "machine-mind",
    name: "MACHINE MIND",
    tagline: "Architects of thought",
    description:
      "พื้นที่ของผู้ออกแบบสถาปัตยกรรม AI — Deep Learning, Neural Architectures, และระบบที่คิดเองได้",
    color: "#bf00ff",
    unlockLevel: 5,
    icon: "🧠",
  },
  {
    id: "deep-network",
    name: "DEEP NETWORK",
    tagline: "Beyond human comprehension",
    description:
      "ส่วนที่ลึกที่สุดของระบบ AI — Generative Models, Multi-Agent Systems, และความลับของ AGI",
    color: "#ff0080",
    unlockLevel: 10,
    icon: "⚡",
  },
];

export function getWorld(id: string): World | undefined {
  return WORLDS.find((w) => w.id === id);
}

// ─── Missions ────────────────────────────────────────────────────────────────

export const MISSIONS: Mission[] = [
  {
    id: "what-is-ai",
    code: "M-001",
    worldId: "ai-origins",
    title: "What is AI?",
    description: "เรียนพื้นฐาน AI และแนวคิดหลักที่เปลี่ยนโลก",
    icon: "🧠",
    difficulty: "EASY",
    energyCost: 1,
    reward: { xp: 100, credits: 20 },
    href: "/missions/what-is-ai",
    order: 1,
  },
  {
    id: "ml-101",
    code: "M-002",
    worldId: "ai-origins",
    title: "Machine Learning 101",
    description: "เข้าใจวิธีที่ Machine Learning ทำงาน",
    icon: "⚙️",
    difficulty: "EASY",
    energyCost: 1,
    reward: { xp: 200, credits: 40 },
    href: "/missions/ml-101",
    order: 2,
  },
  {
    id: "neural-network",
    code: "M-003",
    worldId: "ai-origins",
    title: "Neural Network Basics",
    description: "สำรวจโครงสร้าง Neural Network และเซลล์ประสาทดิจิทัล",
    icon: "🔗",
    difficulty: "MEDIUM",
    energyCost: 2,
    reward: { xp: 350, credits: 70 },
    href: "/missions/neural-network",
    order: 3,
  },
  {
    id: "social-post",
    code: "M-004",
    worldId: "ai-origins",
    title: "Social AI Agent",
    description: "เขียน prompt ให้ AI สร้างโพสต์โซเชียลมีเดียที่ขายของได้",
    icon: "✍️",
    difficulty: "MEDIUM",
    energyCost: 2,
    reward: { xp: 500, credits: 100 },
    href: "/missions/social-post",
    order: 4,
  },
  {
    id: "boss-chatbot",
    code: "BOSS-01",
    worldId: "ai-origins",
    title: "AI BOSS: Build a Chatbot",
    description:
      "ภารกิจสุดท้ายของ World 1 — เผชิญหน้ากับการสร้าง Chatbot ของคุณเอง",
    icon: "👾",
    difficulty: "BOSS",
    energyCost: 3,
    reward: { xp: 1000, credits: 250 },
    href: "/mission/boss-chatbot",
    order: 5,
  },
  // ─── World 2 ── coming soon (locked until level unlock) ─────────────────
  {
    id: "deep-learning",
    code: "M-101",
    worldId: "machine-mind",
    title: "Deep Learning Awakening",
    description: "ปลดล็อกพลังของ Deep Neural Networks",
    icon: "🧠",
    difficulty: "HARD",
    energyCost: 2,
    reward: { xp: 600, credits: 150 },
    href: "/mission/deep-learning",
    order: 1,
  },
  {
    id: "transformers",
    code: "M-102",
    worldId: "machine-mind",
    title: "Attention Protocol",
    description: "เข้าใจ Transformer architecture เบื้องหลัง GPT",
    icon: "🌀",
    difficulty: "HARD",
    energyCost: 3,
    reward: { xp: 800, credits: 200 },
    href: "/mission/transformers",
    order: 2,
  },
];

export function getMission(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}

export function missionsInWorld(worldId: string): Mission[] {
  return MISSIONS.filter((m) => m.worldId === worldId).sort(
    (a, b) => a.order - b.order
  );
}

/** Mission is unlocked once all earlier missions in its world are completed */
export function isMissionUnlocked(
  mission: Mission,
  completed: string[]
): boolean {
  const earlier = MISSIONS.filter(
    (m) => m.worldId === mission.worldId && m.order < mission.order
  );
  return earlier.every((m) => completed.includes(m.id));
}

/**
 * A world is unlocked when EITHER the player has reached its `unlockLevel`,
 * OR they've defeated the boss of the previous world (the "skip ahead" path
 * that closes the World 1 progression loop). World 1 is always unlocked.
 */
const PREV_WORLD_BOSS: Partial<Record<WorldId, string>> = {
  "machine-mind": "boss-chatbot",
  // Future: "deep-network": "boss-machine-mind",
};

export function isWorldUnlocked(
  world: World,
  playerLevel: number,
  completed: string[]
): boolean {
  if (playerLevel >= world.unlockLevel) return true;
  const requiredBoss = PREV_WORLD_BOSS[world.id];
  if (requiredBoss && completed.includes(requiredBoss)) return true;
  return false;
}
