package handler

import (
	"context"
	"errors"
	"io"
	"log/slog"
	"net/http/httptest"
	"testing"
)

type fakePinger struct{ err error }

func (p fakePinger) PingContext(context.Context) error { return p.err }

type slowPinger struct{}

func (slowPinger) PingContext(ctx context.Context) error {
	<-ctx.Done()
	return ctx.Err()
}

func TestHealth(t *testing.T) {
	for _, tt := range []struct {
		name   string
		pinger Pinger
		want   int
		body   string
	}{
		{"healthy", fakePinger{nil}, 200, "{\"status\":\"ok\"}\n"},
		{"unavailable", fakePinger{errors.New("private database error")}, 503, "{\"error\":{\"code\":\"unavailable\",\"message\":\"Database unavailable\"}}\n"},
		{"stuck", slowPinger{}, 503, "{\"error\":{\"code\":\"unavailable\",\"message\":\"Database unavailable\"}}\n"},
	} {
		t.Run(tt.name, func(t *testing.T) {
			h := NewHealth(tt.pinger, slog.New(slog.NewJSONHandler(io.Discard, nil)))
			w := httptest.NewRecorder()
			h.ServeHTTP(w, httptest.NewRequest("GET", "/api/v1/healthz", nil))
			if w.Code != tt.want || w.Body.String() != tt.body {
				t.Fatalf("got %d %s; want %d %s", w.Code, w.Body.String(), tt.want, tt.body)
			}
		})
	}
}
