package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"shop/internal/config"
	"shop/internal/handler"
	"shop/internal/repository"
	"shop/internal/server"
)

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stderr, nil))
	if err := run(log); err != nil {
		log.Error("server stopped", "error", err)
		os.Exit(1)
	}
}

func initialize(c config.Config, log *slog.Logger) (*http.Server, func(), error) {
	db, cleanup, err := repository.Open(c)
	if err != nil {
		return nil, nil, err
	}
	health := handler.NewHealth(db, log)
	return server.New(c, health, log), cleanup, nil
}

func run(log *slog.Logger) error {
	c, err := config.Load()
	if err != nil {
		return err
	}
	srv, cleanup, err := initialize(c, log)
	if err != nil {
		return err
	}
	defer cleanup()
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()
	result := make(chan error, 1)
	go func() {
		log.Info("server listening", "address", c.Address)
		result <- srv.ListenAndServe()
	}()
	select {
	case err := <-result:
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return err
	case <-ctx.Done():
		shutdown, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := srv.Shutdown(shutdown); err != nil {
			_ = srv.Close()
			return err
		}
		return nil
	}
}
