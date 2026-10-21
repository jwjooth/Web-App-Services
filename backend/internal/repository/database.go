package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"shop/internal/config"

	_ "github.com/jackc/pgx/v5/stdlib"
)

// Open connects to PostgreSQL and returns the pool plus a close function.
func Open(c config.Config) (*sql.DB, func(), error) {
	db, err := sql.Open("pgx", c.DatabaseURL)
	if err != nil {
		return nil, nil, fmt.Errorf("open database: %w", err)
	}
	db.SetMaxOpenConns(c.DBMaxOpen)
	db.SetMaxIdleConns(c.DBMaxIdle)
	db.SetConnMaxLifetime(30 * time.Minute)
	db.SetConnMaxIdleTime(5 * time.Minute)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		_ = db.Close()
		return nil, nil, fmt.Errorf("connect database: %w", err)
	}
	return db, func() { _ = db.Close() }, nil
}
