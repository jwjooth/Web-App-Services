# Decisions

- Keep the existing Vite preview untouched and place the requested Go and Next.js applications in `backend/` and `frontend/`; this preserves host tooling without substituting Vite for the requested stack.
- Use PostgreSQL 17 with SQL-only migrations; a stable supported database release is sufficient for this MVP.
- Use BIGINT minor-unit money and identity IDs; integer arithmetic avoids floating-point rounding and requires no UUID dependency.
- Start name search with the requested plain B-tree index; a trigram extension needs measured search performance to justify it.
- Product foreign keys restrict deletion after purchase; order snapshots remain auditable and products can instead be deactivated.
- Health checks ping PostgreSQL with a two-second deadline; a live HTTP process alone does not establish readiness.
- API configuration requires the JWT secret from milestone 1; startup validates all mandatory deployment settings before serving traffic.
- Use a cryptographically generated request ID rather than a client-supplied ID; untrusted headers cannot inject identifiers into logs.
- GORM's transitive pgx driver handles PostgreSQL access; no second database client is added.
- Google Wire is retained as requested despite its archived upstream status; generated dependency wiring is committed and needs no runtime framework.
- Local environment values are loaded by Make, not an extra dotenv dependency; `.env.example` contains placeholders only.
- Pin development CLI versions, including golangci-lint 2.15.0; reproducible gates should not drift with upstream releases.
- Stop at milestone 1 while the official PostgreSQL image cannot be pulled due to Docker Hub's anonymous rate limit; advancing would leave database startup and SQL migrations unverified.
