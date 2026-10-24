# Shop MVP

## Current status

Milestone 1 code is implemented: Go skeleton, SQL schema, health endpoint and Wire dependency injection.
The Go gate (gofmt, vet, golangci-lint, tests, build) passes.
Live database verification is blocked: Docker Hub rejects the `postgres:17-alpine` pull with
`toomanyrequests` (anonymous pull rate limit). Migrations and real-database health checks
have **not** been verified. No subsequent milestone has been started, preserving the milestone gate protocol.
Authentication, catalog, checkout, and the Next.js frontend are not implemented yet.
The existing root Vite scaffold is preserved for the host preview; it is not the MVP frontend.

## Prerequisites

Go 1.27 (latest stable at implementation), Docker Compose, Make, and Go's bin directory on `PATH`.
Install the Wire, golang-migrate and golangci-lint CLIs with `make tools`.

## Local backend setup

1. `cp .env.example .env` — replace password and JWT placeholders; keep the password in `DATABASE_URL` consistent.
2. `make tools`
3. `docker compose up -d --wait`
4. `make migrate`
5. `make run`

The API listens on `:8080`. `GET /api/v1/healthz` returns `{"status":"ok"}` when PostgreSQL is reachable,
or a JSON error with HTTP 503 when unavailable. Send SIGINT/SIGTERM for graceful shutdown.
Use `sslmode=require` and strong generated credentials outside local development.

## Development

- `make gate`: gofmt, go vet, golangci-lint, all Go tests, and build.
- `make wire`: regenerate dependency injection after changing providers.
- `make migrate-down`: roll back one migration (destructive; development only).

Migrations never run automatically. GORM AutoMigrate is not used.
See `DECISIONS.md` for architecture choices.

## Next step

Once Docker Hub access is available (or the official `postgres:17-alpine` image is preloaded),
run `docker compose up -d --wait`, `make migrate`, and `make run`; confirm the health response,
then proceed with milestone 2. No application feature is mocked or presented as complete.
