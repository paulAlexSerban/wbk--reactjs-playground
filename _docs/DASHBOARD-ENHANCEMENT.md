# Dashboard Architecture Notes and Execution Plan

## 1. Observed Project Structure, Architecture, and Patterns

### Monorepo Structure (Observed)

```text
wbk--reactjs-playground/
|-- frontend/
|   |-- apps/                 # deployable app workspaces
|   |-- experiments/          # exploratory app workspaces
|   `-- _boilerplates/
|-- dashboard/                # portfolio UI that lists projects
|   |-- src/
|   |   |-- pages/            # route pages
|   |   |-- components/
|   |   |   |-- portfolio/    # dashboard-specific UI
|   |   |   `-- ui/           # shadcn/radix primitives
|   |   |-- hooks/            # local state + filtering logic
|   |   |-- data/             # projects.json + selectors
|   |   `-- types/
|-- scripts/
|   `-- dashboard-deps.js     # projects.json + serve.json generator
|-- package/
|   `-- wbk--reactjs-playground/
|       `-- apps/             # packaged build outputs
`-- _docs/
```

### Runtime Architecture (Dashboard)

- Routing:
- `dashboard/src/App.tsx` uses `react-router-dom` with `BrowserRouter` + `basename` from `VITE_DOMAIN_PATH`.
- Currently a single functional route (`/`) + `NotFound` fallback.
- State and Data Flow:
- Source-of-truth data comes from `dashboard/src/data/projects.json`.
- `dashboard/src/data/projects.ts` normalizes project records and derives selectors (`projects`, `appProjects`, `experimentProjects`, categories, tech stacks).
- `dashboard/src/hooks/useProjects.ts` performs filtering, sorting, and pagination.
- UI Composition:
- `dashboard/src/pages/Index.tsx` composes: `Header` -> `SourceTypeTabs` -> optional `ExperimentsInfo` -> `FeaturedSection` -> controls -> `ProjectGrid` -> `Pagination` -> `ProjectModal`.
- UX Patterns:
- Search, faceted filters, sort modes, view modes, pagination, modal details.
- Conditional layout behavior (featured hidden in experiments mode).
- Styling and Components:
- Tailwind + shadcn/ui + Radix primitives.
- Utility function pattern with `cn()` in `dashboard/src/lib/utils.ts`.

### Build and Metadata Generation Pattern (Observed)

- Current metadata generation is done by `scripts/dashboard-deps.js`.
- Generator reads `frontend/apps/*/package.json` and `frontend/experiments/*/package.json`, builds normalized project objects, writes:
- `dashboard/src/data/projects.json`
- `package/serve.json` rewrites for app routes.
- Defensive runtime normalization exists in `dashboard/src/data/projects.ts` to infer `sourceType` if missing.

### Architectural Strengths

- Clear separation between UI shell (`pages/components`) and data orchestration (`hooks/data`).
- Monorepo structure scales for many projects.
- Generator-based metadata avoids manual sync drift.
- Design system consistency via shared UI primitives.

### Risks and Gaps

- Schema contract is implicit; no formal runtime validation in generation step.
- Some repo docs still describe older generation behavior.
- Source type count UI depends on static import-time calculations in tabs component.
- Dashboard currently bundles all metadata directly into frontend bundle.

## 2. Suggested Plan (Architecture, System Design, Patterns, UX/UI)

### P1. Data Contract and Generation Hardening

1. Introduce a canonical `ProjectMetadata` schema in `dashboard/src/types/project.ts` (or shared package).
2. Add generator-side validation and defaults in `scripts/dashboard-deps.js`.
3. Add generator warnings report for malformed `package.json` metadata (missing `id`, `createdAt`, `techStack`, etc.).
4. Optionally add `generatedAt` and `source` fields in `projects.json` metadata header pattern (if switching to envelope format later).

Expected outcome: deterministic and debuggable metadata pipeline.

### P2. Source-of-Truth and Build Pipeline Consistency

1. Keep `scripts/dashboard-deps.js` as the single metadata source.
2. Update root `README.md` and dashboard docs to reflect real behavior (apps + experiments scan).
3. Add CI check to fail if `dashboard/src/data/projects.json` is stale versus generator output.

Expected outcome: no documentation drift and no stale generated artifacts.

### P3. Dashboard Domain Layer Refinement

1. Move filtering/sorting/pagination pure logic from hook into testable utility functions.
2. Keep hook for orchestration and state only.
3. Add unit tests for fuzzy search, source type split, and sorting determinism.

Expected outcome: easier maintenance and safer future feature additions.

### P4. UX and UI Improvements

1. Add an explicit empty-state taxonomy:

- no projects in dataset
- no results for current filters
- experiments with no screenshots/demo

2. Show resilient media placeholders when `images.length === 0` or image load fails.
3. Add a compact metadata health chip in admin/dev mode (optional): counts by `sourceType`, missing images, missing demo links.
4. Improve tabs accessibility:

- `role="tablist"`, `role="tab"`, keyboard navigation, `aria-selected`.

Expected outcome: clearer behavior, better accessibility, fewer visual dead ends.

### P5. System Design Evolution (Optional Next Stage)

1. Split generated output into:

- `projects.apps.json`
- `projects.experiments.json`
- optional merged view generated in dashboard build step

2. Support lazy loading of metadata if dataset scales beyond current size.

Expected outcome: scalable metadata strategy without changing current UX.

## 3. Critique: Plan vs Observed Architecture (Does It Make Sense?)

### Alignment Check

- P1 fits current architecture well because metadata generation is already centralized.
- P2 is mandatory and low-risk due current doc/behavior mismatch.
- P3 respects existing separation by extracting pure logic without changing UI behavior.
- P4 aligns with existing card/modal and source-type UX.
- P5 should be deferred because 40 records does not justify extra complexity yet.

### Trade-offs

- Strict validation may surface many metadata warnings initially.
- Accessibility improvements increase component code size slightly, but with strong UX gains.
- Splitting metadata files is premature unless growth requires it.

### Recommended Priority Order

1. P2 (docs + pipeline consistency)
2. P1 (schema hardening)
3. P4 (UX resilience + accessibility)
4. P3 (testability extraction)
5. P5 (only if scale demands)

Conclusion: the plan is coherent with current architecture and avoids over-engineering.

## 4. Approval-Gated Todo List

Execution proceeds only after explicit approval per step.

- [x] Step A: Documentation alignment update
- Update `README.md` pipeline section to reflect apps+experiments metadata generation.
- Approval gate: "Approve Step A"
- [x] Step B: Metadata schema hardening in generator
- Add stricter normalization + warnings in `scripts/dashboard-deps.js`.
- Approval gate: "Approve Step B"
- [x] Step C: UX robustness pass
- Improve empty states, missing media handling, and tabs accessibility.
- Approval gate: "Approve Step C"
- [x] Step D: Logic extraction and tests
- Extract filter/sort utilities and add focused tests.
- Approval gate: "Approve Step D"
- [x] Step E: Optional scale design
- Evaluate and implement split metadata files only if needed.
- Approval gate: "Approve Step E"
