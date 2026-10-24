package handler

import (
	"context"
	"log/slog"
	"net/http"
	"time"
)

type Pinger interface {
	PingContext(context.Context) error
}

type Health struct {
	db  Pinger
	log *slog.Logger
}

func NewHealth(db Pinger, log *slog.Logger) *Health {
	return &Health{db: db, log: log}
}

func (h *Health) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	if err := h.db.PingContext(ctx); err != nil {
		Failure(w, r, h.log, ErrUnavailable)
		return
	}
	JSON(w, http.StatusOK, struct {
		Status string `json:"status"`
	}{Status: "ok"})
}
