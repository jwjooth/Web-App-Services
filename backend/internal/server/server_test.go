package server

import (
	"context"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"shop/internal/config"
	"shop/internal/handler"
)

type healthyDB struct{}

func (healthyDB) PingContext(context.Context) error { return nil }

func TestRouter(t *testing.T) {
	log := slog.New(slog.NewJSONHandler(io.Discard, nil))
	server := New(config.Config{FrontendOrigin: "http://localhost:3000"}, handler.NewHealth(healthyDB{}, log), log)
	tests := []struct {
		name, method, path, origin string
		status                     int
	}{
		{"health", "GET", "/api/v1/healthz", "", 200},
		{"missing", "GET", "/missing", "", 404},
		{"method", "POST", "/api/v1/healthz", "", 405},
		{"allowed origin", "GET", "/api/v1/healthz", "http://localhost:3000", 200},
		{"denied origin", "GET", "/api/v1/healthz", "https://attacker.example", 403},
		{"preflight", "OPTIONS", "/api/v1/healthz", "http://localhost:3000", 204},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := httptest.NewRequest(tt.method, tt.path, nil)
			r.Header.Set("Origin", tt.origin)
			r.Header.Set("X-Request-ID", "untrusted")
			w := httptest.NewRecorder()
			server.Handler.ServeHTTP(w, r)
			if w.Code != tt.status {
				t.Fatalf("status = %d, want %d: %s", w.Code, tt.status, w.Body.String())
			}
			if id := w.Header().Get("X-Request-ID"); len(id) != 32 || id == "untrusted" {
				t.Fatalf("invalid request ID: %q", id)
			}
			if tt.origin == "http://localhost:3000" && w.Header().Get("Access-Control-Allow-Origin") != tt.origin {
				t.Fatal("missing allowed origin")
			}
			if tt.status != http.StatusNoContent && w.Header().Get("Content-Type") != "application/json" {
				t.Fatal("response must be JSON")
			}
		})
	}
}
