# Fuuty — World Cup 2026

A simple mobile-friendly site for following FIFA World Cup 2026 matches and standings. Built for easy reading on a phone with large text, clear layout, and minimal color.

## Features

- **Matches** — day-by-day schedule with a small venue map, live scores, and match details
- **Standings** — group tables (A–L) and knockout bracket
- **No backend** — fetches public data directly in the browser
- **Accessible** — large tap targets, high contrast, readable typography

## Data sources

Primary: [worldcup26.ir](https://worldcup26.ir) (matches, standings, teams, stadiums)

Fallback: [TheStatsAPI fixtures](https://www.thestatsapi.com/world-cup/data/fixtures.json) (schedule only)

## Local development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to Netlify

### Option A: Git-based deploy

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In Netlify, choose **Add new site → Import an existing project**.
3. Select the repo.
4. Netlify will read [`netlify.toml`](netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy.

### Option B: Manual deploy

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

SPA routing is handled by redirects in `netlify.toml` and `public/_redirects`.

## Tech stack

- Vite + React + TypeScript
- React Router
- TanStack Query
- react-leaflet
- date-fns / date-fns-tz
