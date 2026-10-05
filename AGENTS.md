# AGENTS.md: Startup Box (Frontend Prototype)

You are building a **frontend-only, demo-data prototype** of **Startup Box** for the iQOO hackathon (track: community app, on-device AI at the core). The prototype must feel like the real product: complete user flow, all main features, a gamified look, and a cosmic entry animation when a user enters a box. There is **no backend**. Everything is mocked locally.

Read this whole file before writing code. Follow the build order in section 14. Check the acceptance criteria in section 15 before you finish.

---

## 1. Product in one paragraph

Startup Box is a community app where an **on-device AI** matches skilled individuals (developers, designers, PMs, marketers) into **role-complete teams called "boxes"**. Each box has fixed roles and a person limit (example: 1 PM, 2 Developers, 1 UI/UX Designer, 1 Marketing). Once a box fills, members chat, run a **14-day trial sprint** with an AI-drafted plan, rate each other, and decide whether to continue as a startup team. Users pick a **commitment level** (Explorer / Builder / Founder) so they meet teammates at the same seriousness level. Personal data never leaves the device.

**Tagline:** Find teammates who are as serious as you are.

## 2. Hard constraints

- **Frontend only.** No server, no database, no real network calls. No real auth.
- **Dummy credentials.** Login accepts only the demo accounts in section 6. Show them on the login screen ("Use demo account" buttons).
- **Dummy data.** All users, boxes, chats and plans come from local TypeScript files (section 6). State persists in `localStorage` so a refresh keeps progress, with a "Reset demo" button in settings.
- **On-device AI is simulated.** Build a `mockAI` module with realistic latency, streaming text, and a visible "Running on this device" indicator. Do not call any external AI API. Make it easy to swap for a real on-device runtime later (clean interface, section 9).
- **Mobile-first**, designed for a 390px-wide phone, but fully usable on desktop (centered app frame up to 480px, or responsive layout on wide screens).
- **Fast and smooth.** Target 60fps animations. Respect `prefers-reduced-motion` (replace cosmic animations with a short fade).
- **No copyrighted assets.** Use original SVG/CSS/canvas art, emoji sparingly, and free fonts.

## 3. Tech stack

- **Vite + React 18 + TypeScript**
- **React Router** (routes in section 5)
- **Tailwind CSS** for styling, with the design tokens in section 4
- **Framer Motion** for UI and page transitions
- **HTML Canvas 2D** for the cosmic starfield and warp effect (custom, no heavy 3D library required; Three.js is optional only if it stays smooth on mid-range phones)
- **Zustand** for state, with `persist` middleware to `localStorage`
- **lucide-react** for icons
- **Fonts:** "Space Grotesk" (headings) and "Inter" (body), loaded locally or via Google Fonts, with system fallbacks

Setup:
```
npm create vite@latest startup-box -- --template react-ts
npm i react-router-dom framer-motion zustand lucide-react
npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init -p
```

Deployable as a static site (Vercel/Netlify). `npm run build` must succeed with no errors.

## 4. Design system (gamified + cosmic)

**Vibe:** a space-mission game. You are "launching into a box" with your crew. Dark cosmic background, glowing role colors, XP bars, badges, level-ups, satisfying motion.

**Tokens**
```
--space-0: #070A18   (app background)
--space-1: #0E1330   (cards)
--space-2: #171D45   (raised surfaces)
--line:    #2A3170
--text:    #EAF0FF
--muted:   #8E9AC7
--nebula:  #7C5CFF   (primary)
--aurora:  #28E0C2   (success / on-device indicator)
--solar:   #FFB020   (XP / rewards)
--flare:   #FF4D8D   (alerts / highlights)
--cosmic-gradient: linear-gradient(135deg,#7C5CFF 0%,#28E0C2 100%)
```
**Role colors** (used for avatars, slots, tags): PM `#7C5CFF`, Developer `#3D8BFF`, Designer `#FF4D8D`, Marketing `#FFB020`, Other `#28E0C2`.

**Component style:** rounded-2xl cards, subtle inner glow on hover/focus, 1px `--line` borders, soft neon shadows (`0 0 24px rgba(124,92,255,.35)`), large tap targets (min 44px), clear focus rings.

**Shared UI components to build:** `Button` (primary glow, ghost), `Card`, `Chip`, `Avatar` (role-colored ring), `XPBar`, `LevelBadge`, `ProgressRing`, `Toast`, `Modal`, `BottomNav`, `StarfieldBackground`, `OnDeviceBadge` (pulsing aurora dot + "Running on this device"), `SlotTile` (open/filled box slot).

