# TASKS — UX → Stub API → Wired Component

This plan turns the requirements into shippable work packages. Each feature follows three stages:
- Stage A: Functional UX mockup (front‑end only, with realistic interactions and states)
- Stage B: Stub API (stable contract + Zod models, file‑backed persistence in `.data/`)
- Stage C: Wired Component (swap internals to Supabase, preserve the API contract)

Use the checkboxes to track progress. Update when we implement or refine.

## 0. Foundations
- [ ] A. Shell polish: responsive sidebar/drawer, breadcrumbs, tabs, empty/loading/error states
- [ ] A. Command palette (quick nav, “new dataset”, “new chart”)
- [ ] B. None
- [ ] C. None

## 1. Authentication & Organizations
- [ ] A. Login page states (idle/loading/error), org switcher in header, protected route mocks
- [ ] B. Route guards via middleware (stubbed auth pass‑through)
- [ ] C. Wire to Supabase Auth, RLS policies verified

User stories
- [ ] As a user, I can sign in and see my email in the header.
- [ ] As a user, I can switch orgs (selection persists per device) and see scoped data.
- [ ] As a guest, protected pages redirect me to `/login`.

## 2. Data Ingestion (CSV) & Datasets
- [x] A. New dataset wizard (Source→Mapping→Validate→Schedule→Summary) with interactions
- [ ] A. Dataset detail page mock (preview table, sample chart, metadata chips)
- [ ] B. POST `/api/datasets/upload` (stub) — validate CSV, return schema + counts + errors
  - [ ] Zod: `UploadResult { fields[], rowsOk, rowsRejected, sample[] }`
- [ ] C. Wire upload to Supabase (stream parse, upsert readings) and show import result

User stories
- [ ] As a supervisor, I see field mapping and a preview with highlighted issues.
- [ ] As a supervisor, after import I can navigate to the dataset detail page.

## 3. Series & Granularity
- [ ] A. Series editor UI in dataset detail (name, unit, granularity select)
- [ ] B. GET/PUT `/api/series/[id]` (stub) { name, unit, granularity }
- [ ] C. Supabase columns and migrations (`series.granularity`), RLS policies

User stories
- [ ] As an analyst, I can change a series granularity and see the axis/labels update on charts.

## 4. Charts (I/MR v1)
- [ ] A. Chart config drawer: select series, limits (calc/fixed), smoothing, show avg/UCL/LCL
- [ ] A. Chart component: I/MR rendering, hover, zoom/brush (optional), loading/empty/error states
- [ ] B. GET `/api/charts/[id]` (stub) returns `{config,data}`
- [ ] C. Supabase query: fetch readings, compute stats/limits on server; persist config

User stories
- [ ] As a supervisor, I can see a smooth I/MR chart with limits and averages.
- [ ] As an analyst, I can save a chart config and reload the same view later.

## 5. Rules & Alerts
- [x] A. Alert list page (cards) + detail page with Fishbone form (Output + 6 factors)
- [x] B. GET/PUT `/api/alerts/[id]/analysis` (stub, file store) with Zod contracts
- [ ] B. POST `/api/alerts/check` (stub): run WE Rules 1–2 on a dataset; create alert objects
- [ ] C. Supabase: alert tables, scheduled rule run (cron), RLS; swap stub analysis to DB

User stories
- [ ] As an analyst, I can mark an alert severity and capture an analysis; saved across refresh.
- [ ] As a supervisor, I can filter alerts by dataset/series/severity/status.

## 6. Dashboards
- [ ] A. Dashboard page with draggable grid (mock), cards for key KPIs and charts
- [ ] B. GET/PUT `/api/dashboards/[id]` (stub) with `config_json`
- [ ] C. Supabase: dashboard tables; user/shared dashboards; load configs

User stories
- [ ] As an ops manager, I can assemble a dashboard from charts and KPIs and share it.

## 7. Displays (TV Mode)
- [ ] A. `/display/[token]` route (mock) showing a rotation of charts/dashboards in kiosk style
- [ ] B. GET/PUT `/api/display/[token]` (stub) returns rotation config
- [ ] C. Supabase: display tokens table; server‑rendered view; remote refresh

User stories
- [ ] As an ops manager, I can open a token URL on a TV to show rotating charts without signing in.

## 8. Reports
- [ ] A. Printable alert analysis layout; report preview with header/footer
- [ ] B. None (stub rendering only)
- [ ] C. Weekly digest email (Supabase function or external worker)

User stories
- [ ] As an exec, I can print or PDF an alert analysis.
- [ ] As an exec, I receive a weekly digest email of key KPIs/alerts.

## 9. Admin & Invitations (later)
- [ ] A. Invite flow UI (enter email, role), pending invites list
- [ ] B. POST `/api/invites` (stub), GET `/api/invites` (stub)
- [ ] C. Supabase: invites table + RLS, accept invite action

User stories
- [ ] As an admin, I can invite a user and see their pending status.

## 10. Observability & Non‑functional
- [ ] A. Error boundaries with friendly messages and retry buttons
- [ ] B. Server logs for route handlers; include correlation IDs
- [ ] C. Optional Sentry/OTel instrumentation (env‑guarded)

---

## Contracts & Models (shared)
- [x] `src/lib/contracts/alerts.ts` (Zod): AlertAnalysis, SixFactors
- [ ] `src/lib/contracts/charts.ts` (Zod): ChartConfig, ChartData
- [ ] `src/lib/contracts/datasets.ts` (Zod): Dataset, Series, UploadResult
- [ ] `src/lib/contracts/displays.ts` (Zod): DisplayConfig

Guideline: UI imports Zod types; route handlers validate all payloads. Stubs persist to `.data/*`. Swapping to Supabase retains the route contract.

## Definition of Done (per task)
- UX: keyboard accessible; empty/loading/error handled; AA contrast; responsive.
- Stub: Zod‑validated request/response; atomic write; error shapes documented.
- Wired: DB migrations + RLS; SSR data fetching; same contract; basic tests pass.

## Open questions (tie to RFCs)
- Limits recompute semantics (auto vs manual).
- Org timezone vs dataset timezone.
- Dashboard/display configuration format and permissions.

