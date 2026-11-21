# Kingshot Tools

Fan-made tools for the game Kingshot: an event calendar and calculators for rally timing, troop training, Truegold building upgrades and replenishment time.

Built with [Astro](https://astro.build), React and [Chakra UI](https://chakra-ui.com).

## Pages

| Path | What it does |
| --- | --- |
| `/calendar` | Event calendar for the 28-day cycle |
| `/calculators/rally-time` | Rally timer: start times per leader for a shared hit time (UTC) |
| `/calculators/troop` | Troop training and promotion time, cost and points |
| `/calculators/truegold` | Truegold building upgrade time and cost |
| `/calculators/replenishment-time` | Replenishment time |

## Getting started

Use the Node version in `.nvmrc`. Astro will not run on older versions.

```sh
nvm use
npm install
npm run dev
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm start` | Start the dev server on your network (`--host`) |
| `npm run build` | Build the site into `dist/` |
| `npm run preview` | Serve the built site |
| `npm run lint` | Run ESLint |
| `npm run check` | Type check (`astro check` and `tsc`) |
| `npm test` | Run tests with Vitest (`npm run test:watch` to watch) |
| `npm run format` | Format `src/` with Prettier |

## Project layout

```text
src/
  pages/        Astro routes
  layouts/      Page layouts
  components/   React components (PageComponents/ holds one folder per page)
  data/         Game data: buildings, troops, events
  lib/          Shared helpers (time, localStorage, form params, hooks)
  types/        Shared TypeScript types
```

Tests live next to the code as `*.test.ts`.

## Deployment

Every push or merge into `main` deploys to production on Cloudflare automatically.

Before you push to `main`, make sure these pass:

```sh
npm run lint && npm run check && npm test && npm run build
```

Use a branch and a pull request for work that is not ready to ship.