**Gamification layer (visible everywhere)**
- **XP and level:** user level shown in the header (e.g., "Lv 3 Navigator"). XP gained for: finishing onboarding, joining a box, completing a task, sending a first message, finishing the sprint, giving ratings.
- **Rank titles:** Lv1 Cadet, Lv2 Pilot, Lv3 Navigator, Lv4 Commander, Lv5 Captain.
- **Badges:** First Launch, Team Player, Idea Spark, Sprint Finisher, Reliable Crew, Mentor. Unlock with a badge-pop animation and toast.
- **Streak:** daily activity streak flame on the home screen.
- **Level-up moment:** confetti-like star burst plus a short modal.

## 5. Routes and screens

| Route | Screen | Purpose |
|---|---|---|
| `/` | Splash | Logo reveal over starfield, auto-forward to `/login` (or `/home` if logged in) |
| `/login` | Login | Dummy login + "Use demo account" buttons |
| `/onboarding` | Onboarding (5 steps) | Role, skills, hours, goal, commitment level |
| `/matching` | Matching | On-device AI matching sequence |
| `/launch/:boxId` | **Cosmic entry** | Warp animation entering a box (section 8) |
| `/box/:boxId` | Box room | Team, chat, sprint, tasks, health (tabs) |
| `/home` | Home / Mission control | Current box, XP, streak, open boxes, daily AI digest |
| `/explore` | Explore boxes | Browse open boxes by type; filters; join request |
| `/sprint/:boxId/end` | Sprint end | Demo day, peer ratings, continue/re-match/leave |
| `/graduation/:boxId` | Graduation kit | Founder agreement, equity split calculator, next steps |
| `/profile` | Profile | Reputation, level, badges, sprint history, skills |
| `/settings` | Settings | Privacy (on-device) explainer, commitment level, reset demo, logout |

Bottom navigation: **Home, Explore, My Box, Profile**.

## 6. Dummy data and credentials

Create `src/data/` with typed mock files. Keep text realistic and short.

**Demo accounts (login accepts only these)**
```ts
export const DEMO_ACCOUNTS = [
  { email: "demo@startupbox.app", password: "demo123", name: "Alex Rivera", role: "Developer" },
  { email: "designer@startupbox.app", password: "demo123", name: "Priya Nair", role: "UI/UX Designer" },
];
```
Wrong credentials show a friendly error. "Use demo account" fills and submits.

**Types**
```ts
type Role = "PM" | "Developer" | "Designer" | "Marketing";
type Level = "Explorer" | "Builder" | "Founder";
interface User { id; name; avatarColor; role: Role; skills: string[]; hoursPerWeek: number;
  level: Level; reputation: number /*0-100*/; xp: number; streak: number; badges: string[]; timezone: string; bio: string }
interface Box { id; name; type: "Startup"|"Hackathon"|"Agency"|"Content"|"Research"; level: Level;
  slots: { role: Role; filledBy?: string /*userId*/ }[]; status: "Open"|"Full"|"Sprinting"|"Completed";
  sprintDay: number /*1-14*/; health: number /*0-100*/; idea?: string; tasks: Task[]; messages: Message[] }
interface Task { id; title; owner: string; dueDay: number; done: boolean }
interface Message { id; from: string | "AI"; text: string; time: string }
```

**Seed content (minimum)**
- 12 dummy users across all four roles, mixed levels, with varied skills (React, Python, Figma, SEO, Product, AI/ML, Sales, Research, Node, Flutter, Branding, Analytics).
- 8 boxes: 3 open (1-3 slots empty), 2 sprinting (Day 3 and Day 9), 1 full and starting, 2 completed (for profile history).
- The primary demo box: **"Box #214, Startup, Builder level"** with 4 of 5 slots filled so the logged-in user fills the last slot during matching.
- Pre-written chat history (8-10 messages), 6 tasks in the sprint, 3 candidate startup ideas to vote on.
- Reputation, XP and badges prefilled for existing users.

## 7. Feature specifications

### 7.1 Login (dummy)
Cosmic background, logo, email/password fields, "Use demo account" buttons, error state for wrong credentials. On success, route to `/onboarding` for first-time users or `/home` if onboarding is complete (stored flag).

