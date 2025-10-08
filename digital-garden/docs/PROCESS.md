# Working process (design‑first, low‑debt)

- Capture ideas as RFCs (under `docs/RFCs/`), each with: context, goals, non-goals, risks, phased plan, success metrics.
- Avoid DB changes until an RFC is accepted. Start with mocks/front‑end flows; wire later.
- Prefer small milestones (1–2 days). Each milestone ships something demoable and production‑safe.
- When schema is needed, add an ADR note to the RFC and a reversible migration plan.
- Keep code readable, typed, lint‑clean. No secrets in the repo; use `.env.local`.

## RFC lifecycle
- draft → review → accepted → implemented → validated
- Every accepted RFC gets: issues/tasks, tracked in `ROADMAP.md`.
