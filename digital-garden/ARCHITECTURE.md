# Digital Garden / Charts UI — Project Philosophy & Architecture

This doc defines how we build and maintain this Next.js + Supabase multi-tenant app. It’s written to be actionable for future contributors, emphasizing production-grade defaults, readability, and a relaxing developer experience.

## Principles

- Clarity first: readable code, clear names, minimal magic.
- Strong UX defaults: consistent contrast, spacing, motion, and resilience.
- Server-forward: prefer server components and SSR for data access; keep client components UI-only.
- Multi-tenant safe: enforce isolation via Postgres RLS; never trust client org IDs.
- Small, composable units: page shells, primitives, and focused helpers.
- Ship continuously: every change should build, lint cleanly, and be demoable.

## Stack

- Framework: Next.js 15 (App Router, Route Handlers) with Turbopack
- Styling: Tailwind v4 with CSS tokens in `src/app/globals.css`
- Icons/utilities: `lucide-react`, `clsx`, `tailwind-merge`
- Charts: Chart.js via `react-chartjs-2`
- Auth/DB: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)

## Directory layout

- `src/app/` App Router pages and route handlers
  - `(shell)/` shared UI and shell-level components
    - `shell.tsx` primitives: `Card`, `Toolbar`, `Chip`, `cn`
    - `ThemeToggle.tsx`, `UserMenu.tsx`
  - `login/` sign-in page (client)
  - `auth/signout/route.ts` POST-only sign-out
  - `spc/`, `datasets/`, `data/`, `alerts/`, `team/`, `billing/`, `settings/`, `help/`
- `src/lib/`
  - `supabase/server.ts` server client factory (SSR + cookies)
  - `supabase/client.ts` browser client factory
- `public/` static assets

## Theming & accessibility

- Tokens: defined via CSS variables in `globals.css` for background, foreground, surface, borders, muted text.
- Theme switching: `data-theme="light|dark"` on `html` with `ThemeToggle` component; persists in `localStorage`.
- Accessibility: target WCAG AA for text and UI controls; use tokens instead of raw colors.

## Auth & multi-tenancy

- Auth: Supabase; cookies managed via `@supabase/ssr` in `src/lib/supabase/server.ts`.
- Logged-in UI: `UserMenu` server component renders Sign in / Sign out and current user email.
- Multi-tenant model (in Supabase): `organizations`, `organization_members`, `datasets`, `series`, `readings`, `charts`, `profiles`, `invites`.
- Isolation: Strict Postgres RLS policies; API must not accept org IDs from the client; use auth context on the server.
- Planned: org switcher component storing selection in a signed cookie and validated server-side.

## Routing & protection

- Public routes: `/`, `/login`, `/help`, marketing pages.
- Protected routes (planned): guard with middleware (`src/middleware.ts`) and/or layout-level server checks; redirect unauthenticated users to `/login`.
- Route handlers (server actions): prefer `app/*/route.ts` for mutations; avoid client-side secrets.

## Data fetching & caching

- Prefer server components fetching directly from Supabase; pass primitive props into client components.
- Set `revalidate` consciously: real-time pages use `revalidate: 0` (no cache), static pages default to SSG.
- For complex flows, create server helpers under `src/lib/**` and keep pages thin.

## Charts

- Use Chart.js via `react-chartjs-2` for quick iteration and good performance.
- SPC features backlog: Western Electric rules, annotations, point drill-in, brush/zoom, multiple metrics.

## Environment & secrets

- Local dev: `.env.local` (git-ignored). Client-exposed keys must be prefixed `NEXT_PUBLIC_`.
- Required:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Never commit service role keys or non-public secrets.

## Linting, types, quality

- ESLint (Next.js config) + TypeScript strict. No `any` in app code.
- Fix lints before merging. Prefer explicit types for public APIs.
- Consider adding Vitest/Playwright later for logic/UI tests.

## Deployment

- VM path: Docker + Nginx recommended (Next.js standalone server build) or static export for purely-static pages.
- Coexistence with FastAPI: serve Next.js via Nginx; keep FastAPI on its own upstream; share the Supabase backend.

## Observability

- Add server-side logging for route handlers; track auth/redirects.
- Consider Sentry or OpenTelemetry for errors/trace later.

## Roadmap (short)

1) Responsive sidebar + mobile drawer; sticky filters
2) Protected routes + org switcher
3) SPC rules & annotations
4) Invite flow (generate/accept)
5) Docker/Nginx deploy assets

## Code style quick rules

- Names explain intent (no abbreviations). Components small and focused.
- Early returns over deep nesting. Handle edge cases first.
- No inline comments for obvious code. Document “why”, not “how”.
- Match existing formatting; keep diffs minimal.


