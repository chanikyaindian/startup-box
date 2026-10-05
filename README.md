# Startup Box

Startup Box is a frontend-only prototype for a community app that uses simulated on-device AI to match serious builders into role-complete startup teams. The UI is art-directed as a full-screen “flight studio”: an editorial control desk for finding people, making a small bet, and seeing if the work has momentum.

## Run locally

```bash
npm install
npm run dev
```

Create a production bundle with:

```bash
npm run build
```

There is no backend, authentication service, database, or external AI request. Demo state is persisted in `localStorage` under `startupbox-demo`.

## Demo accounts

| Email | Password | Role |
| --- | --- | --- |
| `demo@startupbox.app` | `demo123` | Developer |
| `designer@startupbox.app` | `demo123` | Designer |

## 60-second judge path

1. Open the app and select **Use demo account** for Alex Rivera.
2. Complete onboarding with Developer, React/Node, 12 hours, Startup, and Builder.
3. Let the local matching sequence finish, then choose **Launch into box**.
4. Watch the cosmic crew assembly, then open **Chat** to send a message and try **AI icebreaker**.
5. Open **Sprint** to complete a task and vote on an idea.
6. Return to **Crew** and choose **Fast-forward to Day 14**.
7. Rate teammates, submit, choose **Continue as a team**, and show the equity calculator.
8. Use the bottom navigation to show **Profile** and the device-only skill vector.

## Visual system

- Full-screen desktop workspace with a persistent flight-deck sidebar and responsive mobile navigation.
- Original SVG orbit sculptures and canvas starfields — no stock or copyrighted artwork.
- Editorial green / ink / paper palette, role-color passports, tactile cards, stamps, progress marks, and large-format mission typography.
- Reduced-motion support for the starfield, launch sequence, and page transitions.
- Keyboard-friendly tabs, modal focus trap, Escape-to-close dialogs, accessible labels, and persistent local state.

## Product notes

- `src/ai/mockAI.ts` exposes an `OnDeviceAI` interface with latency and streamed text, making a future local model runtime replaceable.
- `src/store/useApp.ts` owns the persisted demo state, XP, levels, badges, tasks, votes, chat, and reset control.
- All seed users, boxes, messages, tasks, and ideas live in `src/data/`.
- `src/components.tsx` contains the shared flight-deck shell, original orbit artwork, responsive sidebar/mobile nav, modal focus management, avatars, cards, and progress primitives.
- `src/screens/Studio.tsx`, `src/screens/CrewRoom.tsx`, `src/screens/Journey.tsx`, `src/screens/Launch.tsx`, and `src/screens/Finish.tsx` provide the art-directed versions of the complete demo route flow.
- The launch route uses a custom canvas warp and reduced-motion fallback, while all AI features retain the visible “Running on this device” treatment.