### 7.2 Onboarding (5 steps, animated progress)
1. **Role:** big selectable cards (PM, Developer, Designer, Marketing).
2. **Skills:** chip multi-select with search, plus a "Paste your bio or portfolio" text area. When pasted, the on-device AI parses it and auto-selects matching skill chips (simulated, 1.5s, streaming "Reading locally…").
3. **Availability:** weekly hours slider (2-40) and timezone select.
4. **Goal:** Startup / Hackathon / Freelance agency / Learn-by-building.
5. **Commitment level:** three level cards showing price/deposit text, expectation (hours, sprint length, reply time) and who you will meet (see section 11). Selecting a level glows its card. Deposit is **display only** (no payment).

Award XP and a "First Launch" badge on completion. Show a summary card with the on-device badge: "Your profile stays on this phone."

### 7.3 On-device AI matching (`/matching`)
Fullscreen sequence, about 6-8 seconds, with:
- Pulsing `OnDeviceBadge`; a small "Model: Gemma-2B (on-device)" label; a fake meter showing "0 bytes uploaded."
- Step list that ticks in order, with streaming text: "Parsing your profile locally", "Building your skill vector", "Scanning 2,480 open slots", "Checking timezone and weekly hours", "Scoring team chemistry", "Filling the last slot in Box #214".
- A radar/orbit animation where candidate boxes circle a central avatar, then converge to the best match.
- Result card: **Box #214**, overall **fit score** (computed from the user's role/skills/hours/level, between 72 and 97), three "why you matched" bullets generated by `mockAI`, and a teammate preview. Buttons: **Launch into box** (primary) and **Re-match** (ghost; shows the second-best box).

### 7.4 Cosmic box entry (`/launch/:boxId`)
See section 8. This is the signature moment.

### 7.5 Box room (`/box/:boxId`), tabbed
Header: box name, type, level badge, sprint day (e.g., "Day 3 / 14"), **Box Health** ring (0-100, color changes).

**Tabs**
- **Crew:** member cards with role-colored avatar, name, skills tags, level, reputation, fit score. Open slots show a glowing "Invite / Waiting" `SlotTile`. Tap a member for a profile sheet.
- **Chat:** group chat with message bubbles, typing indicator, simulated replies from teammates after the user sends (1-2s, scripted by keyword or round-robin), and an **AI Icebreaker** button that posts an on-device AI message (styled differently with the aurora dot). A **Daily digest** button shows an AI summary of the day.
- **Sprint:** 14-day timeline (day dots, current day highlighted), the AI-drafted plan by phase, and a task board (To do / Doing / Done) with tap-to-move. Completing a task triggers XP and a small particle burst. Includes the **idea vote**: three candidate ideas, tap to vote, live vote bars (teammate votes are prefilled and some change with a delay).
- **Calls:** a fake "Start voice call" button that opens a call UI (participant tiles with animated speaking rings, mute/leave buttons). No real audio.

**Box Health:** computed from mock activity (messages, tasks done). If the user is inactive in the demo for 10 seconds after a toggle in settings ("Simulate inactivity"), show a nudge toast and a "Backfill open" state for an inactive member to demonstrate the auto-release feature.

### 7.6 Home / Mission control
- Greeting with rank title, **XPBar** and streak flame.
- **Current mission card:** the active box, sprint day, next task, tap to enter.
- **Daily AI digest** card (on-device badge).
- **Open boxes near your level:** horizontal scroller of 3-4 `BoxCard`s with slot tiles filled/open.
- **Quests:** 3 daily quests (e.g., "Send a message", "Complete a task", "Rate a teammate") with progress and XP.

### 7.7 Explore
Filter chips by box type and level; search; list of `BoxCard`s (name, type, level, filled/open slots, fit score for the current user, health). Tap a card to see a preview sheet and **Request to join** (simulated acceptance after 2s, then option to launch). Show a "Level locked" state for boxes above the user's level with a hint on how to earn it (ratings).

### 7.8 Sprint end and peer ratings
Accessible from the box room via a **"Fast-forward to Day 14"** demo button (important for judges). Flow:
1. **Demo day** card: team "ships" a demo (static summary).
2. **Peer ratings:** rate each teammate 1-5 on Reliability, Skill, Communication; optional comment; "Would work together again?" toggle.
3. **Results:** reputation change animation, XP, "Sprint Finisher" badge.
4. **Decision:** Continue as a team / Re-match / Leave. Continue goes to the graduation kit.

