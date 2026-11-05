# My Todo App

![CI](https://github.com/Tetianka28/my-todoapp-3semexam/actions/workflows/ci.yml/badge.svg)

A todo app built with **TypeScript** and **Vite** for the 3rd semester exam.

**Live app:** https://tetianka28.github.io/my-todoapp-3semexam/

## Features

- Add and remove todos
- Toggle a todo as done / not done
- Clear all completed todos
- Priority levels (Low, Medium, High), with the list sorted High first
- Search field that filters todos by text
- Input validation with a red error state for empty todos
- Todos are saved in local storage and survive a page refresh
- JSDoc comments on functions, types and interfaces

## Tech

- TypeScript, Vite
- Vitest (unit tests)
- TestCafé (end-to-end tests)
- GitHub Actions (CI and deployment to GitHub Pages)

## Run locally

```bash
cd todo-app
npm install
npm run dev
```

## Tests

```bash
cd todo-app
npm test          # unit tests (Vitest)
npm run test:e2e  # end-to-end tests (TestCafé, headless Chrome)
```

Every feature has at least two TestCafé test cases (`todo-app/tests/todo.e2e.js`).

## Project structure

```
.github/workflows/   CI and deploy pipelines
todo-app/
  src/main.ts        DOM code and app logic
  src/todos.ts       types and pure functions (sorting, search)
  src/todos.test.ts  unit tests
  tests/             TestCafé end-to-end tests
```

## Workflow

- **Issues:** every feature and task has a GitHub issue
- **Gitflow:** `main`, `develop`, `feature/*` and `release/*` branches
- **Conventional commits:** e.g. `feat(priority): add priority levels with sorting (#5)`
- **Pull requests:** reviewed by a collaborator before merging
- **CI:** unit tests, build and end-to-end tests run on pull requests and pushes to `develop`
- **CD:** merging a release into `main` deploys the app to GitHub Pages
- **Versions:** semantic version tags (latest: `v1.8.0`)

## Note

The first features (toggle, clear completed, local storage, priority, search, JSDoc, unit tests) were merged into `main` before Gitflow was set up. The `develop` branch was introduced afterwards, and the CI, deploy and release work follows Gitflow.