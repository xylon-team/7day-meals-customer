# 7 Day Meals Customer

Customer-facing Next.js app for 7 Day Meals.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Folder Structure

```text
7day-meals-customer/
+-- app/
|   +-- components/
|   |   +-- .gitkeep
|   +-- lib/
|   |   +-- .gitkeep
|   +-- pages/
|   |   +-- login/
|   |   |   +-- assets/
|   |   |   |   +-- .gitkeep
|   |   |   +-- components/
|   |   |   |   +-- .gitkeep
|   |   |   +-- LoginPage.tsx
|   |   +-- overview/
|   |       +-- .gitkeep
|   +-- utils/
|   |   +-- .gitkeep
|   +-- favicon.ico
|   +-- globals.css
|   +-- layout.tsx
|   +-- page.tsx
+-- public/
|   +-- file.svg
|   +-- globe.svg
|   +-- next.svg
|   +-- vercel.svg
|   +-- window.svg
+-- .gitignore
+-- AGENTS.md
+-- CLAUDE.md
+-- eslint.config.mjs
+-- next-env.d.ts
+-- package.json
+-- package-lock.json
+-- next.config.ts
+-- postcss.config.mjs
+-- tsconfig.json
```

Generated folders such as `.next/` and `node_modules/` are not shown.

## Directory Notes

- `app/components/` contains shared UI components used across multiple pages.
- `app/lib/` contains shared library code, service clients, and data helpers.
- `app/pages/login/` contains login page files.
- `app/pages/login/assets/` contains assets used only by the login page.
- `app/pages/login/components/` contains components used only by the login page.
- `app/pages/overview/` contains overview page files.
- `app/utils/` contains shared utility functions.
- `public/` contains static assets served from the site root.

## .gitkeep Files

Git does not track empty folders. The `.gitkeep` files keep planned empty folders in the repository until real files are added. When a directory contains actual tracked files, the matching `.gitkeep` file can be removed.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)

## Deploy on Vercel

The easiest way to deploy this app is with the [Vercel Platform](https://vercel.com/new).

## Repository Rules for Staff

### Branching Strategy

- The repository has two primary branches: `main` and `dev`.
- **Development**: All new features, bug fixes, and changes must be implemented by creating a new branch based off the `dev` branch.
- **Merging**: Once your implementation is complete and tested, merge your branch back into the `dev` branch.
- **Deployment**: The `main` branch is strictly reserved for deployment. Merges into `main` are handled only after all features are completed and validated in `dev`.

### Branch Naming Conventions

Please use descriptive branch names that indicate the purpose of the branch. We recommend the following prefixes:
- `feat/` for new features (e.g., `feat/login-page`)
- `fix/` for bug fixes (e.g., `fix/header-styling`)
- `chore/` for maintenance tasks (e.g., `chore/update-dependencies`)
- `docs/` for documentation changes

### Commit Message Conventions

We follow conventional commits to maintain a readable and organized project history. Each commit message should start with a specific type:

- `feat:` A new feature
- `fix:` A bug fix
- `chore:` Changes to the build process or auxiliary tools and libraries (no production code change)
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `test:` Adding missing tests or correcting existing tests

Example: `feat: add login form validation`