### 7.9 Graduation kit
- **Founder agreement template** (read-only preview with fillable demo fields: company name, roles).
- **Equity split calculator:** sliders per member, total locked to 100%, with a suggestion bar generated by `mockAI` ("Based on roles and hours").
- **Vesting** selector (4-year, 1-year cliff) shown as a simple timeline.
- **Next steps** checklist (incorporate, open bank account, set up repo). Disclaimer: "Templates are informational, not legal advice."

### 7.10 Profile
Avatar, name, role, level title, **reputation score ring**, badges grid (locked/unlocked), sprint history list, skills, and a **Skill vector** visual (small radar chart) with the label "Stored only on this device."

### 7.11 Settings
Privacy explainer ("what stays on your device"), commitment level switch, notification toggles (visual only), **Simulate inactivity**, **Reset demo data**, logout.

## 8. Cosmic entry animation (signature)

Triggered at `/launch/:boxId` after the user taps **Launch into box**. Duration about 5 seconds, skippable via a small "Skip" button after 1s. Build with a full-screen `<canvas>` plus Framer Motion overlays.

**Sequence**
1. **0.0-0.8s, Ignition:** screen dims, starfield drifting. Text: "Launching into Box #214".
2. **0.8-2.2s, Warp:** stars stretch into streaks radiating from the center, speed ramps up (hyperspace). Subtle screen shake and rising whoosh visuals (no audio required; optional short sound behind a mute toggle, off by default).
3. **2.2-3.6s, Crew assembly:** four teammate avatars (role-colored rings) fly in along curved paths from the screen edges and orbit a glowing central "box" (a rotating cube or rounded square with the cosmic gradient). Each avatar lands in its slot with a small pulse and name label.
4. **3.6-4.4s, Your arrival:** the user's avatar enters last; the fifth slot ignites, the cube flashes, a shockwave ring expands, and text appears: "Crew complete".
5. **4.4-5.0s, Dock:** the cube zooms toward the camera and dissolves into the box room (route to `/box/:boxId` with a shared fade). Award XP and the "Team Player" badge toast on arrival.

**Technical notes**
- Starfield: 300-600 particles on mobile (scale by `devicePixelRatio` and screen size), `requestAnimationFrame`, particles with `x, y, z`; project to screen and draw a line from the previous to the current position for warp streaks. Pause on `visibilitychange`.
- Share the same `StarfieldBackground` component (slow drift, parallax) across the app at low opacity.
- `prefers-reduced-motion`: skip the warp, show a 0.8s fade with "Crew complete" and a static orbit.
- Clean up the canvas loop and listeners on unmount.

**Other motion moments:** page transitions (slide/fade), slot fill pulse in boxes, XP number count-up, badge unlock pop, level-up star burst, chat message spring-in, button press scale.

## 9. Mock AI module (`src/ai/mockAI.ts`)

Define an interface so a real on-device model can replace it later:
```ts
interface OnDeviceAI {
  parseProfile(text: string): Promise<{ skills: string[]; level: Level }>;
  scoreFit(user: User, box: Box): Promise<{ score: number; reasons: string[] }>;
  draftSprintPlan(box: Box): Promise<{ day: string; items: string[] }[]>;
  icebreaker(box: Box): AsyncIterable<string>;
  dailyDigest(box: Box): AsyncIterable<string>;
  suggestEquity(members: User[]): Promise<Record<string, number>>;
}
```
Implementation: deterministic logic plus canned templates, with `setTimeout` latency (400-1500ms) and **token-by-token streaming** (a few characters every ~25ms) so text looks generated. `scoreFit` uses role match, overlapping skills, hours and level difference, clamped to 72-97 for the demo. Show `OnDeviceBadge` wherever the AI is used.

## 10. State management

Zustand store `useApp` with slices: `auth` (user, loggedIn), `profile` (onboarding answers, xp, level, streak, badges), `boxes` (all boxes, currentBoxId), `chat`, `tasks`, `votes`, `quests`, `settings`. Persist to `localStorage` under `startupbox-demo`. Provide `resetDemo()`. Derive level from XP thresholds: 0 / 100 / 250 / 500 / 900.

## 11. Commitment levels (display content)

| Level | Entry | Expectation | You meet |
|---|---|---|---|
| Explorer | Free | 2-5 hrs/week, casual | Learners and first-timers |
| Builder | Refundable deposit (display "Rs 499, refunded on sprint completion") | 10+ hrs/week, 2-week sprint, replies within 24h | Committed side-project founders |
| Founder | Higher refundable deposit (display "Rs 999, refunded on sprint completion") | 20+ hrs/week, 4-week sprint, weekly check-ins | People ready to incorporate |

