# Architecture

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: Neon PostgreSQL (via `pg`)
- **Storage**: Backblaze B2 (S3-compatible API via `@aws-sdk/client-s3`)
- **Authentication**: Google OAuth (via NextAuth.js / `@auth/core`)
- **Styling**: CSS Modules + Vanilla CSS
- **Deployment**: Vercel

## System Design
1. **Frontend**: Next.js App Router for Server-Side Rendering (SSR) and Static Site Generation (SSG). 
2. **Backend**: Next.js API Routes (`/api/*`) and Server Actions.
3. **Database Layer**: Direct connection to Neon PostgreSQL using connection pooling (`src/lib/db.ts`).
4. **Storage Layer**: Direct S3 client connection to Backblaze B2 for handling assets (logos, resumes) (`src/lib/storage.ts`).
5. **Auth Layer**: NextAuth.js handling Google OAuth, managing sessions via cookies, and storing user profiles in Neon (`src/lib/auth.ts`).

## Directory Structure
- `src/app`: App Router pages, layouts, and API routes.
- `src/components`: Reusable UI components (layout, jobs, admin, etc.).
- `src/lib`: Core utilities (db, auth, storage, constants, types).
- `src/styles`: CSS variables, globals, and component-specific modules.
