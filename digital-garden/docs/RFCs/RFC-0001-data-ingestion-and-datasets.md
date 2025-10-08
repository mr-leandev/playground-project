# RFC-0001: Data ingestion & datasets

Status: draft

## Context
Users are largely non-technical; CSV upload and managed ingestion will cover 98% of use. We need a gentle, robust flow.

## Goals
- New dataset wizard for CSV with mapping, validation, scheduling
- Dataset detail page with preview and sample chart
- Server route for CSV upload (later): validate and upsert `readings`

## Non-goals
- Source-specific connectors (S3, GSheets) beyond “Managed” placeholder

## Proposal
- Front-end: current wizard (source → mapping → validate → schedule → summary)
- Server: POST `/api/datasets/upload` (later) accepts CSV, validates schema, maps columns, upserts into `readings`
- Schema: reuse existing `datasets`, `series`, `readings`; link uploaded file to `dataset_id`

## Phases
1) Front-end only (done): wizard and detail page mock
2) Server upload route with validation (no background jobs)
3) Background scheduling (Supabase cron) for managed sources (later)

## Risks
- Large files; consider streaming parse

## Success
- Non-technical users can create a dataset via CSV and see it charted with minimal steps.
