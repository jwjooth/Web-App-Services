package handler

import (
	"context"
	"log/slog"
	"net/http"
	"sync"
	"time"
)

// healthCacheTTL is how long a successful ping is reused, so probes do not
// hit the database on every request.
const healthCacheTTL = 5 * time.Second

type Pinger interface {
	PingContext(context.Context) error
}

type Health struct {
	db  Pinger
	log *slog.Logger

	mu      sync.Mutex
	checked time.Time
	healthy bool
}

func NewHealth(db Pinger, log *slog.Logger) *Health {
	return &Health{db: db, log: log}
}

func (h *Health) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	if err := h.ping(ctx); err != nil {
		// The reason must reach the log; the client only gets a generic message.
		h.log.ErrorContext(r.Context(), "database health check failed", "error", err)
		Failure(w, r, h.log, ErrUnavailable)
		return
	}
	JSON(w, http.StatusOK, struct {
		Status string `json:"status"`
	}{Status: "ok"})
}

// ping reports whether the database answers. A success is reused for
// healthCacheTTL; a failure is never cached so recovery is seen immediately.
func (h *Health) ping(ctx context.Context) error {
	h.mu.Lock()
	defer h.mu.Unlock()
	if h.healthy && time.Since(h.checked) < healthCacheTTL {
		return nil
	}
	if err := h.db.PingContext(ctx); err != nil {
		h.healthy = false
		h.checked = time.Time{}
		return err
	}
	h.healthy = true
	h.checked = time.Now()
	return nil
}
