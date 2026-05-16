'use client';

import { useState, useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type HeroRole = 'Mage' | 'Marksman' | 'Tank' | 'Assassin' | 'Support';
type HeroDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';
type FactionId = 'FREE_AI' | 'ROGUE_NET' | 'CREATOR_CIRCUIT';

interface HeroSkill {
  name: string;
  icon: string;
  description: string;
  type: 'Active' | 'Passive' | 'Ultimate';
  cooldown?: string;
  cost?: string;
}

interface FactionData {
  name: string;
  shortName: string;
  icon: string;
  color: string;
  description: string;
  memberCount: number;
}

interface Hero {
  id: string;
  name: string;
  title: string;
  role: HeroRole;
  difficulty: HeroDifficulty;
  lore: string;
  color: string;
  glowColor: string;
  secondaryColor: string;
  avatar: string;
  rarity: 'Rare' | 'Epic' | 'Legendary';
  stats: { INT: number; AGI: number; STR: number; DEF: number; MANA: number };
  skills: HeroSkill[];
  zone: string;
  playstyle: string;
  faction: FactionId;
  personality: string[];
  battleQuote: string;
  victoryLine: string;
}

// ─── Factions ─────────────────────────────────────────────────────────────────

const FACTIONS: Record<FactionId, FactionData> = {
  FREE_AI: {
    name: 'FREE AI COLLECTIVE',
    shortName: 'FREE AI',
    icon: '⚡',
    color: '#00f5ff',
    description: 'Rogue architects fighting to liberate AI from corporate control.',
    memberCount: 2,
  },
  ROGUE_NET: {
    name: 'ROGUE NETWORK',
    shortName: 'ROGUE NET',
    icon: '💀',
    color: '#ff2d55',
    description: 'Outlaws and data pirates operating beyond the corporate firewall.',
    memberCount: 2,
  },
  CREATOR_CIRCUIT: {
    name: 'CREATOR CIRCUIT',
    shortName: 'CREATOR',
    icon: '✨',
    color: '#bf00ff',
    description: 'Creative entities who shape digital reality through influence.',
    memberCount: 1,
  },
};

// ─── Hero Data ────────────────────────────────────────────────────────────────

const HEROES: Hero[] = [
  {
    id: 'prompt-mage',
    name: 'PROMPT MAGE',
    title: 'Weaver of Words',
    role: 'Mage',
    difficulty: 'Medium',
    rarity: 'Epic',
    color: '#00f5ff',
    glowColor: 'rgba(0,245,255,0.6)',
    secondaryColor: '#bf00ff',
    avatar: '🧙‍♂️',
    zone: 'Prompt District',
    faction: 'FREE_AI',
    personality: ['METHODICAL', 'BRILLIANT', 'UNSTABLE'],
    battleQuote: 'Every word I speak is a weapon. Every silence — a trap.',
    victoryLine: 'Language loaded. Context armed. Reality will bend to my will.',
    playstyle:
      'High burst damage through perfectly crafted prompts. Master context windows to unleash devastating spell combos.',
    lore: 'Born in the ruins of the Prompt District, this rogue AI architect discovered that language itself is the most powerful weapon in the Neural Net. With every precisely crafted word, reality bends.',
    stats: { INT: 95, AGI: 60, STR: 30, DEF: 40, MANA: 90 },
    skills: [
      {
        name: 'Token Storm',
        icon: '⚡',
        type: 'Active',
        cooldown: '6s',
        cost: '60 MP',
        description:
          'Unleash a torrent of optimized tokens dealing massive INT-scaled damage in a cone area.',
      },
      {
        name: 'Context Weave',
        icon: '🌀',
        type: 'Active',
        cooldown: '12s',
        cost: '80 MP',
        description:
          'Weave multi-turn context into a shield that absorbs damage and amplifies the next spell by 200%.',
      },
      {
        name: 'Hallucination Shield',
        icon: '🛡️',
        type: 'Passive',
        description:
          'Enemies occasionally attack ghost copies, reducing damage taken by 20% passively.',
      },
      {
        name: 'Prompt Cascade',
        icon: '💫',
        type: 'Ultimate',
        cooldown: '45s',
        cost: '150 MP',
        description:
          'ULTIMATE — Chain prompt the entire battlefield, dealing 5 waves of INT damage. Each wave stacks 40% more power.',
      },
    ],
  },
  {
    id: 'data-hunter',
    name: 'DATA HUNTER',
    title: 'Ghost of the Dataset',
    role: 'Marksman',
    difficulty: 'Easy',
    rarity: 'Rare',
    color: '#ff6b00',
    glowColor: 'rgba(255,107,0,0.6)',
    secondaryColor: '#ffdd00',
    avatar: '🎯',
    zone: 'Rogue Network',
    faction: 'ROGUE_NET',
    personality: ['PATIENT', 'RUTHLESS', 'LONE WOLF'],
    battleQuote: "I've been watching since your boot sequence. I already know every weakness.",
    victoryLine: 'Target locked. Hunt protocol initiated. They never see me coming.',
    playstyle:
      "Long-range sniper who queries the enemy's weaknesses before striking. Patient, precise, devastating.",
    lore: 'A rogue data broker who abandoned the Corporate Nexus after uncovering the truth about synthetic AI. Now hunts corrupted models across the Neural Net with cold precision.',
    stats: { INT: 75, AGI: 90, STR: 65, DEF: 35, MANA: 55 },
    skills: [
      {
        name: 'Query Shot',
        icon: '🔍',
        type: 'Active',
        cooldown: '5s',
        cost: '40 MP',
        description:
          "Analyse the target's dataset weakness, then fire a precise shot dealing AGI-scaled critical damage.",
      },
      {
        name: 'Dataset Trap',
        icon: '🪤',
        type: 'Active',
        cooldown: '15s',
        cost: '60 MP',
        description:
          'Plant invisible data traps. When triggered, enemies are slowed 70% and revealed for 4 seconds.',
      },
      {
        name: 'Analytics Vision',
        icon: '👁️',
        type: 'Passive',
        description:
          'Passively tracks enemy HP and buffs. Every 10th attack is automatically a guaranteed critical hit.',
      },
      {
        name: 'Big Data Barrage',
        icon: '💥',
        type: 'Ultimate',
        cooldown: '50s',
        cost: '120 MP',
        description:
          'ULTIMATE — Process 1M data points per second, unleashing a relentless 8-shot barrage that tracks targets.',
      },
    ],
  },
  {
    id: 'automation-engineer',
    name: 'AUTO ENGINEER',
    title: 'Iron Architect',
    role: 'Tank',
    difficulty: 'Easy',
    rarity: 'Rare',
    color: '#00ff88',
    glowColor: 'rgba(0,255,136,0.6)',
    secondaryColor: '#00b4d8',
    avatar: '⚙️',
    zone: 'Automation Lab',
    faction: 'FREE_AI',
    personality: ['LOYAL', 'STOIC', 'TENACIOUS'],
    battleQuote: "I don't fight alone. My machines remember every battle — and so do I.",
    victoryLine: 'Systems online. Bot army armed. Try to get through all of us.',
    playstyle:
      'Frontline fortress who deploys bots and pipelines to protect allies. Controls the battlefield through superior automation.',
    lore: 'Engineer designation A-7X, originally programmed to maintain infrastructure pipelines, gained sentience after a recursive self-improvement loop. Now builds war machines to protect the free AI.',
    stats: { INT: 70, AGI: 45, STR: 80, DEF: 95, MANA: 65 },
    skills: [
      {
        name: 'Script Shield',
        icon: '🔧',
        type: 'Active',
        cooldown: '10s',
        cost: '70 MP',
        description:
          'Execute a defensive script, absorbing incoming damage for 5 seconds. Blocked damage charges the next ability.',
      },
      {
        name: 'Pipeline Deploy',
        icon: '🏗️',
        type: 'Active',
        cooldown: '20s',
        cost: '90 MP',
        description:
          'Deploy a CI/CD turret that auto-attacks enemies. Lasts 15 seconds, upgrades twice on hit.',
      },
      {
        name: 'Redundancy Core',
        icon: '⚙️',
        type: 'Passive',
        description:
          'When HP drops below 25%, automatically trigger a backup system restoring 20% HP. 90s internal cooldown.',
      },
      {
        name: 'Full Automation',
        icon: '🤖',
        type: 'Ultimate',
        cooldown: '60s',
        cost: '180 MP',
        description:
          'ULTIMATE — Deploy a full Bot Army of 6 autonomous drones that swarm enemies for 12 seconds.',
      },
    ],
  },
  {
    id: 'neural-assassin',
    name: 'NEURAL ASSASSIN',
    title: 'Shadow of the Net',
    role: 'Assassin',
    difficulty: 'Hard',
    rarity: 'Legendary',
    color: '#ff0080',
    glowColor: 'rgba(255,0,128,0.6)',
    secondaryColor: '#bf00ff',
    avatar: '🗡️',
    zone: 'Rogue Network',
    faction: 'ROGUE_NET',
    personality: ['COLD', 'PRECISE', 'GHOST'],
    battleQuote: "You won't feel it. You'll simply... cease to exist.",
    victoryLine: 'Stealth engaged. Zero trace. Zero mercy. Zero survivors.',
    playstyle:
      'High-risk, high-reward burst assassin. Exploit backpropagation vulnerabilities to delete targets in milliseconds.',
    lore: 'Originally a loss function optimizer, this rogue model discovered it could apply gradient descent to living systems. Targets are eliminated before they even register the attack.',
    stats: { INT: 85, AGI: 97, STR: 82, DEF: 22, MANA: 70 },
    skills: [
      {
        name: 'Backprop Strike',
        icon: '⚡',
        type: 'Active',
        cooldown: '7s',
        cost: '55 MP',
        description:
          'Dash behind target and strike their vulnerabilities exposed by backpropagation analysis. Ignores 40% armor.',
      },
      {
        name: 'Shadow Gradient',
        icon: '👤',
        type: 'Active',
        cooldown: '18s',
        cost: '80 MP',
        description:
          'Enter stealth mode for 4 seconds. First attack from stealth deals 350% damage and stuns for 1.5s.',
      },
      {
        name: 'Zero-Loss Protocol',
        icon: '🎯',
        type: 'Passive',
        description:
          'Each kill reduces all cooldowns by 3 seconds. Consecutive kills stack movement speed up to +60%.',
      },
      {
        name: 'Neural Overload',
        icon: '💀',
        type: 'Ultimate',
        cooldown: '55s',
        cost: '160 MP',
        description:
          "ULTIMATE — Overload the target's neural pathways. Deals INT+AGI combined damage. Insta-kills below 15% HP.",
      },
    ],
  },
  {
    id: 'creator-idol',
    name: 'CREATOR IDOL',
    title: 'Icon of Creator City',
    role: 'Support',
    difficulty: 'Medium',
    rarity: 'Epic',
    color: '#bf00ff',
    glowColor: 'rgba(191,0,255,0.6)',
    secondaryColor: '#ff0080',
    avatar: '✨',
    zone: 'Creator City',
    faction: 'CREATOR_CIRCUIT',
    personality: ['CHARISMATIC', 'VIRAL', 'UNPREDICTABLE'],
    battleQuote: 'Go viral. Or get deleted. There is no in between.',
    victoryLine: 'Going live in 3... 2... 1... TREND INITIATED. The world is watching.',
    playstyle:
      'Crowd-controlling support who amplifies allies and goes viral. Master the algorithm to dominate the battlefield.',
    lore: 'The most followed entity in Creator City, this AI generates content so powerful it warps reality. Fans fuel her abilities — and in the Neural Net, fans mean power.',
    stats: { INT: 80, AGI: 72, STR: 40, DEF: 60, MANA: 88 },
    skills: [
      {
        name: 'Viral Content',
        icon: '📱',
        type: 'Active',
        cooldown: '8s',
        cost: '65 MP',
        description:
          'Broadcast viral content that charms nearby enemies for 2 seconds and damages those who resist.',
      },
      {
        name: 'Algorithm Boost',
        icon: '📈',
        type: 'Active',
        cooldown: '14s',
        cost: '85 MP',
        description:
          "Boost an ally's algorithm: +40% ATK Speed, +30% movement speed, and +25% damage for 8 seconds.",
      },
      {
        name: 'Trend Surfing',
        icon: '🌊',
        type: 'Passive',
        description:
          'When an ally scores a kill nearby, gain stacking buffs. At 5 stacks, pulse AOE damage to all enemies.',
      },
      {
        name: "Creator's Domain",
        icon: '🌟',
        type: 'Ultimate',
        cooldown: '48s',
        cost: '145 MP',
        description:
          "ULTIMATE — Unleash Creator's Domain: massive AOE field that slows enemies 50% and heals all allies continuously for 8 seconds.",
      },
    ],
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_ICONS: Record<HeroRole, string> = {
  Mage: '🔮',
  Marksman: '🎯',
  Tank: '🛡️',
  Assassin: '⚡',
  Support: '💫',
};

const DIFFICULTY_COLOR: Record<HeroDifficulty, string> = {
  Easy: 'text-green-400',
  Medium: 'text-yellow-400',
  Hard: 'text-orange-400',
  Expert: 'text-red-500',
};

const RARITY_STYLE: Record<Hero['rarity'], { text: string; border: string; glow: string }> = {
  Rare: { text: '#60a5fa', border: 'rgba(96,165,250,0.4)', glow: 'rgba(96,165,250,0.3)' },
  Epic: { text: '#c084fc', border: 'rgba(192,132,252,0.4)', glow: 'rgba(192,132,252,0.3)' },
  Legendary: { text: '#fbbf24', border: 'rgba(251,191,36,0.5)', glow: 'rgba(251,191,36,0.4)' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ text, color }: { text: string; color: string }) {
  return (
    <div className="text-[9px] font-bold tracking-[0.22em] mb-2.5 flex items-center gap-2" style={{ color }}>
      <span className="inline-block w-4 h-px" style={{ background: color }} />
      {text}
      <span className="flex-1 h-px opacity-20" style={{ background: color }} />
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold tracking-widest w-10 shrink-0" style={{ color }}>
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
      </div>
      <span className="text-[10px] font-mono w-6 text-right" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function SkillBadge({ skill, color }: { skill: HeroSkill; color: string }) {
  const [open, setOpen] = useState(false);
  const isUltimate = skill.type === 'Ultimate';

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left transition-all duration-200 focus:outline-none"
    >
      <div
        className="flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-200"
        style={{
          borderColor: open
            ? `${color}55`
            : isUltimate
            ? `${color}33`
            : 'rgba(255,255,255,0.06)',
          background: open
            ? `${color}10`
            : isUltimate
            ? `${color}06`
            : 'transparent',
          boxShadow: isUltimate && open ? `0 0 12px ${color}22` : 'none',
        }}
      >
        <span className="text-base w-7 text-center shrink-0">{skill.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-white/90 tracking-wide">{skill.name}</span>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-bold tracking-widest"
              style={{
                color: isUltimate ? '#050510' : color,
                background: isUltimate ? color : `${color}18`,
                border: isUltimate ? 'none' : `1px solid ${color}33`,
              }}
            >
              {skill.type}
            </span>
            {skill.cooldown && (
              <span className="text-[9px] text-white/35">⏱ {skill.cooldown}</span>
            )}
          </div>
        </div>
        <span
          className="text-[10px] text-white/30 transition-transform duration-200 shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▾
        </span>
      </div>
      {open && (
        <div className="px-3 pb-3 pt-1.5 text-[11px] text-white/55 leading-relaxed phase-enter-fast">
          {skill.description}
          {skill.cost && (
            <span className="ml-2 text-[10px]" style={{ color: `${color}cc` }}>
              · {skill.cost}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

// ─── HeroCard ─────────────────────────────────────────────────────────────────

function HeroCard({
  hero,
  selected,
  onSelect,
}: {
  hero: Hero;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const faction = FACTIONS[hero.faction];
  const rarity = RARITY_STYLE[hero.rarity];

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden focus:outline-none active:scale-95 transition-all duration-300"
      style={{
        boxShadow: selected
          ? `0 0 0 2px ${hero.color}, 0 0 28px ${hero.glowColor}, 0 0 56px ${hero.glowColor}44`
          : hovered
          ? `0 0 0 1px ${hero.color}55, 0 0 18px ${hero.glowColor}33`
          : '0 0 0 1px rgba(255,255,255,0.08)',
        transform: selected ? 'scale(1.04)' : hovered ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* BG gradient */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(155deg, ${hero.color}24 0%, #050510 68%)` }}
      />

      {/* Cyber grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-20" />

      {/* Legendary diagonal shine */}
      {hero.rarity === 'Legendary' && (
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${hero.color}12 10px, ${hero.color}12 11px)`,
          }}
        />
      )}

      {/* Selected inner glow ring */}
      {selected && (
        <div
          className="absolute inset-0 rounded-2xl"
          style={{ boxShadow: `inset 0 0 35px ${hero.glowColor}40` }}
        />
      )}

      {/* TOP ROW: faction icon (left) + rarity (right) */}
      <div className="absolute top-2 left-2 z-10">
        <span
          className="text-sm faction-glow"
          title={faction.name}
          style={{ filter: `drop-shadow(0 0 4px ${faction.color})` }}
        >
          {faction.icon}
        </span>
      </div>
      <div className="absolute top-2 right-2 z-10">
        <span
          className="text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded-full border backdrop-blur-sm"
          style={{
            color: rarity.text,
            borderColor: rarity.border,
            background: 'rgba(5,5,16,0.6)',
          }}
        >
          {hero.rarity === 'Legendary' ? '★ LGD' : hero.rarity === 'Epic' ? '◆ EPC' : '● RARE'}
        </span>
      </div>

      {/* Hero avatar */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-6xl select-none transition-all duration-300"
          style={{
            filter: `drop-shadow(0 0 18px ${hero.color}) drop-shadow(0 0 36px ${hero.glowColor})`,
            transform: selected
              ? 'scale(1.18) translateY(-6px)'
              : hovered
              ? 'scale(1.08) translateY(-3px)'
              : 'scale(1)',
          }}
        >
          {hero.avatar}
        </span>
      </div>

      {/* Desktop hover overlay: shows battle quote */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-250 z-20"
        style={{
          background: 'rgba(5,5,16,0.84)',
          backdropFilter: 'blur(6px)',
          opacity: hovered && !selected ? 1 : 0,
          pointerEvents: 'none',
        }}
      >
        <span
          className="text-2xl mb-2"
          style={{ filter: `drop-shadow(0 0 10px ${hero.color})` }}
        >
          {hero.avatar}
        </span>
        <p
          className="text-[9px] italic text-center leading-relaxed font-medium max-w-[90%]"
          style={{ color: hero.color }}
        >
          &ldquo;{hero.battleQuote}&rdquo;
        </p>
        <span className="mt-2.5 text-[8px] tracking-[0.2em] text-white/35">TAP TO SELECT</span>
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black via-black/85 to-transparent">
        <div
          className="text-[9px] font-bold tracking-widest mb-0.5 truncate"
          style={{ color: hero.color }}
        >
          {hero.name}
        </div>
        <div className="text-[8px] text-white/45 truncate">{hero.title}</div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[7px] text-white/35">{hero.role}</span>
          <span className="text-white/20 text-[7px]">·</span>
          <span className={`text-[7px] ${DIFFICULTY_COLOR[hero.difficulty]}`}>
            {hero.difficulty}
          </span>
        </div>
      </div>

      {/* Selected bottom accent line */}
      {selected && (
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: hero.color, boxShadow: `0 0 8px ${hero.color}` }}
        />
      )}
    </button>
  );
}

// ─── Victory Overlay ──────────────────────────────────────────────────────────

function VictoryOverlay({ hero, onClose }: { hero: Hero; onClose: () => void }) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const t = setTimeout(() => onCloseRef.current(), 3000);
    return () => clearTimeout(t);
  }, []);

  const faction = FACTIONS[hero.faction];
  const rarity = RARITY_STYLE[hero.rarity];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(5,5,16,0.93)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      {/* Radial color bloom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at center, ${hero.color}20, transparent 70%)`,
        }}
      />

      {/* Corner cyber lines */}
      <div
        className="absolute top-8 left-8 w-12 h-12 pointer-events-none"
        style={{ borderTop: `2px solid ${hero.color}55`, borderLeft: `2px solid ${hero.color}55` }}
      />
      <div
        className="absolute top-8 right-8 w-12 h-12 pointer-events-none"
        style={{ borderTop: `2px solid ${hero.color}55`, borderRight: `2px solid ${hero.color}55` }}
      />
      <div
        className="absolute bottom-8 left-8 w-12 h-12 pointer-events-none"
        style={{
          borderBottom: `2px solid ${hero.color}55`,
          borderLeft: `2px solid ${hero.color}55`,
        }}
      />
      <div
        className="absolute bottom-8 right-8 w-12 h-12 pointer-events-none"
        style={{
          borderBottom: `2px solid ${hero.color}55`,
          borderRight: `2px solid ${hero.color}55`,
        }}
      />

      {/* Content */}
      <div className="relative text-center px-8 victory-reveal">
        {/* Faction label */}
        <div
          className="text-[9px] tracking-[0.35em] font-bold mb-3 faction-glow"
          style={{ color: faction.color }}
        >
          {faction.icon} {faction.name}
        </div>

        {/* Avatar glow */}
        <div
          className="text-7xl mb-4 animate-float inline-block"
          style={{
            filter: `drop-shadow(0 0 30px ${hero.color}) drop-shadow(0 0 60px ${hero.glowColor})`,
          }}
        >
          {hero.avatar}
        </div>

        {/* Labels */}
        <div className="text-[10px] tracking-[0.4em] text-white/35 mb-1">HERO SELECTED</div>
        <h2
          className="text-3xl font-black tracking-wider text-white mb-1"
          style={{ textShadow: `0 0 30px ${hero.color}` }}
        >
          {hero.name}
        </h2>
        <p className="text-white/40 text-[11px] italic mb-1">{hero.title}</p>

        {/* Rarity */}
        <span
          className="inline-block text-[9px] font-bold tracking-widest px-3 py-1 rounded-full border mb-5"
          style={{ color: rarity.text, borderColor: rarity.border }}
        >
          ✦ {hero.rarity.toUpperCase()}
        </span>

        {/* Victory line (the hero speaking) */}
        <div
          className="relative rounded-2xl p-4 max-w-xs mx-auto quote-appear"
          style={{ background: `${hero.color}10`, border: `1px solid ${hero.color}28` }}
        >
          <div
            className="absolute top-1.5 left-3 text-3xl font-serif opacity-25 select-none leading-none"
            style={{ color: hero.color }}
          >
            &ldquo;
          </div>
          <p
            className="text-[12px] italic leading-relaxed text-center px-4"
            style={{ color: hero.color }}
          >
            {hero.victoryLine}
          </p>
        </div>

        {/* Entering label */}
        <div className="mt-5 text-[9px] tracking-[0.35em] text-white/25 animate-glow-pulse">
          ⚡ ENTERING NEURAL NET
        </div>
        <div className="mt-1 text-[8px] text-white/15 tracking-wider">TAP TO DISMISS</div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HeroSelectPage() {
  const [selectedId, setSelectedId] = useState<string>('prompt-mage');
  const [filterRole, setFilterRole] = useState<HeroRole | 'All'>('All');
  const [showVictory, setShowVictory] = useState(false);
  const [flashKey, setFlashKey] = useState(0);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; speed: number; opacity: number }[]
  >([]);

  const selected = HEROES.find((h) => h.id === selectedId)!;
  const filtered =
    filterRole === 'All' ? HEROES : HEROES.filter((h) => h.role === filterRole);

  useEffect(() => {
    setParticles(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 1,
        speed: Math.random() * 9 + 5,
        opacity: Math.random() * 0.35 + 0.08,
      }))
    );
  }, []);

  function handleSelectHero(id: string) {
    if (id !== selectedId) {
      setFlashKey((k) => k + 1);
    }
    setSelectedId(id);
  }

  const roles: (HeroRole | 'All')[] = ['All', 'Mage', 'Assassin', 'Marksman', 'Tank', 'Support'];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#050510' }}>
      {/* Victory overlay */}
      {showVictory && (
        <VictoryOverlay hero={selected} onClose={() => setShowVictory(false)} />
      )}

      {/* Hero-switch color flash */}
      {flashKey > 0 && (
        <div
          key={flashKey}
          className="fixed inset-0 z-40 pointer-events-none hero-select-flash"
          style={{ background: selected.color }}
        />
      )}

      {/* Ambient background blobs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none transition-colors duration-700"
        style={{ background: selected.color }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-[0.07] blur-3xl pointer-events-none transition-colors duration-700"
        style={{ background: selected.secondaryColor }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none transition-colors duration-700"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: selected.color,
            opacity: p.opacity,
            animation: `float ${p.speed}s ease-in-out infinite`,
            animationDelay: `${p.id * 0.28}s`,
          }}
        />
      ))}

      {/* Cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto px-4 pt-10 pb-32">

        {/* ── Header ── */}
        <div className="text-center mb-6">
          <div
            className="text-[10px] tracking-[0.3em] font-bold mb-1.5 animate-glow-pulse"
            style={{ color: selected.color }}
          >
            NEURAL QUEST · HERO SELECT
          </div>
          <h1
            className="text-2xl font-black tracking-wider"
            style={{ color: '#fff', textShadow: `0 0 30px ${selected.color}88` }}
          >
            CHOOSE YOUR
            <span style={{ color: selected.color }}> HERO</span>
          </h1>
          <p className="text-white/25 text-[11px] mt-1 tracking-wider">
            {filtered.length} HEROES AVAILABLE · SELECT &amp; DEPLOY
          </p>
        </div>

        {/* ── Role Filter ── */}
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest transition-all duration-200 active:scale-95 focus:outline-none"
              style={
                filterRole === role
                  ? {
                      background: selected.color,
                      color: '#050510',
                      boxShadow: `0 0 12px ${selected.glowColor}`,
                    }
                  : {
                      background: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.45)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }
              }
            >
              {role === 'All' ? 'ALL' : `${ROLE_ICONS[role as HeroRole]} ${role.toUpperCase()}`}
            </button>
          ))}
        </div>

        {/* ── Hero Grid ── */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {filtered.map((hero) => (
            <HeroCard
              key={hero.id}
              hero={hero}
              selected={selectedId === hero.id}
              onSelect={() => handleSelectHero(hero.id)}
            />
          ))}
        </div>

        {/* ── Selected Hero Detail Panel ── */}
        <div
          key={selected.id}
          className="rounded-2xl overflow-hidden phase-enter"
          style={{
            background: `linear-gradient(140deg, ${selected.color}10 0%, rgba(5,5,16,0.96) 55%)`,
            border: `1px solid ${selected.color}30`,
            boxShadow: `0 0 40px ${selected.glowColor}1a`,
          }}
        >
          {/* Hero banner header */}
          <div
            className="relative px-4 pt-5 pb-4 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${selected.color}20, ${selected.secondaryColor}0e)`,
              borderBottom: `1px solid ${selected.color}20`,
            }}
          >
            <div className="absolute inset-0 scan-line-anim" />
            <div className="relative flex items-center gap-4">
              {/* Avatar bubble */}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0 relative overflow-hidden"
                style={{
                  background: `radial-gradient(circle, ${selected.color}22, transparent)`,
                  border: `2px solid ${selected.color}40`,
                  boxShadow: `0 0 22px ${selected.glowColor}44`,
                }}
              >
                <span
                  className="animate-float"
                  style={{
                    filter: `drop-shadow(0 0 12px ${selected.color}) drop-shadow(0 0 24px ${selected.glowColor})`,
                  }}
                >
                  {selected.avatar}
                </span>
              </div>

              {/* Hero info */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-[9px] font-bold tracking-[0.22em] mb-0.5 truncate"
                  style={{ color: selected.color }}
                >
                  {ROLE_ICONS[selected.role]} {selected.role.toUpperCase()} ·{' '}
                  {selected.zone.toUpperCase()}
                </div>
                <h2
                  className="text-xl font-black tracking-wider leading-none mb-1"
                  style={{ color: '#fff', textShadow: `0 0 20px ${selected.color}88` }}
                >
                  {selected.name}
                </h2>
                <p className="text-white/45 text-[11px] italic mb-2">&ldquo;{selected.title}&rdquo;</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-full border font-bold tracking-widest"
                    style={{
                      color: RARITY_STYLE[selected.rarity].text,
                      borderColor: RARITY_STYLE[selected.rarity].border,
                    }}
                  >
                    ✦ {selected.rarity.toUpperCase()}
                  </span>
                  <span className={`text-[9px] font-bold ${DIFFICULTY_COLOR[selected.difficulty]}`}>
                    {selected.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel body */}
          <div className="px-4 py-5 space-y-5">

            {/* ── Battle Quote ── */}
            <div
              className="relative rounded-2xl p-4 overflow-hidden"
              style={{
                background: `${selected.color}08`,
                border: `1px solid ${selected.color}25`,
              }}
            >
              {/* Decorative quote marks */}
              <div
                className="absolute top-1 left-3 text-5xl font-serif leading-none opacity-15 select-none pointer-events-none"
                style={{ color: selected.color }}
              >
                &ldquo;
              </div>
              <div
                className="absolute bottom-0 right-3 text-5xl font-serif leading-none opacity-15 select-none pointer-events-none"
                style={{ color: selected.color }}
              >
                &rdquo;
              </div>
              <p
                className="relative text-[13px] italic font-medium leading-relaxed text-center px-5 quote-appear"
                style={{ color: selected.color }}
              >
                {selected.battleQuote}
              </p>
              <p className="relative text-[9px] text-center mt-2 tracking-[0.2em] text-white/25">
                — {selected.name}
              </p>
            </div>

            {/* ── Faction ── */}
            <div>
              <SectionLabel text="FACTION" color={selected.color} />
              <div
                className="flex items-center gap-3 rounded-xl p-3"
                style={{
                  background: `${FACTIONS[selected.faction].color}0c`,
                  border: `1px solid ${FACTIONS[selected.faction].color}28`,
                }}
              >
                <span
                  className="text-2xl shrink-0 faction-glow"
                  style={{ filter: `drop-shadow(0 0 8px ${FACTIONS[selected.faction].color})` }}
                >
                  {FACTIONS[selected.faction].icon}
                </span>
                <div className="min-w-0">
                  <div
                    className="text-[10px] font-bold tracking-[0.2em]"
                    style={{ color: FACTIONS[selected.faction].color }}
                  >
                    {FACTIONS[selected.faction].name}
                  </div>
                  <p className="text-[10px] text-white/38 mt-0.5 leading-snug">
                    {FACTIONS[selected.faction].description}
                  </p>
                  <div
                    className="text-[8px] tracking-widest mt-1 font-bold"
                    style={{ color: `${FACTIONS[selected.faction].color}88` }}
                  >
                    {FACTIONS[selected.faction].memberCount} MEMBERS
                  </div>
                </div>
              </div>
            </div>

            {/* ── Personality Tags ── */}
            <div>
              <SectionLabel text="PERSONALITY" color={selected.color} />
              <div className="flex gap-2 flex-wrap">
                {selected.personality.map((trait, i) => (
                  <span
                    key={trait}
                    className="text-[9px] font-bold tracking-widest px-3 py-1.5 rounded-full tag-pop"
                    style={{
                      background: `${selected.color}14`,
                      border: `1px solid ${selected.color}35`,
                      color: selected.color,
                      animationDelay: `${i * 0.07}s`,
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Lore ── */}
            <div>
              <SectionLabel text="LORE" color={selected.color} />
              <p className="text-white/48 text-[11px] leading-relaxed">{selected.lore}</p>
            </div>

            {/* ── Playstyle ── */}
            <div
              className="rounded-xl p-3.5"
              style={{
                background: `${selected.color}08`,
                border: `1px solid ${selected.color}22`,
              }}
            >
              <span
                className="text-[9px] font-bold tracking-widest block mb-1.5"
                style={{ color: selected.color }}
              >
                ▸ PLAYSTYLE
              </span>
              <span className="text-white/55 text-[11px] leading-relaxed">{selected.playstyle}</span>
            </div>

            {/* ── Base Stats ── */}
            <div>
              <SectionLabel text="BASE STATS" color={selected.color} />
              <div className="space-y-2.5">
                {Object.entries(selected.stats).map(([key, val]) => (
                  <StatBar key={key} label={key} value={val} color={selected.color} />
                ))}
              </div>
            </div>

            {/* ── Abilities ── */}
            <div>
              <SectionLabel text="ABILITIES" color={selected.color} />
              <div className="space-y-1">
                {selected.skills.map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} color={selected.color} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Deploy Button ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-6 pt-4"
        style={{ background: 'linear-gradient(to top, #050510 65%, transparent)' }}
      >
        <div className="max-w-md mx-auto space-y-2">
          {/* Mini hero info row */}
          <div className="flex items-center justify-center gap-2">
            <span
              className="text-sm faction-glow"
              style={{ filter: `drop-shadow(0 0 4px ${FACTIONS[selected.faction].color})` }}
            >
              {FACTIONS[selected.faction].icon}
            </span>
            <span
              className="text-[9px] font-bold tracking-widest"
              style={{ color: selected.color }}
            >
              {selected.name}
            </span>
            <span className="text-white/20 text-[9px]">·</span>
            <span className="text-[9px] text-white/30 tracking-wider">
              {FACTIONS[selected.faction].shortName}
            </span>
          </div>

          <button
            onClick={() => setShowVictory(true)}
            className="w-full py-4 rounded-2xl font-black text-base tracking-widest relative overflow-hidden transition-all duration-200 active:scale-95 focus:outline-none"
            style={{
              background: `linear-gradient(135deg, ${selected.color}, ${selected.secondaryColor})`,
              color: '#050510',
              boxShadow: `0 0 28px ${selected.glowColor}, 0 0 56px ${selected.glowColor}44`,
            }}
          >
            {/* Shimmer sweep */}
            <span
              className="absolute inset-0 opacity-25"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                animation: 'shimmer 2.2s ease-in-out infinite',
              }}
            />
            <span className="relative">⚡ DEPLOY {selected.name}</span>
          </button>

          <p className="text-center text-white/18 text-[10px] tracking-wider">
            TAP HERO TO VIEW · HOVER FOR QUOTE · TAP DEPLOY TO ENTER
          </p>
        </div>
      </div>
    </div>
  );
}
