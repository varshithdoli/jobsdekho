# Database

## Overview
Powered by Neon PostgreSQL. Connected via `pg` library with connection pooling.

## Schema Highlights
- **profiles**: Users, admins, creators. Stores role and creator status.
- **jobs**: Job listings with extensive metadata (category, salary, deadlines, editorial content).
- **bookmarks**: User-saved jobs.
- **reports**: User reports for scams/incorrect info.
- **creator_submissions**: Tracking workflow for creator-submitted jobs.
- **analytics_events**: Tracking page views, clicks, shares.
- **audit_logs**: Admin action tracking.
- **contact_messages**: Support messages.

## Security & Access Control
- Passwords are not stored (Google OAuth used).
- Route protection enforced via Next.js middleware checking session roles.
- SQL injection prevented using parameterized queries in `src/lib/db.ts`.

## Connection Management
- `src/lib/db.ts` exports `query`, `queryOne`, `execute`, and `transaction` helpers utilizing a `Pool`.
- Configured with `ssl: { rejectUnauthorized: true }` for Neon.
