# Playground React (Template)

> Template repository for React Monorepo projects
> Initially built by following: Advanced React for Enterprise Applications: react for Senior Engineers (udemy)
> Improved by following:
>
> - Monorepo's - A Beginner's Guide (udemy)
> - The Complete Github Actions & Workflows Guide (udemy)
> - Master the Core Concepts of React and Storybook (udemy)
> - React & TypeScript - The Practical Guide

## Env. URL's

- [PROD Apps Lib](https://www.paulserban.eu/wbk--reactjs-playground--typescript/apps/)
- [Visual Regression Testing w. Chromatic & Storybook](https://www.chromatic.com/builds?appId=65278ceafda5062d74eb64f6)

- [STAGE - Apps Lib](https://stage.paulserban.eu/wbk--reactjs-playground--typescript/apps/)
- [STAGE - Component Lib w. Storybook](https://stage.paulserban.eu/wbk--reactjs-playground--typescript/storybook)

- [TEST - Apps Lib](https://test.paulserban.eu/wbk--reactjs-playground--typescript/apps/)
- [TEST - Component Lib w. Storybook](https://test.paulserban.eu/wbk--reactjs-playground--typescript/storybook)

- [DEV - Apps Lib](https://develop.paulserban.eu/wbk--reactjs-playground--typescript/apps/)
- [DEV - Component Lib w. Storybook](https://develop.paulserban.eu/wbk--reactjs-playground--typescript/storybook)

## 1. Introduction

The project comprises multiple packages as sub-projects, with dependencies between them. The monorepo structure is managed using Yarn and Lerna. The following sections provide a detailed breakdown of the project structure, technologies used, and the configuration of various tools and libraries to ensure consistency, quality, and automated workflows across the project.

## 2. Project Structure

![ci-cd](/wiki/ci-cd.png)

### 2.1 Monorepo Setup

- **Monorepo Management**: Yarn and Lerna are used to manage the monorepo, ensuring consistent dependency versions and streamlined project scripts across packages.
- **Atomic Design**: Used to organize components into atoms, molecules, organisms, templates, and pages.
- **Node.js**: 18.17.1
- **Yarn**: 1.22.10
- **Lerna**: 7.3.0

### 2.2 Packages

- **React Components Library (frontend/components/react-cmp-lib)**: A library of reusable React components with a custom build system using Rollup.
- **Design System Playground (frontend/ds-playgrounds/\*)**: A playground for testing components, with a custom build using Parcel.
- **Foundation (shared/foundation)**: A collection of utilities written in TypeScript, packaged separately.
- **Storybook (frontend/ds-storybook)**: A separate package for documenting and visually testing components in isolation.
- **Living Style Guide - Generic Styles (frontend/lsg-design-system)**: A collections of SCSS variables, mixins, and functions, and component styles packaged separately.

## 3. Technology Stack

- **Front-end**: React.js, TypeScript, SCSS
    - React.js - for building user interfaces and component-based architecture.
    - TypeScript - for extended JavaScript functionality, string type checking, and code consistency - catch and fix type related error before runtime - sometimes that comes with the expense of having to define complex types.
- **Testing**: Jest for unit testing, Storybook and Chromatic for visual testing.
- **Linting and Formatting**: Prettier, ESLint, and Stylelint.
- **Version Control**: Git, with Husky for git hooks, Commit Lint, and Commitzen for structured commit messages.

## 4. Development and Build Tools

- **Component Development**: Storybook for developing and documenting components in an isolated environment.
- **Build Systems**: Custom build setups using Rollup for the component library and Parcel for the playground.

## 5. Continuous Integration and Deployment

- **GitHub Actions**: Set up to automate testing, building, and deployment workflows.
- **Chromatic Deployment**: Automatic deployment to Chromatic for visual regression testing and Storybook hosting.

## 6. Testing and Quality Assurance

- **Unit Testing**: Jest is used for unit testing components and utility functions.
- **Visual Testing**: Storybook and Chromatic are used for visual testing of components.
- **Linting and Formatting**: Prettier, ESLint, and Stylelint are configured to ensure code consistency and quality.

## 7. Version Control and Commit Conventions

- **Git Hooks**: Husky is configured to enforce linting and testing before commits and pushes.
- **Commit Conventions**: Commit Lint and Commitzen are used to ensure structured and meaningful commit messages.

## 8. Root Commands / Scripts

- `npm install -g yarn` - install yarn globally
- `yarn install` - install dependencies
- `yarn build:dev` - build all packages for development
- `yarn build:prod` - build all packages for production
- `yarn test` - run all tests
- `yarn lint` - run all linters
- `yarn formats:check` - check all formats
- `yarn formats:write` - fix all formats
- `yarn start` - start and watch all packages in development mode
- `yarn nx graph` - show dependency graph using NX
- `yarn commit` - commit changes using Commitizen
- `yarn lerna version` - bump version of all packages using Lerna

## 9. CSS Architecture Checklist

- Organized - fixed code structure
- No specificity issues
- Atomic Design principles applied
- Easy to understand (comments, variables, etc)
- Reusable across teams / projects

## 10. Backlog

### Future Improvements or Ideas

- [ ] implement semantic release
- [ ] refactor CI build for better performance (use CI for better performance)
    - [ ] lint, formats and test
        - [ ]   - run locally on committing for development branches
        - [ ]   - run in CI for master branch and on pull requests to release branches
    - [ ] visual regression testing run locally on feature and bug branches and remote on develop branch

### Issues

#### 1. Can't publish to npm registry

> on: `yarn lerna publish`

Logs:

```bash
lerna notice cli v7.3.0
lerna info versioning independent
lerna WARN Yarn's registry proxy is broken, replacing with public npm registry
lerna WARN If you don't have an npm token, you should exit and run `npm login`
lerna info Assuming all packages changed
... some logs ...
lerna WARN notice Package failed to publish: @wbk--reactjs-playground--typescript/shared-foundation
lerna ERR! E404 Not found
lerna ERR! errno "undefined" is not a valid exit code - exiting with code 1
lerna WARN notice Package failed to publish: @wbk--reactjs-playground--typescript/lsg
lerna ERR! E404 Not found
lerna ERR! errno "undefined" is not a valid exit code - exiting with code 1
error Command failed with exit code 1.
```

## Case Studies

### State Management with Context API

Both versions of your `CartContextProvider` in React serve to manage a shopping cart's state and provide that state along with some functions (`addItem`, `updateItemQuantity`) to components in your application. However, they use different state management approaches, each with its own advantages and trade-offs.

### Version 1: Using `useState`

- **State Management:** This version uses the `useState` hook for state management. It's straightforward and easy to understand, especially for simpler state logic.
- **State Updating:** It directly manipulates the state based on the given actions (adding an item, updating quantity). This is more intuitive for simple state updates.
- **Best Suited For:** Smaller applications or components where state changes are minimal and not complex.

### Version 2: Using `useReducer`

- **State Management:** This version uses the `useReducer` hook, which is more suited for complex state logic that involves multiple sub-values or when the next state depends on the previous one.
- **State Updating:** Actions and reducers handle state updates, making it more structured and predictable, especially beneficial for complex state logic.
- **Dispatch Method:** Actions are dispatched rather than setting the state directly. This is helpful for debugging and logging state changes.
- **Best Suited For:** Larger applications or components with complex state interactions or when the state logic might grow in complexity over time.

### Key Differences

1. **Complexity and Scalability:** `useReducer` provides more scalability and is better for managing complex state logic. `useState` is simpler and more straightforward for basic state management.
2. **Predictability:** `useReducer` makes state updates more predictable and organized, which is advantageous in large applications.
3. **Debugging:** With `useReducer`, it's easier to track dispatched actions, which can aid in debugging.

### Choice Depends on Use Case

- If your application's state logic is simple and unlikely to become complex, the `useState` approach might be more suitable.
- If you anticipate more complex interactions or the state logic becoming more intricate over time, or if you prefer a more structured approach to state management, `useReducer` would be the better choice.

Both are valid in the React ecosystem, and the choice largely depends on the specific needs and complexity of your application.

## TypeScript: `type` vs `interface`

In TypeScript, both `type` and `interface` can be used to define shapes of data, like objects, and they have similar capabilities with some differences. The choice between using `type` and `interface` often comes down to preferences and specific use cases. Here's a comparison to help you decide which to use:

### Interface

- **Extensible**: Interfaces are open-ended, meaning they can be extended by declaring the same interface multiple times or by extending other interfaces. This is particularly useful for defining object shapes that might be extended or merged in different parts of your codebase.
- **Merging**: Automatically merges declarations with the same name.
- **Intended for Objects**: Historically, interfaces have been the preferred way to define object shapes, especially when working with classes or objects that implement specific contracts.
- **Extending Classes**: Interfaces are ideal for defining public contracts of classes, including methods and properties.

### Type

- **Versatility**: Types can represent not just object shapes, but also unions, intersections, primitives, tuples, and more. This makes them more versatile.
- **Mapped Types**: Types are necessary for creating mapped types, where the properties of an object type are transformed or restricted.
- **Unions and Intersections**: Types can easily express unions and intersections, making them powerful for combining types in complex ways.
- **No Declaration Merging**: Unlike interfaces, type aliases cannot be reopened to add new properties. Each type is defined once and cannot be modified or extended.

### Which to Use?

- **Preference for Interfaces**: If you're defining object shapes that you plan to extend or expect to be implemented by classes, interfaces are usually recommended. They offer a more OOP (Object-Oriented Programming) approach and are more suitable for these scenarios.
- **Use Type for Complex Types**: When you need to define unions, intersections, tuples, or want to use mapped types, `type` is your go-to.

### Practical Advice

- Use interfaces when you are designing large-scale application structures that rely on object-oriented design principles.
- Use types when dealing with complex type logic that might involve unions, intersections, or mapped types.
- Consider consistency in your project. If your team or project has a preference, stick with it unless there's a specific reason to do otherwise.
- TypeScript is designed to allow both `type` and `interface` to coexist, so you can mix and match them as your project needs evolve.

In summary, both `type` and `interface` are powerful constructs in TypeScript, and your choice should depend on the specific needs of your project and personal or team preferences.
