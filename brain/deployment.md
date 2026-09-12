# Deployment & Infrastructure

## Hosting
- **Provider**: Vercel.
- **Strategy**: Vercel handles Next.js SSR, ISR, and Edge caching automatically.

## Environment Variables
Required for production:
- `DATABASE_URL`: Neon connection string.
- `NEXTAUTH_URL`: Canonical URL.
- `NEXTAUTH_SECRET`: Random 32-byte string.
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials.
- `B2_ENDPOINT`, `B2_KEY_ID`, `B2_APPLICATION_KEY`, `B2_BUCKET_NAME`, `B2_REGION`: Backblaze S3 credentials.

## Next.js Config
- `next.config.ts` allows images from `lh3.googleusercontent.com` (Google avatars) and the configured Backblaze B2 bucket domain.
- Server Actions body size limit increased for potential file uploads.
