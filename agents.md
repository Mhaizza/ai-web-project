# NEURAL QUEST — AI HERO RPG

## Project Overview

We are building a mobile-first cyberpunk AI Hero RPG game.

The game combines:

* Hero-based RPG gameplay
* Cyberpunk aesthetics
* AI-powered progression systems
* Interactive missions
* Mobile game retention mechanics

The project is inspired by:

* Mobile Legends
* Cyberpunk RPG games
* Live-service mobile games
* AI evolution systems

The experience should feel like:

* A futuristic AI hero simulator
* A progression-driven RPG
* A cyberpunk mobile game
* A living AI world

---

## Core Vision

Players enter a futuristic digital world where AI heroes evolve through missions, battles, upgrades, and AI-powered abilities.

Players should feel like:

* elite AI operatives
* cyberpunk heroes
* digital warriors
* futuristic AI users

Learning AI concepts should feel natural and integrated into gameplay — never like a traditional quiz or exam.

The game must prioritize:

* fun
* immersion
* progression
* emotional attachment to heroes
* addictive gameplay loops

---

## Core Gameplay Loop

1. Enter the game
2. Choose missions
3. Interact with AI systems and NPCs
4. Complete objectives
5. Gain XP and rewards
6. Upgrade heroes and AI powers
7. Unlock new worlds, skills, and systems
8. Repeat progression loop

Gameplay sessions should feel:

* fast
* rewarding
* mobile-friendly
* addictive

---

## Core Systems

### Hero System

Players choose and upgrade AI hero classes.

Examples:

* Prompt Mage
* Data Hunter
* Automation Engineer
* Neural Assassin
* Creator Idol

Each hero should have:

* unique abilities
* progression paths
* visual identity
* specialization systems

---

### Progression System

* XP
* Levels
* Skill trees
* Unlock systems
* Rank progression
* Rewards
* Daily quests
* Achievements

---

### Mission System

Missions should feel like:

* RPG quests
* cyberpunk operations
* AI simulations
* interactive gameplay scenarios

Avoid:

* long essays
* exam feeling
* text-heavy educational flow

Prioritize:

* interaction
* fast feedback
* immersive gameplay
* mission variety

---

### AI Systems

Future AI systems may include:

* AI companions
* evolving personalities
* adaptive NPCs
* AI-generated missions
* dynamic dialogue systems

For now:
keep systems lightweight and prototype-friendly.

---

### World Design

The game world is a futuristic cyberpunk AI network.

Possible zones:

* Prompt District
* Creator City
* Automation Lab
* Corporate Nexus
* Rogue Network

The world should feel:

* alive
* futuristic
* digital
* dangerous
* immersive

---

## Mobile-First Direction

This project is primarily designed for smartphones.

The website acts as:

* account portal
* community hub
* news platform
* leaderboard system
* promotional website

UI/UX priorities:

* touch-friendly controls
* vertical layouts
* responsive design
* large buttons
* smooth transitions
* fast interactions

The game should feel like a premium mobile RPG.

---

## UI Direction

Style:

* Cyberpunk
* Futuristic
* Neon glow
* Dark mode
* High-tech RPG interface

Inspirations:

* Mobile Legends
* Cyberpunk 2077 UI
* futuristic mobile RPGs
* sci-fi dashboards

Important:
UI should prioritize:

* immersion
* readability
* responsiveness
* game feel

---

## Development Priorities

Priority Order:

1. Gameplay feel
2. Hero progression
3. Mobile UX
4. Retention loops
5. Immersion
6. Technical systems

Always prioritize:

* playable systems
* fun interactions
* rapid prototyping

Avoid:

* overengineering
* unnecessary complexity
* enterprise architecture early on

---

## Technical Stack

Frontend:

* Next.js
* Tailwind CSS

Backend:

* Supabase

Deployment:

* Vercel

Future AI Systems:

* Python
* FastAPI
* OpenAI APIs

---

## Development Philosophy

Build small playable systems step-by-step.

Focus on:

* game feel
* progression
* immersion
* interaction quality

Do not attempt to build everything at once.

Prototype first.
Polish later.

Every new feature should answer:
“Does this make the game more fun?”

---

## Cursor Cloud specific instructions

### Layout: two independent npm apps
This repo contains two separate, standalone Next.js 16 / React 19 apps (each with its own `package.json` + `package-lock.json`), not a workspace/monorepo:

* `nextjs-app/` — **NeuralQuest** (the primary product): a mobile-first cyberpunk AI-hero RPG. Gameplay/missions/XP are fully client-side; no backend, DB, or env vars required.
* repo root (`app/`) — a simpler "Futuristic AI Startup" marketing landing page.

Ignore the committed `OneDrive/Desktop/ai-web-project/NeuralQuest/` tree — it is a stale duplicate snapshot, not a maintained product.

### Running the apps (dev)
Standard scripts live in each `package.json` (`dev`/`build`/`start`/`lint`). Both apps default to port 3000, so to run both at once give one a different port, e.g. run NeuralQuest with `npm run dev` in `nextjs-app/` and the root landing with `PORT=3001 npm run dev` at the repo root.

### Non-obvious gotchas
* Root `npm run lint` is broken: its script is `next lint`, which was removed in Next 16 (`next lint` fails with "Invalid project directory"). Lint the root app with `npx eslint .` instead. `nextjs-app` uses `eslint` directly and its lint works (it currently reports pre-existing code-quality errors — not an env problem).
* Root `npm run build` fails type-checking because the root `tsconfig.json` `include`s the stale `OneDrive/.../NeuralQuest/` copy (whose `@/*` imports don't resolve at root). This is a pre-existing repo issue; the root **dev server still runs fine**. `nextjs-app` builds cleanly.
* No tests are configured (no `npm test`). Verification = lint + build + manual browser play of a mission (e.g. `/missions/what-is-ai`).
