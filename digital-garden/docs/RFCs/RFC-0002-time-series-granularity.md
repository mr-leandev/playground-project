# RFC-0002: Time-series granularity

Status: draft

## Context
We need to support datasets with different time grains: second, minute, hour, day, week. Future sources may stream events (buttons, cameras) or batch CSV.

## Goals
- Represent time consistently with `timestamptz`
- Capture grain explicitly for correct rollups/validation
- Allow mixing grains across datasets/series

## Non-goals
- Real-time ingestion, edge compute (later)

## Proposal
- Column additions (if needed):
  - `series.granularity text check in ('second','minute','hour','day','week')` (or enum)
  - `readings.timestamp timestamptz not null`
- Validation rules per grain (e.g., day requires 00:00:00 or date-only input normalized to midnight UTC)
- Query helpers: rollup to display grain, bucketing utils in TS

## Phases
1) Front-end only: expose grain choice in New dataset wizard
2) Migrations: add `granularity` to `series`; write validation/checks
3) Wire pages to use grain for axes/ticks and aggregation

## Risks
- Timezone ambiguity; use `timestamptz` and surface org timezone later

## Success
- Can create datasets with any of the 5 grains; SPC charts render correctly with expected ticks.
