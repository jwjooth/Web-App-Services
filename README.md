# Shop MVP

## Current status

Milestone 1 code is implemented and verified: Go skeleton, SQL schema, health endpoint, and the
API running as a container next to PostgreSQL. The Go gate (gofmt, vet, golangci-lint, tests,
build) passes. The migration has been applied and rolled back against a real PostgreSQL 17, and
`GET /api/v1/healthz` was checked with the database up and with it stopped.
Authentication, catalog, checkout, and the Next.js frontend are not implemented yet.
The existing root Vite scaffold is preserved for the host preview; it is not the MVP frontend
and it shows a placeholder notice, not a storefront.

## Prerequisites

Go 1.27, Docker Compose, Make, and Go's bin directory on `PATH`.
Install the golang-migrate and golangci-lint CLIs with `make tools`.

## Local backend setup

1. `cp .env.example .env` — set `POSTGRES_PASSWORD` to a random value. It must not contain `#`,
   `$` or spaces; `openssl rand -base64 18` gives a value that works. The Makefile and
   `compose.yaml` build `DATABASE_URL` from this one password, so it cannot get out of sync.
2. `make tools`
3. `docker compose up -d --wait` — starts PostgreSQL and the API container.
4. `make migrate` — applies the SQL migrations. They never run automatically.
5. `make run` — runs the API on the host instead of in the container (stop the `api` service
   first, it uses the same port).

The API listens on `:8080`. `GET /api/v1/healthz` returns `{"status":"ok"}` when PostgreSQL is
reachable, or a JSON error with HTTP 503 when unavailable; the reason for the failure is in the
server log, never in the response. A successful check is reused for five seconds so probes do
not hit the database every time. Send SIGINT/SIGTERM for graceful shutdown.
Use `sslmode=require` and strong generated credentials outside local development.

## Development

- `make gate`: gofmt check, go vet, golangci-lint, all Go tests, and build. The gate fails on
  unformatted code instead of rewriting it; run `make fmt` to fix.
- `make migrate-down`: roll back one migration (destructive; development only).

Migrations never run automatically. GORM AutoMigrate is not used.
See `DECISIONS.md` for architecture choices.

## Next step

Milestone 2: authentication (the JWT secret setting comes back with it), catalog and checkout.
The storefront frontend does not exist yet; the Vite app in the root is host tooling.
