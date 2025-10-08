# Requirements — SPC Platform (Digital Garden / Charts UI)

This document defines product requirements for a world‑class Statistical Process Control (SPC) platform built with Next.js and Supabase. It guides design‑first development using API stubs before database integration to minimize churn and technical debt.

Related docs: `ARCHITECTURE.md`, `ROADMAP.md`, `docs/DEV_FLOW_STUB_TO_DB.md`, `docs/RFCs/*`.

## 1. Vision and Goals
- Deliver a calm, accessible SPC tool that non‑technical teams can use in minutes.
- Make it simple to get data in, visualize stability, detect special‑cause variation, and capture root causes.
- Provide TV‑friendly displays for shop floors and offices.
- Favor progressive enhancement: ship useful value early and deepen capability over time.

### Success criteria
- A non‑technical user can: upload CSV → see control chart → receive alert → complete 6‑factor analysis → show a TV dashboard.
- Swapping stubs to Supabase requires no frontend changes (stable contracts, Zod‑validated models).
- AA contrast, mobile‑friendly, and natively keyboard accessible.

## 2. Personas and Roles
- Ops Manager: cross‑area visibility, dashboards, TV endpoints.
- Line Supervisor: logs readings (future), reviews alerts, submits fishbone analyses.
- CI/Analyst: configures limits/rules, exports, deeper SPC.
- Exec: KPI dashboards, email digests.
- Admin/Installer: org management, invites, managed connectors, TV tokens.

## 3. Scope
### In scope (MVP+)
- Auth, multi‑tenant orgs, RLS‑safe data access (Supabase).
- Datasets/Series/Readings with explicit granularity (second/minute/hour/day/week).
- CSV wizard (mapping, preview, validation), dataset detail view, basic chart.
- Charts: Individuals & Moving Range first; limits from calc or fixed.
- Rules: Western Electric (1–2 initially), alerts list + detail with 6 factors of production and “Output” observations.
- Dashboards and tokenized TV display pages with rotation.
- Reports: weekly digest email (later milestone) and printable alert reports.

### Out of scope (initially)
- Real‑time edge ingestion, camera/button hardware integrations (future RFCs).
- Complex connector marketplace (admin‑managed only later).

## 4. Domain Glossary
- Dataset: logical group (e.g., Welding Area). Contains Series.
- Series: metric (e.g., Items Count). Has granularity and readings.
- Reading: { timestamp, value, organization_id }.
- Chart: saved visualization config (type, limits, rules) bound to series/ratio.
- Alert: rule breach on a chart/series; has severity and status.
- Analysis: fishbone for an alert using the 6 factors of production (Material, Measurement, Machine, Environment, People, Process) plus Output (observations).
- Display: tokenized, read‑only TV route rotating dashboards/charts.

## 5. Functional Requirements
### 5.1 Authentication and Organizations
- R1.1 Users sign in with email/password (Supabase Auth).
- R1.2 Org switcher lists organizations the user belongs to.
- R1.3 Protected routes redirect unauthenticated users to `/login`.
- R1.4 RLS ensures users access only their org’s data.

### 5.2 Data Ingestion and Modeling
- R2.1 CSV wizard steps: Source → Mapping → Validate → Schedule → Summary.
- R2.2 Mapping supports fields: timestamp, value, series, note (extensible).
- R2.3 Validation previews first rows and flags timestamp/value issues.
- R2.4 Granularity is stored per series (second/minute/hour/day/week).
- R2.5 Dataset detail page shows recent imports, sample chart, metadata.

### 5.3 Charting
- R3.1 Chart types: Individuals & Moving Range (v1), ratios later.
- R3.2 Limits: Average/UCL/LCL from calc or fixed values.
- R3.3 Save chart config to persist view; default per dataset.
- R3.4 Annotations for points and bands (later).

### 5.4 Rules and Alerts
- R4.1 Implement Western Electric Rules 1–2 (v1), extend to 3–4 later.
- R4.2 Generate alerts with severity and status; list and filter.
- R4.3 Alert detail shows meta, sparkline, severity actions.
- R4.4 Analysis form captures Output + 6 factors of production; edits saved.
- R4.5 Export printable report (PDF‑friendly layout) (later milestone).

### 5.5 Dashboards and Displays
- R5.1 Dashboard grid of charts with quick stats and filters.
- R5.2 Display endpoints: tokenized, kiosk‑friendly, rotation of views.
- R5.3 Remote refresh/endpoints for rotating displays (later).

### 5.6 Admin
- R6.1 Invitations flow (email), roles (admin/member) (later).
- R6.2 Managed connector requests (admin only) (later).

