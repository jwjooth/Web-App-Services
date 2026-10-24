//go:build wireinject

package main

import (
	"database/sql"
	"log/slog"
	"net/http"

	"shop/internal/config"
	"shop/internal/handler"
	"shop/internal/repository"
	"shop/internal/server"

	"github.com/google/wire"
	"gorm.io/gorm"
)

func sqlDB(db *gorm.DB) (*sql.DB, error) { return db.DB() }

func initialize(c config.Config, log *slog.Logger) (*http.Server, func(), error) {
	wire.Build(repository.Open, sqlDB, wire.Bind(new(handler.Pinger), new(*sql.DB)), handler.NewHealth, server.New)
	return nil, nil, nil
}
