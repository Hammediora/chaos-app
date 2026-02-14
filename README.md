# ChaosHub — Retro Chaos Playground

A retro meme culture × old money chaos playground. Generate jokes, excuses, roasts, memes, and facts — all in one curated experience.

## Quick Start

```bash
# Install dependencies
npm install

# Create env file (optional — app works without it)
cp .env.example .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/daily`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `IMGFLIP_USERNAME` | No | Imgflip account username for server-side meme generation |
| `IMGFLIP_PASSWORD` | No | Imgflip account password |

Without Imgflip credentials, the Meme Lab uses client-side canvas rendering (preview mode).

## API Integrations

| Endpoint | Upstream API | Rate Limits |
|----------|-------------|-------------|
| `/api/jokes/chucknorris` | api.chucknorris.io | None documented |
| `/api/jokes/yomomma` | yomama-jokes.com | Fallback if down |
| `/api/excuse` | excuser-three.vercel.app | None documented |
| `/api/buzz` | corporatebs-generator.samerat.com | Fallback if down |
| `/api/techy` | techy-api.vercel.app | Fallback if down |
| `/api/facts` | uselessfacts.jsph.pl | None documented |
| `/api/memes/templates` | api.imgflip.com | Cached 1hr |
| `/api/memes/create` | api.imgflip.com | Requires credentials |

All external APIs are called server-side via Next.js Route Handlers to avoid CORS issues.
Each handler has error handling with fallback content where applicable.

## App Sections

- **/daily** — Daily Chaos (landing). 4 cards + streak tracking + daily challenge
- **/excuses** — Excuse Generator. Situation picker, tone slider, corporate polish
- **/roast** — Roast Zone. Target name, intensity selector
- **/memes** — Meme Lab. Template grid, text overlay, canvas preview + export
- **/facts** — Fact or Cap. True/Cap guessing game with streak tracking
- **/vault** — Favorites. Saved items with filters, copy, delete

## Data Persistence

Currently uses `localStorage` for:
- Favorites / saved items
- Streak tracking (daily visits, daily challenge)
- Fact game stats
- Daily content cache

A Prisma schema is scaffolded at `prisma/schema.prisma` for future PostgreSQL sync.

## Deployment

### Docker

```bash
docker build -t chaoshub .
docker run -p 3000:3000 chaoshub
```

### Docker Compose

```bash
docker-compose up -d
```

This starts the app on port 3000, with an optional PostgreSQL container for future DB sync.

### Manual

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **TailwindCSS v4**
- **Framer Motion** — animations
- **html-to-image** — card export
- **Prisma** — DB scaffold (optional)

## Design

- **Typography**: Playfair Display (headings) + Inter (body)
- **Palette**: Deep espresso/charcoal backgrounds, brass/gold accents, vintage green + burgundy secondary
- **Texture**: SVG noise overlay for retro grain feel
- **Animations**: Page transitions, card reveals, button micro-interactions via Framer Motion
