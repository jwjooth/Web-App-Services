package handler

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
)

type Error struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type errorResponse struct {
	Error Error `json:"error"`
}

var ErrUnavailable = errors.New("service unavailable")

func JSON(w http.ResponseWriter, status int, value interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

// ErrorJSON writes the standard error body so every failure looks the same.
func ErrorJSON(w http.ResponseWriter, status int, code, message string) {
	JSON(w, status, errorResponse{Error: Error{Code: code, Message: message}})
}

func Failure(w http.ResponseWriter, r *http.Request, log *slog.Logger, err error) {
	if errors.Is(err, ErrUnavailable) {
		ErrorJSON(w, http.StatusServiceUnavailable, "unavailable", "Database unavailable")
		return
	}
	log.ErrorContext(r.Context(), "request failed", "error", err)
	ErrorJSON(w, http.StatusInternalServerError, "internal_error", "An unexpected error occurred")
}

func NotFound(w http.ResponseWriter, _ *http.Request) {
	ErrorJSON(w, http.StatusNotFound, "not_found", "Resource not found")
}

func MethodNotAllowed(w http.ResponseWriter, _ *http.Request) {
	ErrorJSON(w, http.StatusMethodNotAllowed, "method_not_allowed", "Method not allowed")
}
