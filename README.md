# Frankyshots Production

This repository is the foundation for a premium wildlife photography, documentation, and filmmaking portfolio.

## Architecture

- `apps/web`: public-facing marketing and portfolio site built with Next.js and Tailwind CSS.
- `apps/admin`: future admin dashboard for managing species, stories, projects, and media.
- `packages/shared`: shared TypeScript types and schema contracts between the frontend and admin app.
- `packages/db`: Prisma data layer and database schema designed for future CRUD operations without editing website code.

## Content model

The schema is prepared for wildlife categories including Animals, Birds, Snakes, Fish, and Insects.

## Getting started

```bash
npm install
npm run dev:web
```

This is intentionally a project foundation and architecture scaffold before the full website build begins.