## 6. Non‑Functional Requirements
- N1 Accessibility: WCAG AA; keyboard support, focus rings, high contrast.
- N2 Performance: First load < 2.5s on mid‑range laptop; chart interactions within 50ms budget for pointer updates.
- N3 Reliability: Route handlers should be idempotent; file stub uses atomic writes.
- N4 Security: RLS enforced; stable search_path in DB functions; password leak protection enabled.
- N5 Observability: Log errors with correlation IDs; optional Sentry later.
- N6 Internationalization/time: store `timestamptz`; render per org timezone later.

## 7. Data Model (initial)
- organizations(id uuid, name text, description text, updated_at timestamptz)
- organization_members(organization_id uuid, user_id uuid, role text, joined_at timestamptz)
- datasets(id uuid, name text, description text, organization_id uuid)
- series(id uuid, name text, unit text, dataset_id uuid, organization_id uuid, granularity text)
- readings(id uuid, series_id uuid, timestamp timestamptz, value numeric, organization_id uuid)
- charts(id uuid, series_id uuid, chart_type text, multiplier numeric, dataset_id uuid, organization_id uuid, config_json jsonb)
- alerts(id uuid, organization_id uuid, chart_id uuid, point_time timestamptz, value numeric, rule text, severity text, status text, created_at timestamptz)
- alert_analyses(id uuid, alert_id uuid, organization_id uuid, severity text, output text, material text, measurement text, machine text, environment text, people text, process text, updated_by uuid, updated_at timestamptz)
- displays(id uuid, organization_id uuid, name text, token text unique, config_json jsonb, created_at timestamptz)

Indexes: (org_id, fk columns), time‑based where appropriate. RLS on all tenant tables.

## 8. API Contracts (stable; stubs now, DB later)
- GET `/api/alerts/[id]/analysis` → 200 `AlertAnalysis` | 404
- PUT `/api/alerts/[id]/analysis` → 200 `{ ok: true, record }`
- POST `/api/datasets/upload` (later) → validate & upsert; returns counts and errors.
- GET `/api/charts/[id]` (later) → chart config and data view.

All payloads validated via Zod; UI imports shared types from `src/lib/contracts/*`.

## 9. User Stories & Acceptance Criteria (excerpt)
- US‑1: As a supervisor, I can upload a CSV and see mapped fields before importing.
  - AC: Mapping supports timestamp/value; preview shows first 5 rows; invalid timestamps highlighted.
- US‑2: As a supervisor, I can view an I/MR chart with UCL/LCL and hover values.
  - AC: Chart renders in <200ms for n≤500; limits toggleable; averages displayed.
- US‑3: As an analyst, I can see an alert and add an analysis with Output and 6 factors.
  - AC: Saving persists; refresh shows same data; printable layout renders.
- US‑4: As an ops manager, I can open a display token URL on a TV to rotate charts.
  - AC: Route loads without auth; rotation interval configurable; layout readable at 3m distance.

## 10. Milestones (DoD)
- M0 Shell: responsive sidebar/drawer, breadcrumbs, empty/loading, AA contrast.
- M1 Auth/Org: protected routes, org switcher; smoke tests passing.
- M2 Data UX: dataset detail mock + CSV wizard; URL state for steps; stubs wired.
- M3 Charts v1: I/MR with limits save/load; performance budget met.
- M4 Rules/Alerts v1: WE 1–2; alert creation; detail with analysis; stub persistence → Supabase later.
- M5 Displays v1: token endpoint + rotation; kiosk style.
- M6 Schema v1: `alert_analyses` + RLS; swap stubs; backfill script.
- M7 Granularity: series.granularity; axis/rollup rules; tests.
- M8 Reports: weekly digest; printable alert report.

## 11. Risks and Mitigations
- R‑A Turbopack dev cache errors → scripted clean/restart; CI uses `next build`.
- R‑B RLS complexity → policy templates; lint advisor checks; test roles.
- R‑C Chart performance at high n → windowing/aggregation; sampling toggles.
- R‑D TV device variance → CSS safe area; font scaling; offline refresh shim.

## 12. Open Questions
- Should limits be auto‑recomputed on new data or require “recalculate” action?
- Per‑org timezone storage vs per‑dataset? Default to org; override allowed?
- Display playlist: charts only or dashboards too? JSON config shape?

## 13. Definition of Done (per feature)
- Types and Zod schemas updated; contracts documented.
- UI implemented with loading/empty/error states and keyboard support.
- Tests: at least one integration path using stub API.
- Build passes with no ESLint errors; performance budget checked where applicable.
- Docs updated (REQUIREMENTS, RFCs, ROADMAP if timelines shift).

---
This document is living. Changes require updating user stories, acceptance criteria, and—when applicable—RFCs to record design decisions.
