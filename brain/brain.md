# JobsDekho Project Brain

Master index for the JobsDekho project documentation.

## Overview
JobsDekho is a curated, verified job and career opportunities platform for the Indian market. It aims to provide high-quality editorial content for each listing, moving beyond simple job aggregation.

## Knowledge Base
- [Architecture](architecture.md): System design, tech stack, and core patterns.
- [Database](database.md): Schema, connection pooling, and data flow.
- [Authentication & Authorization](auth.md): NextAuth.js setup, roles, and route protection.
- [Frontend](frontend.md): UI components, CSS modules, styling.
- [Backend & APIs](backend.md): API routes, server actions, integrations.
- [Deployment & Infrastructure](deployment.md): Vercel, Neon PostgreSQL, Backblaze B2.

## Coding Conventions
- **Language**: TypeScript/JavaScript (Next.js 16 App Router).
- **Styling**: Vanilla CSS with CSS Modules (No Tailwind).
- **State**: Server Components preferred; client state only where necessary.
- **Data Fetching**: Server-side fetching using `pg` pool.
