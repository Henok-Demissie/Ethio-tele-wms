Development notes: setting DATABASE_URL

This project falls back to a mock database client when `DATABASE_URL` is not set. That helps local development and prevents build-time failures when a real database is not available, but it can also cause different runtime behavior during `next build` (static prerendering may run server code that expects certain relations to exist).

To run a build that uses a real database connection, set `DATABASE_URL` to your Neon/Postgres pooler URL (or other supported connection string) before running `npm run build`.

Windows cmd example (one-off):

```
set "DATABASE_URL=your_neon_pooler_url"
npm run build
```

Or create a `.env.neon` file in the project root with the connection string:

```
DATABASE_URL=your_neon_pooler_url
```

Notes:
- For CI/CD or hosting (Vercel, Netlify), set `DATABASE_URL` in the environment variables for preview and production builds.
- If you prefer to keep using the mock data during local builds, the project includes defensive guards in API routes to avoid throwing when relations are missing.
