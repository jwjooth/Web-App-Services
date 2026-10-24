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

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func New(c config.Config, health *handler.Health, log *slog.Logger) *http.Server {
	r := chi.NewRouter()
	r.Use(requestID)
	r.Use(accessLog(log))
	r.Use(cors(c.FrontendOrigin))
	r.Use(recoverer(log))
	r.NotFound(handler.NotFound)
	r.MethodNotAllowed(handler.MethodNotAllowed)
	r.Get("/api/v1/healthz", health.ServeHTTP)
	return &http.Server{
		Addr:              c.Address,
		Handler:           r,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    1 << 20,
	}
}

type requestIDKey struct{}

func requestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var bytes [16]byte
		if _, err := rand.Read(bytes[:]); err != nil {
			handler.JSON(w, http.StatusInternalServerError, map[string]interface{}{"error": handler.Error{Code: "internal_error", Message: "Could not create request ID"}})
			return
		}
		id := hex.EncodeToString(bytes[:])
		w.Header().Set("X-Request-ID", id)
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), requestIDKey{}, id)))
	})
}

func accessLog(log *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)
			start := time.Now()
			next.ServeHTTP(ww, r)
			log.InfoContext(r.Context(), "http request", "request_id", r.Context().Value(requestIDKey{}),
				"method", r.Method, "path", r.URL.Path, "status", ww.Status(), "duration", time.Since(start))
		})
	}
}

func recoverer(log *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if value := recover(); value != nil {
					log.ErrorContext(r.Context(), "request panic", "request_id", r.Context().Value(requestIDKey{}), "panic", value)
					handler.JSON(w, http.StatusInternalServerError, map[string]interface{}{"error": handler.Error{Code: "internal_error", Message: "An unexpected error occurred"}})
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}

func cors(origin string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Vary", "Origin")
			if requestOrigin := r.Header.Get("Origin"); requestOrigin != "" {
				if requestOrigin != origin {
					handler.JSON(w, http.StatusForbidden, map[string]interface{}{"error": handler.Error{Code: "forbidden_origin", Message: "Origin not allowed"}})
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
