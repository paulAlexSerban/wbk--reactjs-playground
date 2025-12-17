# Future Improvements

## High Priority (MVP → v1.0)

### Testing Infrastructure

- [ ] Add Vitest for unit testing
- [ ] Add React Testing Library
- [ ] Implement Playwright for E2E tests
- [ ] Set up visual regression testing (Chromatic/Percy)
- [ ] Add test coverage requirements (aim for >70%)
- [ ] Create testing documentation and examples

### Build & Tooling

- [ ] Migrate from bash scripts to proper build orchestration (Nx/Turborepo consideration)
- [ ] Add bundle analysis and size budgets
- [ ] Implement proper error boundaries in all apps
- [ ] Add source maps for production debugging
- [ ] Create development environment configuration (dotenv setup)
- [ ] Fix/remove placeholder workspaces (backend, database, shared)

### Developer Experience

- [ ] Add Storybook for component documentation
- [ ] Create contribution guidelines
- [ ] Add proper TypeScript path aliases (`@/` pattern is inconsistent)
- [ ] Document common patterns and conventions
- [ ] Add pre-commit test runs
- [ ] Improve error messages in build scripts

### Component Library

- [ ] Actually implement `frontend/components/react-cmp-lib` or remove references
- [ ] Create shared design system tokens
- [ ] Document component APIs
- [ ] Add component versioning strategy

## Medium Priority (v1.0 → v2.0)

### Performance

- [ ] Implement code splitting strategies
- [ ] Add lazy loading for routes
- [ ] Optimize bundle sizes (current state unknown)
- [ ] Add performance monitoring (Web Vitals)
- [ ] Implement service worker for offline support

### Accessibility ♿

- [ ] Run automated accessibility audits (axe-core)
- [ ] Add ARIA labels where missing
- [ ] Ensure keyboard navigation works
- [ ] Test with screen readers
- [ ] Add focus management patterns

### Security

- [ ] Add dependency vulnerability scanning (Snyk/Dependabot)
- [ ] Implement CSP headers
- [ ] Add security.txt
- [ ] Regular dependency updates strategy
- [ ] Add SAST scanning in CI

### Documentation

- [ ] Add architecture decision records (ADRs)
- [ ] Create detailed component documentation
- [ ] Add troubleshooting guides
- [ ] Document deployment process thoroughly
- [ ] Add video tutorials for complex workflows

## Low Priority (Future Considerations)

### Monorepo Optimization

- [ ] Consider migration to Nx or Turborepo (better caching, task orchestration)
- [ ] Implement remote caching
- [ ] Add affected project detection
- [ ] Optimize CI pipeline (only build changed apps)

### Advanced Features

- [ ] Add SSR/SSG capabilities (Next.js consideration?)
- [ ] Implement internationalization (i18n)
- [ ] Add analytics integration
- [ ] Create CLI for scaffolding new apps
- [ ] Add design token generation from Figma

### Infrastructure

- [ ] Consider alternative hosting (Vercel/Netlify for better DX)
- [ ] Add preview deployments for PRs
- [ ] Implement feature flags system
- [ ] Add monitoring and alerting
- [ ] Create staging environment
