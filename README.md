# Bounty Hunter — Treasure Hunt (React + Express + MongoDB)

This is a React (Vite) port of the original single-file HTML prototype. Every
screen, animation, and game rule from the demo has been carried over —
squad registration, avatar picking, clue scanning, bonus bounties, the
admin dashboard, and the live leaderboard — split into components and
wired through a shared `GameContext`, backed by a real Express + MongoDB
API in `server/` so every device stays in sync.

## Quick start

1. **Start MongoDB.** Point it at a local instance or an Atlas connection
   string.

2. **Configure and start the backend:**

   ```bash
   cd server
   npm install
   cp .env.example .env   # edit MONGO_URI / ADMIN_PASS if needed
   npm run dev             # http://localhost:5000
   ```

3. **Configure and start the frontend** (from the project root):

   ```bash
   npm install
   npm run dev              # http://localhost:5173
   ```

   Vite proxies `/api/*` to `http://localhost:5000` in dev (see
   `vite.config.js`), so the client never needs to know the backend's URL.

   Or run both at once from the project root:

   ```bash
   npm run dev:all
   ```

```bash
npm run build      # production build -> dist/
npm run preview    # preview the production build locally
```

For a production deploy, either serve the built `dist/` folder from the
Express app (add `express.static`) so client and API share an origin, or
set `CLIENT_ORIGIN` in `server/.env` to your frontend's deployed URL so
CORS allows it.

## Admin access

Go to **Admin Login** and use the password `treasure2026` — configurable
via `ADMIN_PASS` in `server/.env` (checked server-side in
`server/src/routes/admin.js`; `src/data/constants.js` on the client no
longer gates access).

## Project layout

```
server/                        # Express + MongoDB API
  src/
    index.js                    # app entry: middleware, routes, DB connect
    config/db.js                # mongoose connection
    models/
      Group.js                  # squads: name, avatar, score, stageIndex, passed, solvedBonuses
      AvatarClue.js              # per-avatar clue stage templates
      Bonus.js                   # bonus bounties
      GameState.js                # singleton { ended, endedAt }
    routes/
      groups.js                  # register / list / pass-clue / remove / scan / bonus-scan
      avatarClues.js              # add / delete clue stages
      bonuses.js                  # push / toggle / delete bonuses
      gameState.js                 # end / reopen the game
      admin.js                      # password check
    middleware/errorHandler.js
  .env.example
  package.json

src/
  assets/
    logo.png                 # your "BOUNTY HUNTER" wordmark
    avatars/*.png            # 20 avatars, auto-cropped from the character sheet you sent
  data/
    avatars.js               # avatar order, name suggestions, image imports
    constants.js              # MAX_GROUPS, SCAN_POINTS (client-side display only)
  services/
    storage.js                # ALL persistence goes through here — now a thin fetch() client for /api
  utils/
    confetti.js                # small imperative confetti effect for game-end celebrations
  context/
    GameContext.jsx             # single source of truth: game state + every mutator (all async now)
  components/
    TopBar.jsx
    common/LeaderboardList.jsx   # shared by the player leaderboard + admin board tab
    modals/                      # Confirm / Bonus / GameEnd popups
    screens/
      Home.jsx
      AdminLogin.jsx
      Register.jsx
      Clue.jsx + BonusSection.jsx
      Leaderboard.jsx
      AdminDashboard/
        index.jsx    # tab shell
        AvatarsTab.jsx
        GroupsTab.jsx
        BonusTab.jsx
        BoardTab.jsx
  App.jsx      # screen router (home / admin-login / admin / register / clue / leaderboard)
  main.jsx     # ReactDOM entry point
  index.css    # global styles, ported 1:1 from the original stylesheet
```

Navigation is a simple in-memory "current screen" state (matching the
original `show('screen-x')` pattern) rather than URL routes, since the
original app never used real routes either. If you'd like real URLs
(e.g. `/admin`, `/register`) so people can bookmark or refresh into a
screen, swapping in `react-router` is a small, isolated change — it would
only touch `App.jsx` and the `goTo`/`screen` bits of `GameContext.jsx`.

## How the client talks to the API

Every read/write in the app still funnels through `src/services/storage.js` —
components and `GameContext` never touch `fetch` directly. That file now
calls the Express endpoints below instead of `localStorage`. Two things
stayed local on purpose, since they're inherently per-device and were never
meant to sync: which squad this browser is registered as
(`sessionStorage`), and which bonus/game-end popups this browser has
already dismissed.

| Resource               | Verb & path                          | Notes                                    |
|------------------------|---------------------------------------|-------------------------------------------|
| Groups (squads)        | `GET/POST /api/groups`                | list / register a squad                   |
|                        | `PATCH /api/groups/:id/pass`          | admin: advance a squad's stage             |
|                        | `DELETE /api/groups/:id`              | admin: remove a squad                      |
|                        | `POST /api/groups/:id/scan`           | player: submit a clue-stage scan           |
|                        | `POST /api/groups/:id/bonus-scan`     | player: submit a bonus scan                |
| Avatar clue templates  | `GET /api/avatar-clues`               | map of `{ avatar: [{ clue, answer }] }`   |
|                        | `POST /api/avatar-clues/:avatar`      | add a clue stage                           |
|                        | `DELETE /api/avatar-clues/:avatar/:i` | delete a clue stage                        |
| Bonus bounties         | `GET/POST /api/bonuses`               | list / create a bonus                      |
|                        | `PATCH /api/bonuses/:id/toggle`       | activate/deactivate                        |
|                        | `DELETE /api/bonuses/:id`             | delete                                     |
| Game state             | `GET /api/game-state`                 | `{ ended, endedAt }`                       |
|                        | `POST /api/game-state/end`            | end the game                               |
|                        | `POST /api/game-state/reopen`         | reopen it                                  |
| Admin                  | `POST /api/admin/login`               | `{ password }` → `{ ok }`                  |

**Live sync.** The frontend still polls every 1.5s (the `useEffect` polling
loop in `GameContext.jsx`), but now each tick hits the real API instead of
reading local storage. Swapping this for WebSockets/Socket.io later is an
isolated change — only that one effect would need to move to
event-driven updates instead of polling.

**Race safety.** Scan submissions (`/groups/:id/scan`,
`/groups/:id/bonus-scan`) use an optimistic `findOneAndUpdate` guard so two
near-simultaneous scans for the same squad can't double-award points.

## Avatars

The 20 avatar images in `src/assets/avatars/` were auto-cropped from the
character sheet you uploaded, in the same order used by the game
(`AVATAR_ORDER` in `src/data/avatars.js`). Swap any file in that folder
(keeping the same filename) to change a character's art without touching
any code.