Show the line: "Deposits are returned when you finish the sprint, so levels reflect what people do." Levels above the user's reputation can show a "Earn this level" hint. No real payment UI beyond a mock confirmation sheet.

## 12. Folder structure

```
src/
  main.tsx, App.tsx, routes.tsx
  styles/ (tailwind.css, tokens)
  data/ (users.ts, boxes.ts, accounts.ts, ideas.ts, plans.ts)
  store/ (useApp.ts)
  ai/ (mockAI.ts, stream.ts)
  components/ (ui/*, StarfieldBackground.tsx, OnDeviceBadge.tsx, SlotTile.tsx, BoxCard.tsx, XPBar.tsx, BadgePop.tsx, ...)
  screens/ (Splash, Login, Onboarding, Matching, Launch, BoxRoom, Home, Explore, SprintEnd, Graduation, Profile, Settings)
  hooks/ (useReducedMotion, useCountUp)
```

## 13. Quality rules

- TypeScript strict, no `any` unless justified.
- Accessible: semantic buttons, labels, focus states, alt text, color contrast on dark backgrounds, keyboard navigation on desktop.
- No layout shift; all lists keyed; animations cleaned up on unmount.
- Keep components small; mock data separate from UI.
- Copy is short, friendly, and consistent with the tagline and "Running on this device" language.
- Include a small footer note in settings: "Prototype with demo data."

## 14. Build order (do these in sequence; make the app runnable after each step)

1. Project setup, Tailwind tokens, fonts, `StarfieldBackground`, base UI components.
2. Mock data files, types, Zustand store with persistence.
3. Splash, Login (dummy auth), route guards.
4. Onboarding (5 steps) with `mockAI.parseProfile` and level cards.
5. Matching screen with streaming steps, fit score and result card.
6. **Cosmic entry animation** (canvas warp + crew assembly + dock).
7. Box room: Crew, Chat (with AI icebreaker and digest), Sprint (timeline, tasks, idea vote), Calls UI, Box Health.
8. Home (mission control, quests, XP, streak) and Explore (filters, join request).
9. XP, levels, badges, level-up and badge animations wired to actions.
10. Sprint end (fast-forward), peer ratings, results, decision; Graduation kit.
11. Profile and Settings (simulate inactivity, reset demo).
12. Polish: transitions, reduced-motion paths, empty/error states, performance pass, responsive desktop frame.
13. Write `README.md` with run instructions, demo credentials and a 60-second demo script.

## 15. Acceptance criteria (the prototype is done when all are true)

- Logging in with `demo@startupbox.app` / `demo123` works; wrong credentials show an error; "Use demo account" works.
- A new user can complete onboarding, see the on-device matching sequence, and **launch into Box #214 with the full cosmic animation**.
- The box room has working **Crew, Chat (with AI icebreaker and digest), Sprint (timeline, tasks, idea vote), Calls** tabs and a live Box Health ring.
- Completing actions awards XP; level-ups and badges animate; streak and daily quests are visible on Home.
- Explore lists boxes with filters and a simulated join request; locked-level boxes show how to unlock them.
- "Fast-forward to Day 14" leads to peer ratings, reputation change, and the continue/re-match/leave decision; Continue opens the graduation kit with a working equity split calculator.
- Profile shows reputation, badges, history and the on-device skill vector; Settings has Reset demo and Simulate inactivity.
- The "Running on this device" badge appears on every AI feature, and no network request is made for AI or data.
- The app is smooth on a mid-range phone, respects reduced motion, and `npm run build` passes.
- Looks like one cohesive gamified cosmic product on both 390px mobile and desktop.

## 16. 60-second demo path (the app must support this flow cleanly)

1. Login with "Use demo account."
2. Onboarding: Developer, pick skills, 12 hrs/week, Startup goal, Builder level.
3. Matching: show the on-device steps and the fit score.
4. **Launch into box:** cosmic warp and crew assembly.
5. Box room: show the crew, send a chat message, tap the AI icebreaker, tick a task (XP burst), vote on an idea.
6. Tap "Fast-forward to Day 14," rate teammates, see the reputation jump, tap Continue, show the equity calculator.
7. Open Profile to show badges and the "stored only on this device" skill vector.
