# Roadmap (design-first, progressive)

This roadmap scopes minimal, low-debt milestones. Each milestone is shippable and keeps future options open.

## Phase 0 — Shell polish (0.5–1d)
- Responsive sidebar/drawer, keyboard nav, focus ring
- Page-level tabs and breadcrumbs
- Loading states and empty placeholders

## Phase 1 — Auth + org surface (0.5–1.5d)
- Protected routes via middleware
- User menu: org switcher (reads `organization_members`), selection stored in signed cookie
- Redirect unauthenticated → `/login`

## Phase 2 — Dataset UX (front-end only) (0.5–1d)
- New dataset wizard (done) + success toast and detail page mock
- Dataset detail page: preview table, example chart, metadata chips
- URL state for wizard steps (no DB yet)

## Phase 3 — Schema v1 (1–2d)
- Tables: `datasets`, `series`, `readings` (already exist in Supabase)
- Ingestion: CSV upload route (server), validate, upsert
- Granularity: normalize times with `timestamp timestamptz` + `granularity enum` (second, minute, hour, day, week)
- RLS: org isolation; policies use `(select auth.uid())`

## Phase 4 — SPC charts (1–2d)
- Rule engine (Western Electric 1–4) in TS
- Annotation overlay; drill-in drawer
- Save chart config per dataset/series

## Phase 5 — Display endpoints (0.5–1d)
- Public display tokens; server-rendered read-only pages optimized for TVs
- Auto-rotate views; simple remote refresh

## Phase 6 — Managed connectors (later)
- Admin-only flows; background jobs (Supabase cron or external worker)
- Source-specific schemas behind a uniform ingestion interface

References
- RFC-0001: Data ingestion & datasets
- RFC-0002: Time-series granularity
- RFC-0003: Display endpoints (TV mode)
