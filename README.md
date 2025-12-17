# React Playground Monorepo

> A comprehensive showcase of modern React application development, demonstrating enterprise-level monorepo architecture, automated deployment pipelines, and contemporary frontend engineering practices.

[![Deployed](https://img.shields.io/badge/deployed-GitHub%20Pages-success)](https://paulalexserban.github.io/wbk--reactjs-playground/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org/)
[![Lerna](https://img.shields.io/badge/Lerna-7.3-purple)](https://lerna.js.org/)

## Table of Contents

1. [Overview](#overview)
2. [Project Architecture](#project-architecture)
3. [Technology Stack](#technology-stack)
4. [Development & Build Tools](#development--build-tools)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Getting Started](#getting-started)

## Overview

This monorepo demonstrates professional frontend development practices through a collection of React applications, reusable component libraries, and automated build tooling. The project showcases expertise in:

- **Monorepo Management**: Lerna-based architecture with Yarn Workspaces for efficient dependency management
- **Modern Build Systems**: Vite-powered development with optimized production builds
- **Automated Deployments**: GitHub Actions CI/CD pipeline with automatic deployment to GitHub Pages
- **Component Architecture**: Headless UI patterns with Radix primitives and Tailwind CSS
- **Developer Experience**: Conventional commits, automated versioning, and streamlined workflows

### Live Demo

**[View Portfolio Dashboard →](https://paulalexserban.github.io/wbk--reactjs-playground/)**

The dashboard provides an interactive showcase of all applications with live previews and technical details.

## Project Architecture

The repository is structured as a Lerna-managed monorepo with clear separation of concerns and reusable build patterns:

```
wbk--reactjs-playground/
├── frontend/
│   ├── apps/                    # Production React applications
│   │   ├── learn-quizer/       # Educational quiz platform with spaced repetition
│   │   ├── tic-tac-toe-app/    # Interactive game demonstrating state management
│   │   └── moveit-work-flow/   # Task management application
│   └── _boilerplates/          # Reusable project templates
│       ├── _vite-react-ts-boilerplate/
│       └── _icodethis-boilerplate/
├── dashboard/                   # Portfolio showcase application
├── assets/media/               # Automated image processing pipeline
├── scripts/                     # Build orchestration and automation
├── package/                     # Production build artifacts
└── .github/workflows/          # CI/CD configuration
```

### Monorepo Structure

The project leverages **Lerna 7.3** with **Yarn Workspaces** for efficient package management and dependency hoisting:

- **`frontend/apps/*`** - Production applications with independent routing and deployment
- **`frontend/_boilerplates/*`** - Standardized templates for rapid project scaffolding
- **`dashboard/`** - Central portfolio interface with dynamic project discovery
- **`assets/media/`** - Gulp-based media optimization pipeline using Sharp
- **`scripts/`** - Custom build utilities for packaging and deployment preparation

## Technology Stack

### Core Technologies

- **React 18** - Modern React with concurrent features and the `createRoot` API
- **TypeScript** - Full type safety across all applications and tooling
- **Vite** - Next-generation build tool providing instant HMR and optimized production builds

### UI & Component Architecture

- **Radix UI** - Unstyled, accessible component primitives forming the foundation of custom design systems
- **Tailwind CSS** - Utility-first CSS framework for rapid, maintainable styling
- **Shadcn/ui** - Beautifully designed components built on Radix primitives
- **Custom SCSS** - Foundational styling architecture for legacy components

### Data & State Management

- **React Hook Form** - Performant form handling with minimal re-renders
- **TanStack Query (React Query)** - Asynchronous state management with intelligent caching
- **Zod** - TypeScript-first schema validation for runtime safety
- **React Context API** - Application-level state orchestration

### Development Infrastructure

| Category             | Technology         | Purpose                                            |
| -------------------- | ------------------ | -------------------------------------------------- |
| **Monorepo**         | Lerna 7.3          | Package versioning and workspace orchestration     |
| **Package Manager**  | Yarn Workspaces    | Dependency management and hoisting                 |
| **Build Tool**       | Vite               | Development server and production bundling         |
| **Asset Processing** | Gulp 5 + Sharp     | Automated image optimization and format conversion |
| **Code Quality**     | Prettier + ESLint  | Consistent code formatting and linting             |
| **Version Control**  | Semantic Release   | Automated versioning and changelog generation      |
| **Git Workflow**     | Husky + Commitizen | Conventional commits enforcement                   |

### Routing

- **React Router v6** - Type-safe client-side routing with nested route support

## Development & Build Tools

### Automated Build Pipeline

The project implements a sophisticated multi-stage build process orchestrating app compilation, asset optimization, and deployment preparation:

```bash
# Full production build
yarn build:full
```

**Pipeline Stages:**

1. **Application Build** (`yarn build:apps:prod`)
    - Compiles all React applications using Vite
    - Generates optimized, tree-shaken production bundles
    - Applies code splitting for optimal loading performance

2. **App Packaging** (`yarn package:apps`)
    - Executes `scripts/package-apps.bash`
    - Copies each app's `dist/` to `package/wbk--reactjs-playground/apps/{app-name}`
    - Maintains project structure for multi-app GitHub Pages deployment

3. **Dependency Generation** (`yarn dashboard:deps`)
    - Runs `scripts/dashboard-deps.js`
    - Scans packaged apps and extracts metadata
    - Generates `projects.json` for dashboard consumption
    - Creates `serve.json` with routing rules for SPA support

4. **Dashboard Build** (`yarn build:dashboard:prod`)
    - Compiles portfolio dashboard application
    - Integrates dynamically generated project data

5. **Dashboard Packaging** (`yarn package:dashboard`)
    - Finalizes deployment-ready package structure

### Development Workflow

```bash
# Individual app development
cd frontend/apps/learn-quizer
yarn dev  # Starts Vite dev server with HMR
```

### Asset Processing Pipeline

Automated image optimization using Gulp and Sharp:

```bash
cd assets/media
yarn process  # Generates WebP renditions with multiple sizes
```

**Features:**

- Multiple resolution outputs for responsive images
- WebP conversion for modern browsers
- Automated file naming conventions
- ES module compatibility (Node 24+)

### Vite Configuration Strategy

Each application implements consistent Vite configuration for GitHub Pages compatibility:

```typescript
export default defineConfig({
    base: `/apps/${SLUG}/`, // Dynamic base path for deployment
    define: {
        'import.meta.env.VITE_APP_SLUG': JSON.stringify(SLUG),
    },
    // Additional optimization configs...
});
```

This pattern enables:

- Multi-app hosting under a single domain
- Proper asset path resolution
- Environment-specific runtime configuration

## CI/CD Pipeline

### Automated Deployment Architecture

The project implements a production-grade GitHub Actions workflow for continuous deployment:

**Workflow File:** `.github/workflows/build-n-deploy.yml`

**Triggers:**

- Push to `main` branch
- Manual workflow dispatch

### Pipeline Stages

#### 1. Build & Package (`ubuntu-latest`, Node 24.12.0)

```yaml
- Install dependencies (Yarn with workspace hoisting)
- Build all applications (Vite production mode)
- Package applications to deployment structure
- Generate dashboard metadata and routing configuration
- Build and package dashboard
- Upload build artifacts (30-day retention)
```

#### 2. Deploy

```yaml
- Download build artifacts
- Deploy to GitHub Pages using peaceiris/actions-gh-pages@v4
```

**Deployment URL:** `https://paulalexserban.github.io/wbk--reactjs-playground/`

### Engineering Solutions

**Challenge:** Multiple React SPAs under a single GitHub Pages deployment

**Solution:**

- Dynamic base path configuration in Vite
- Automated `serve.json` generation for client-side routing
- Centralized metadata generation for dashboard discovery

**Challenge:** Asset path resolution across different deployment environments

**Solution:**

- Environment-aware Vite configuration
- Runtime slug injection via `import.meta.env`
- Consistent path patterns enforced through build scripts

## Getting Started

### Prerequisites

- **Node.js:** 24.12.0 (matching CI/CD environment)
- **Yarn:** Latest 1.x

### Installation

```bash
# Clone the repository
git clone https://github.com/paulAlexSerban/wbk--reactjs-playground.git
cd wbk--reactjs-playground

# Install dependencies (Lerna will bootstrap all workspaces)
yarn install
```

### Development

**Develop a specific application:**

```bash
cd frontend/apps/learn-quizer
yarn dev  # Starts Vite dev server at localhost:5173
```

**Process and optimize media assets:**

```bash
cd assets/media
yarn process
```

### Production Build

```bash
# Build all applications and dashboard
yarn build:full

# Serve locally to preview production build
yarn start:package
# Opens at http://localhost:3000
```

### Project Scripts

| Command                | Description                                |
| ---------------------- | ------------------------------------------ |
| `yarn build:full`      | Execute complete production build pipeline |
| `yarn build:apps:prod` | Build all applications only                |
| `yarn package:apps`    | Package apps for deployment                |
| `yarn dashboard:deps`  | Generate dashboard metadata                |
| `yarn start:package`   | Serve production build locally             |

---

## Technical Expertise Demonstrated

This project showcases professional competency in:

- ✅ **Monorepo Architecture** - Lerna and Yarn Workspaces configuration
- ✅ **Modern React Patterns** - Hooks, Context, composition, and performance optimization
- ✅ **TypeScript Integration** - Type-safe application development
- ✅ **Build Optimization** - Vite configuration and production bundling
- ✅ **CI/CD Implementation** - Automated GitHub Actions workflows
- ✅ **Developer Experience** - Conventional commits, automated versioning, and streamlined workflows
- ✅ **Component Architecture** - Headless UI patterns with Radix and custom design systems
- ✅ **Asset Pipeline** - Automated image optimization and responsive asset generation
