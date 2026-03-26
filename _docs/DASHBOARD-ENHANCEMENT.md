# Dashboard Enhancement: Showcase Apps + Experiments

## Current State

The dashboard at `/dashboard/` currently:

- Showcases **33 apps** from `frontend/apps/` via `projects.json`
- Has **no concept of "experiments"** — the 5 projects in `frontend/experiments/` are entirely absent
- Is missing **2 apps** that exist in `frontend/apps/` but are not in `projects.json`: `to-do-app`, `dummy-blog-app`
- Provides no visual distinction between production apps and experimental R&D projects

---

## Goal

Extend the dashboard to showcase **all 40 projects** (35 apps + 5 experiments) from both
`frontend/apps/` and `frontend/experiments/`, with a clear UX distinction between the two.

---

## Observations

### Dashboard Architecture

- **Entry**: `src/pages/Index.tsx` renders Header → FeaturedSection → Controls (Search + ViewToggle + FilterControls) → ProjectGrid → Pagination
- **Data**: `src/data/projects.json` → typed via `src/types/project.ts` → filtered/sorted/paginated by `src/hooks/useProjects.ts`
- **UI library**: shadcn/ui (Radix + Tailwind) with a dark/light theme toggle
- **View modes**: Grid (3-col) · List · Compact (5-col)
- **Filtering**: fuzzy-search by name/description/tech · category dropdown · tech-stack dropdown · sort (featured/name/date)
- **Featured section**: Renders first 3 projects with `featured: true` in a hero layout (hidden when any filter active)

### Frontend Apps — 35 total

All live under `frontend/apps/`, built with React + TypeScript + Vite.
33 currently in `projects.json`; 2 missing (`to-do-app`, `dummy-blog-app`).
Demo URLs follow the pattern `/wbk--reactjs-playground/apps/<slug>/`.

### Frontend Experiments — 5 total

All live under `frontend/experiments/`:
| Folder | What it is |
|---|---|
| `form-login-app-tailwind` | Login form variant exploring TailwindCSS + Styled Components |
| `form-login-app-w-useReducer` | Login form variant with `useReducer` state management |
| `json-to-excel-app` | R&D: rendering structured JSON datasets, likely JSON→Excel export |
| `rendering-large-lists-windowing-virtualization` | Perf experiment: react-window, react-virtualized, react-viewport-list, infinite scroll, pagination |
| `rnd-axios-http-app` | R&D sandbox: Axios interceptors and HTTP patterns |

Experiments are **not packaged/served** (no `experiments/` folder in `package/wbk--reactjs-playground/`), so `demoUrl` will be `""` for all experiments.

---

## Implementation Plan

### Phase 1 — Data Layer (3 files)

#### 1a. `src/types/project.ts`

- Add `sourceType: 'app' | 'experiment'` field to the `Project` interface
- Add `'sourceType'` key to `FilterState` as `'all' | 'app' | 'experiment'`

#### 1b. `src/data/projects.json`

- Add `"sourceType": "app"` to all 33 existing entries
- Add 2 missing app entries:
    - `to-do-app` (`sourceType: "app"`)
    - `dummy-blog-app` (`sourceType: "app"`)
- Add 5 experiment entries (`sourceType: "experiment"`):
    - `form-login-app-tailwind`
    - `form-login-app-w-useReducer`
    - `json-to-excel-app`
    - `rendering-large-lists-windowing-virtualization`
    - `rnd-axios-http-app`

#### 1c. `src/data/projects.ts`

- Add `experimentProjects` named export (filtered list of experiments)
- Total: `allProjects` → 40 items

---

### Phase 2 — Hook Layer (1 file)

#### 2a. `src/hooks/useProjects.ts`

- Add `sourceType: 'all' | 'app' | 'experiment'` to default filter state
- Add a `sourceType` filter pass before existing category/tech filters:
    ```ts
    if (filters.sourceType !== 'all') {
        result = result.filter((p) => p.sourceType === filters.sourceType);
    }
    ```
- Expose `sourceType` in the return value (already part of `filters`)

---

### Phase 3 — UI Layer (2 new files + 1 edited)

#### 3a. `src/components/portfolio/SourceTypeTabs.tsx` _(new)_

A **tab bar** shown above the search/filter controls with three tabs:

- **All** — shows all 40 projects
- **Apps** — shows 35 app projects only
- **Experiments** — shows 5 experiment projects only

Each tab shows a count badge. Active tab is highlighted. Switching tabs resets pagination to page 1.

#### 3b. `src/components/portfolio/ExperimentsInfo.tsx` _(new)_

A subtle **info banner** shown only when `sourceType === 'experiment'`. Explains that experiments are R&D sandboxes, may lack screenshots or live demos, and link to source code (when available). Styled with muted background + beaker/flask icon.

#### 3c. `src/pages/Index.tsx` _(edit)_

1. Import `SourceTypeTabs` and `ExperimentsInfo`
2. Render `<SourceTypeTabs>` between the `<Header>` and `<main>` content (inside the container, above the featured section)
3. Conditionally render `<ExperimentsInfo>` when `sourceType === 'experiment'`
4. Conditionally render `<FeaturedSection>` only when `sourceType !== 'experiment'` (experiments have no featured items)

---

## File Change Summary

| File                                           | Change                                                      |
| ---------------------------------------------- | ----------------------------------------------------------- |
| `src/types/project.ts`                         | Add `sourceType` to `Project` and `FilterState`             |
| `src/data/projects.json`                       | Add `sourceType` to all, add 2 missing apps + 5 experiments |
| `src/data/projects.ts`                         | Add `experimentProjects` export                             |
| `src/hooks/useProjects.ts`                     | Add `sourceType` filter pass                                |
| `src/components/portfolio/SourceTypeTabs.tsx`  | **New** — tab switcher component                            |
| `src/components/portfolio/ExperimentsInfo.tsx` | **New** — info banner for experiments view                  |
| `src/pages/Index.tsx`                          | Integrate tabs + experiments info                           |

**Total new projects:** 35 apps + 5 experiments = **40 projects**  
**Net additions to projects.json:** +7 entries (2 apps + 5 experiments)  
**Net new source code files:** 2

---

## Non-Goals (out of scope)

- Packaging/serving experiments (they have no built output)
- Adding screenshots for experiments (none exist)
- Changing the existing app entries' data beyond adding `sourceType`
- Adding a GitHub source URL (all are `""` in source data)
