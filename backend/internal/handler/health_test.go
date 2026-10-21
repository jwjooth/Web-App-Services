package handler

import (
	"bytes"
	"context"
	"errors"
	"io"
	"log/slog"
	"net/http/httptest"
	"strings"
	"testing"
)

type fakePinger struct {
	err   error
	calls int
}

func (p *fakePinger) PingContext(context.Context) error {
	p.calls++
	return p.err
}

func TestHealth(t *testing.T) {
	for _, tt := range []struct {
		name string
		err  error
		want int
		body string
	}{
		{"healthy", nil, 200, "{\"status\":\"ok\"}\n"},
		{"unavailable", errors.New("private database error"), 503, "{\"error\":{\"code\":\"unavailable\",\"message\":\"Database unavailable\"}}\n"},
	} {
		t.Run(tt.name, func(t *testing.T) {
			h := NewHealth(&fakePinger{err: tt.err}, slog.New(slog.NewJSONHandler(io.Discard, nil)))
			w := httptest.NewRecorder()
			h.ServeHTTP(w, httptest.NewRequest("GET", "/api/v1/healthz", nil))
			if w.Code != tt.want || w.Body.String() != tt.body {
				t.Fatalf("got %d %s; want %d %s", w.Code, w.Body.String(), tt.want, tt.body)
			}
		})
	}
}

// A successful ping is reused for the cache window; a failure is retried and logged.
func TestHealthCaching(t *testing.T) {
	pinger := &fakePinger{}
	logs := &bytes.Buffer{}
	h := NewHealth(pinger, slog.New(slog.NewJSONHandler(logs, nil)))

	for i := 0; i < 3; i++ {
		w := httptest.NewRecorder()
		h.ServeHTTP(w, httptest.NewRequest("GET", "/api/v1/healthz", nil))
		if w.Code != 200 {
			t.Fatalf("status = %d, want 200", w.Code)
		}
	}
	if pinger.calls != 1 {
		t.Fatalf("database was pinged %d times, want 1 inside the cache window", pinger.calls)
	}

	pinger.err = errors.New("connection refused")
	fresh := &fakePinger{err: pinger.err}
	logs.Reset()
	h = NewHealth(fresh, slog.New(slog.NewJSONHandler(logs, nil)))
	for i := 0; i < 2; i++ {
		w := httptest.NewRecorder()
		h.ServeHTTP(w, httptest.NewRequest("GET", "/api/v1/healthz", nil))
		if w.Code != 503 {
			t.Fatalf("status = %d, want 503", w.Code)
		}
	}
	if fresh.calls != 2 {
		t.Fatalf("a failure was cached: the database was pinged %d times, want 2", fresh.calls)
	}
	if !strings.Contains(logs.String(), "connection refused") {
		t.Fatalf("the database error must be logged, got: %s", logs.String())
	}
}
