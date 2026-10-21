package server

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"log/slog"
	"net/http"
	"time"

	"shop/internal/config"
	"shop/internal/handler"
)

func New(c config.Config, health *handler.Health, log *slog.Logger) *http.Server {
	mux := http.NewServeMux()
	mux.Handle("/api/v1/healthz", onlyGET(http.HandlerFunc(health.ServeHTTP)))
	mux.Handle("/", http.HandlerFunc(handler.NotFound))

	var h http.Handler = mux
	h = recoverer(log)(h)
	h = cors(c.FrontendOrigin)(h)
	h = accessLog(log)(h)
	h = requestID(h)

	return &http.Server{
		Addr:              c.Address,
		Handler:           h,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    1 << 20,
	}
}

// onlyGET answers other methods with the standard JSON error.
func onlyGET(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			handler.MethodNotAllowed(w, r)
			return
		}
		next.ServeHTTP(w, r)
	})
}

type requestIDKey struct{}

func requestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var bytes [16]byte
		if _, err := rand.Read(bytes[:]); err != nil {
			handler.ErrorJSON(w, http.StatusInternalServerError, "internal_error", "Could not create request ID")
			return
		}
		id := hex.EncodeToString(bytes[:])
		w.Header().Set("X-Request-ID", id)
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), requestIDKey{}, id)))
	})
}

// statusWriter remembers the status code for the access log.
type statusWriter struct {
	http.ResponseWriter
	status int
}

func (w *statusWriter) WriteHeader(status int) {
	w.status = status
	w.ResponseWriter.WriteHeader(status)
}

func (w *statusWriter) Write(b []byte) (int, error) {
	if w.status == 0 {
		w.status = http.StatusOK
	}
	return w.ResponseWriter.Write(b)
}

func accessLog(log *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ww := &statusWriter{ResponseWriter: w}
			start := time.Now()
			next.ServeHTTP(ww, r)
			log.InfoContext(r.Context(), "http request", "request_id", r.Context().Value(requestIDKey{}),
				"method", r.Method, "path", r.URL.Path, "status", ww.status, "duration", time.Since(start))
		})
	}
}

func recoverer(log *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if value := recover(); value != nil {
					log.ErrorContext(r.Context(), "request panic", "request_id", r.Context().Value(requestIDKey{}), "panic", value)
					handler.ErrorJSON(w, http.StatusInternalServerError, "internal_error", "An unexpected error occurred")
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}

// ponytail: one allowed origin, set by FRONTEND_ORIGIN. A second frontend needs
// a list of origins and the check to compare against it.
func cors(origin string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Vary", "Origin")
			if requestOrigin := r.Header.Get("Origin"); requestOrigin != "" {
				if requestOrigin != origin {
					handler.ErrorJSON(w, http.StatusForbidden, "forbidden_origin", "Origin not allowed")
					return
				}
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
				if r.Method == http.MethodOptions {
					w.WriteHeader(http.StatusNoContent)
					return
				}
			}
			next.ServeHTTP(w, r)
		})
	}
}
