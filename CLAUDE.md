# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

mm2-blog — Astro 6 (beta) personal blog deployed to Cloudflare Workers. Automated workflow retrieves Notion drafts, processes with Gemini AI, publishes as Markdown. Site: blog.milkmaccya.com

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (localhost:4321) |
| `npm run build` | Production build + Pagefind indexing |
| `npm run preview` | Preview built site |
| `npm run lint` | Biome check (style & correctness) |
| `npm run lint:fix` | Auto-fix Biome issues |
| `npm test` | Playwright E2E tests |
| `npm run test:ui` | Playwright with UI |

Playwright runs with 1 worker and 2 retries in CI. Single test: `npx playwright test tests/e2e.spec.ts`.

## Tech Stack

Astro 6, TypeScript (strict), Tailwind CSS 4, GSAP (animations), Satori (OGP images), Pagefind (search), Biome (lint/format), Playwright (E2E), Sentry (error tracking), Cloudflare Workers (deploy)

## Code Style (Biome)

- 2-space indent, 100 char line width, LF line endings
- Single quotes, semicolons always, ES5 trailing commas
- `noUnusedVariables` and `noUnusedImports` are OFF
- Pre-commit hook via Lefthook runs `npm run lint`

## Architecture

**Content**: Markdown blog posts in `src/content/blog/weekly/YYYY-MM-DD.md`. Uses Astro Content Collections with Zod schema. Frontmatter: title, description, pubDate, updatedDate, heroImage.

**Pages**: `src/pages/` — index, about, projects, blog (with pagination via `[page].astro` and dynamic routes via `[...slug].astro`), RSS feed (`rss.xml.js`), dynamic OGP images (`og/[...slug].png.ts`).

**Layouts**: `BaseLayout.astro` (header/footer wrapper) → `BlogPost.astro` (extends Base for posts).

**Components**: `BaseHead.astro` (meta/OG/structured data), `Header.astro` (nav + theme toggle), `Search.astro` (Pagefind modal), `ThemeToggle.astro` (dark mode).

**Animations** (`src/scripts/animations.ts`): GSAP + ScrollTrigger for scroll-triggered effects. Respects `prefers-reduced-motion`. Integrates with Astro View Transitions via `astro:page-load` and `astro:before-swap` events.

**Theme**: Light/dark via `.dark` class on `<html>`, CSS custom properties (`--color-bg`, `--color-text`).

**OGP**: Dynamic image generation at `/og/[...slug].png` via Satori (React → SVG → PNG, 1200x630). Fetches Google Fonts at build time.

**Search**: Pagefind with deferred CSS/JS loading until search dialog opens.

## Path Alias

`@/*` maps to `src/*` (configured in tsconfig.json).

## Tailwind

Japanese font family default (system-ui, Hiragino, Yu Gothic, Meiryo). Custom letter-spacing. Max container 960px. `@tailwindcss/typography` for prose styling.

## Performance Targets (Lighthouse CI)

Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90. Weekly automated audits create GitHub issues on failure.

## Environment Variables

`PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` — required for Sentry integration.

## Testing

Playwright E2E smoke tests in `tests/e2e.spec.ts`. Tests all 5 routes (/, /blog, /blog/[slug], /about, /projects). Uses `verifyLayout()` helper to validate nav, main, footer presence.

## Git Branching

Always create topic branches from `main` (e.g., `feature/xxx`, `fix/xxx`, `perf/xxx`). Never commit directly to `main` without explicit instruction.
