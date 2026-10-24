SHELL := /bin/sh

ifneq (,$(wildcard .env))
include .env
export
endif

.PHONY: run build fmt vet lint test gate migrate migrate-down wire tools

run:
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

gate: fmt vet lint test build
	@test -z "$$(cd backend && gofmt -l $$(find . -name '*.go'))"

migrate:
	migrate -path backend/migrations -database "$(DATABASE_URL)" up

migrate-down:
	migrate -path backend/migrations -database "$(DATABASE_URL)" down 1

wire:
	cd backend && wire ./cmd/api

tools:
	go install github.com/google/wire/cmd/wire@v0.7.0
	go install -tags postgres github.com/golang-migrate/migrate/v4/cmd/migrate@v4.19.0
	go install github.com/golangci/golangci-lint/v2/cmd/golangci-lint@v2.15.0
