# Authentication & Authorization

## Authentication
- Handled by NextAuth.js (`next-auth@beta`).
- **Provider**: Google OAuth only.
- **Session Strategy**: JWT (JSON Web Tokens) stored in HTTP-only cookies.
- **Database Sync**: On first sign-in, a new `profiles` row is created in Neon DB.

## Authorization (RBAC)
- **Roles**: `user`, `creator`, `admin`.
- Role is fetched from DB during JWT callback and injected into the session.
- **Middleware Protection** (`src/middleware.ts`):
  - `/admin/*`: Requires `admin` role.
  - `/creator/*`: Requires `creator` or `admin` role.
  - `/dashboard/*`: Requires any authenticated session.

## Flow
1. User clicks "Sign In with Google".
2. Google OAuth callback triggers `signIn` in `src/lib/auth.ts`.
3. Checks DB for existing email. If none, inserts new profile.
4. `jwt` callback reads role from DB and adds to token.
5. `session` callback exposes role to the client.
