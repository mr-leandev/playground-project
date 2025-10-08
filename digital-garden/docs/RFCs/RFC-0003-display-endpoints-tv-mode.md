# RFC-0003: Display endpoints (TV mode)

Status: draft

## Context
Factories/offices need read-only displays on TVs/monitors. We must render charts to a simple endpoint with minimal chrome and rotation support.

## Goals
- Public display URLs protected by signed tokens
- Auto-rotate through a set of charts/dashboards
- Kiosk mode: large fonts, dark-on-dark friendly, low CPU

## Non-goals
- Live editing on TV endpoints

## Proposal
- Table: `display_tokens(id, org_id, name, config_json, created_at)`
- Route: `/display/[token]` server-rendered; reads config and renders charts
- Rotation: client script cycles every N seconds; manual refresh endpoint

## Phases
1) Front-end mock of TV route with local config
2) Token table + route reading config from DB
3) Rotation controls and remote refresh webhooks

## Success
- A token URL renders a rotating set of charts on a TV with no auth friction.
