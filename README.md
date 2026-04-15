# url-shortener

**Shorten URLs. Track clicks. Own your data.**

![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-embedded-003b57?style=flat-square&logo=sqlite)
![Tailwind v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)
![App Router](https://img.shields.io/badge/App_Router-enabled-000?style=flat-square)

![ Demo](.github/demo.gif)

A fully self-hosted, zero-configuration URL shortener with built-in click analytics. Paste a long URL, get a clean short link, and track every click — no external services, no sign-up, no cloud.

---

## Features

- **Short links** — 6-character nanoid codes, collision-safe
- **Click tracking** — every redirect increments a click counter
- **Analytics dashboard** — stats cards + full sortable link table
- **Copy to clipboard** — one-click copy with visual "Copied!" feedback
- **Delete links** — remove any short link from the dashboard
- **Self-hosted** — all data lives in a local SQLite file (`data/data.db`)
- **Zero setup** — no database server, no env vars, no Docker

---

## Quick Start

```bash
git clone https://github.com/mariotavarez/url-shortener.git
cd url-shortener
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — that's it. No external services needed.

---

## How It Works

1. **Shorten** — Enter a URL on the home page. A Server Action validates it, generates a 6-char code via `nanoid`, and persists the mapping in SQLite.
2. **Redirect** — Visiting `/:code` triggers a Next.js Route Handler (`app/[code]/route.ts`) that looks up the code, increments the click counter, and issues a `302` redirect to the original URL.
3. **Track** — Every click is stored in the `clicks` column. The dashboard reads live data from the same SQLite database.
4. **Analyze** — `/dashboard` shows aggregate stats (total links, total clicks, links created today) plus a sortable table of every link.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Server Actions) |
| Language | TypeScript 5.7 (strict) |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss` |
| Database | SQLite via `better-sqlite3` (embedded, file-based) |
| ID generation | `nanoid` v5 (6-char URL-safe codes) |
| Icons | `lucide-react` |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — dark theme, navbar
│   ├── page.tsx                # Home: hero + shorten form + recent links
│   ├── [code]/route.ts         # Redirect handler + click tracking
│   └── dashboard/page.tsx      # Analytics dashboard
├── components/
│   ├── ShortenForm.tsx         # Client form with optimistic UI
│   ├── LinkCard.tsx            # Single link row with copy button
│   ├── StatsCard.tsx           # KPI card component
│   ├── LinksTable.tsx          # Sortable full links table
│   └── CopyButton.tsx          # Clipboard button with feedback
└── lib/
    ├── db.ts                   # SQLite singleton + typed queries
    ├── actions.ts              # Server Actions (shorten, delete, stats)
    └── utils.ts                # Helpers: generateCode, formatDate, etc.
```

---

## License

MIT © Mario Tavarez
