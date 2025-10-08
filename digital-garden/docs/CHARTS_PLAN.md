# Charts Scope, Data Model and Plan

## Product scope
- Users belong to an organization (multi-tenant). Work is grouped into Areas (e.g., site > line > cell).
- Areas contain Datasets (manual, CSV, connectors, API). Datasets are typed and carry metadata (units, formatter, granularity, timezone, source).
- Charts are generated from Datasets and configured by type, goal (up/down good), sigma (1–3), titles/subtitles, and optional rule sets.
- Dashboards assemble Charts for an Area; TV mode for display.
- Alerts + Analyses (fishbone) are linked to chart events (later phases).

## Initial data model (DB)
- areas: id, name, parent_id?, created_at
- datasets: id, area_id, name, type, unit, granularity, tz, source, meta jsonb, created_at
- charts: id, area_id, dataset_id?, title, subtitle, type (i,p,np,c,u,xbar-r,combo), sigma, goal (up|down), granularity, subgroup_size?, config jsonb, version int, created_at, updated_at
- dashboards: id, area_id, name, created_at
- dashboard_charts: dashboard_id, chart_id, position

Notes
- JSON config (versioned) carries evolving options: series mapping, thresholds/targets, annotations, styles, combo series.
- Later: add org_id to each table and enforce RLS by org membership.

## UX flows
- Catalog (by Area): create chart definitions; set title/subtitle/type/sigma/goal/granularity/subgroup size; save to DB.
- Dashboard (by Area): display saved charts; simple grid; TV mode.
- Dataset detail: manage dataset metadata, preview charts (later).
- Alerts/analysis: later.

## Engineering considerations
- Control limits: precompute per chart/window for performance; recompute on new data; cache results.
- Time handling: dataset timezone; calendars (shifts/holidays) later.
- Ingestion: start with manual/CSV; unify connector contract later.
- Testing: seed Areas/Datasets; unit tests for limit math; integration for catalog/dashboard.

## Phased plan
### Phase A — DB + wiring (now)
1) Migrations
   - Add `areas` table.
   - Extend `charts`: `subtitle text`, `config jsonb not null default {}`, `version int not null default 1`, `area_id` FK.
2) Catalog updates
   - Area picker (create Area if none).
   - Save charts to Supabase with title/subtitle/area/config.
3) Dashboard MVP
   - `/dashboard?area=:id` shows charts for Area; render with mock data for now.

### Phase B — Dataset scaffolding
4) Dataset editor (name, type, unit, granularity, tz) and link charts to a dataset.
5) Preview mock data per chart type in Dataset detail.

### Phase C — Behavior and polish
6) Goal orientation affects render colors/summary; adverse points highlighted.
7) Combo chart groundwork: multiple series in config JSON; two-series demo.
8) Limits/targets in config; rule set selection (store only, evaluate later).
9) Dashboard layout: drag/position persisted; TV mode.

### Phase D — Org/auth + alerts (later)
10) Add org_id + RLS; user roles.
11) Alert rules table; record alerts; link to analyses.

## Open questions
- Calendar/shifts impact on sampling and summaries.
- Rebaselining and baseline windows.
- Data quality flags and UI treatment (missing, late, outliers).
