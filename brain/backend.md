# Backend & APIs

## Server Capabilities
- Embedded within Next.js via App Router.
- Uses Server Components for direct database reads during rendering.
- Uses Route Handlers (`src/app/api/*`) for client-side API requests.
- Uses Server Actions for form mutations (planned).

## Integrations
- **Neon PostgreSQL**: Via `src/lib/db.ts` (`pg` package).
- **Backblaze B2**: Via `src/lib/storage.ts` (`@aws-sdk/client-s3`). Used for storing images and documents.
- **Google OAuth**: Via `src/lib/auth.ts` (`next-auth`).

## Data Flow
- **Read**: Next.js Server Component -> `src/lib/db.ts` -> Neon DB -> Render HTML.
- **Write (API)**: Client -> Route Handler -> Auth Check -> `src/lib/db.ts` -> Neon DB.
- **File Upload**: Client -> Route Handler -> Auth Check -> `src/lib/storage.ts` -> Backblaze B2.
