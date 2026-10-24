# figma-make-app

Two concerns share this repo:

1. Root Vite + React + Tailwind scaffold — Figma Make host preview (preserved, not the MVP frontend).
2. `backend/` — Go Milestone 1 skeleton (Go, Wire DI, SQL migrations, PostgreSQL; DB verification blocked by Docker Hub rate limit).

## Root: Vite frontend (React 19, Tailwind v4, Vite 8)

- Dev server runs on `$PORT` (default 8443), host `0.0.0.0`, `strictPort: true`. It is managed by Figma Make; don't add a separate start script.
- Scripts (run with bun): `bun run dev`, `bun run build`, `bun run preview`, `bun run format`. Install deps with `bun install`.
- Entry: `src/main.tsx` mounts `src/App.tsx` into `#root` in `index.html`; imports `src/index.css`.
- Alias: `@` → `src` (vite.config.ts, tsconfig.json).
- Global CSS/Tailwind v4 theme customization goes in `src/index.css`; `@import 'tailwindcss';` must stay first. Put element resets in `@layer base`.
- Export components as default exports.
- No test runner configured for the frontend.

## Backend: Go app (`backend/`)

Go 1.27, Docker Compose, Make, and Go's bin directory on `PATH` are required. Install dev CLIs with `make tools` (wire, migrate, golangci-lint).

Setup order:
1. `cp .env.example .env` — replace password/JWT placeholders; keep `DATABASE_URL` password consistent.
2. `make tools`
3. `docker compose up -d --wait` (PostgreSQL 17 on `127.0.0.1:5432`)
4. `make migrate` (migrations never run automatically; GORM AutoMigrate is not used)
5. `make run` — API on `:8080`; `GET /api/v1/healthz` returns `{"status":"ok"}` or HTTP 503 when DB is unreachable.

Commands:
- `make gate` — gofmt, go vet, golangci-lint, `go test ./...`, `go build ./...` (then verifies no gofmt diff).
- `make wire` — regenerate DI after changing providers in `backend/cmd/api`; generated wiring is committed.
- `make migrate-down` — roll back one migration (destructive, dev only).
- `make fmt` / `make vet` / `make lint` / `make test` / `make build` / `make run` individually.

Backend layout: `backend/cmd/api` (entrypoint), `backend/internal/{config,handler,repository,server}`, `backend/migrations/`. Wire providers live in `backend/cmd/api`.

Gotchas:
- Docker Hub rejects `postgres:17-alpine` pulls (anonymous rate limit) — live DB verification is blocked until the image is preloaded or access is restored.
- `.env` is gitignored; `.env.example` has placeholders only. Make loads `.env` and exports it.
- `make gate` requires all Make tools installed first.

## Precedence

`CLAUDE.md` just references this file (`@AGENTS.md`). If docs conflict with the Makefile or `package.json` scripts, trust the executable config.
