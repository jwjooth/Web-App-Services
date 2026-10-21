SHELL := /bin/sh

ifneq (,$(wildcard .env))
include .env
export
endif

# The API and the database share one password: POSTGRES_PASSWORD in .env.
# ponytail: a password with '#', '$' or spaces cannot pass through Make; use a
# base64 password (openssl rand -base64 18).
export DATABASE_URL := postgres://shop:$(POSTGRES_PASSWORD)@localhost:5432/shop?sslmode=disable

.PHONY: run build fmt vet lint test gate migrate migrate-down tools check-env

check-env:
	@test -n "$(POSTGRES_PASSWORD)" || { echo "POSTGRES_PASSWORD is missing: copy .env.example to .env"; exit 1; }

run: check-env
	cd backend && go run ./cmd/api

build:
	cd backend && go build ./...

fmt:
	cd backend && gofmt -w $$(find . -name '*.go')

vet:
	cd backend && go vet ./...

lint:
	cd backend && golangci-lint run ./...

test:
	cd backend && go test ./...

gate: vet lint test build
	@test -z "$$(cd backend && gofmt -l $$(find . -name '*.go'))" || { echo "gofmt needed: run make fmt"; exit 1; }

migrate: check-env
	migrate -path backend/migrations -database "$(DATABASE_URL)" up

migrate-down: check-env
	migrate -path backend/migrations -database "$(DATABASE_URL)" down 1

tools:
	go install -tags postgres github.com/golang-migrate/migrate/v4/cmd/migrate@v4.19.0
	go install github.com/golangci/golangci-lint/v2/cmd/golangci-lint@v2.15.0
