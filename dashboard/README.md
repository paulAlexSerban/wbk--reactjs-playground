# Projects Showcase Hub

## Data Source

Dashboard project data is generated, not manually maintained.

- Generator script: `../scripts/dashboard-deps.js`
- Input metadata:
    - `frontend/apps/*/package.json`
    - `frontend/experiments/*/package.json`
- Outputs:
    - `dashboard/src/data/projects.json` (merged, backward compatible)
    - `dashboard/src/data/projects.apps.json`
    - `dashboard/src/data/projects.experiments.json`
    - `package/serve.json`

## Generate Data

From `dashboard/`:

```bash
npm run generate:projects
```

Or from repo root:

```bash
yarn dashboard:deps
```

The generated dataset includes both deployable apps and experiments, with `sourceType` set to `app` or `experiment`.
