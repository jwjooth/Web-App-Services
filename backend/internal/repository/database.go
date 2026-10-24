package repository

import (
	"context"
	"fmt"
	"time"

	"shop/internal/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Open(c config.Config) (*gorm.DB, func(), error) {
	db, err := gorm.Open(postgres.Open(c.DatabaseURL), &gorm.Config{
		Logger:               logger.Default.LogMode(logger.Silent),
		DisableAutomaticPing: true,
	})
	if err != nil {
		return nil, nil, fmt.Errorf("open database: %w", err)
	}
	pool, err := db.DB()
	if err != nil {
		return nil, nil, fmt.Errorf("get database pool: %w", err)
	}
	pool.SetMaxOpenConns(c.DBMaxOpen)
	pool.SetMaxIdleConns(c.DBMaxIdle)
	pool.SetConnMaxLifetime(30 * time.Minute)
	pool.SetConnMaxIdleTime(5 * time.Minute)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := pool.PingContext(ctx); err != nil {
		_ = pool.Close()
		return nil, nil, fmt.Errorf("connect database: %w", err)
	}
	return db, func() { _ = pool.Close() }, nil
}
