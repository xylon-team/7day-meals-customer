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
