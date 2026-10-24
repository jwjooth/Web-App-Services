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

func Failure(w http.ResponseWriter, r *http.Request, log *slog.Logger, err error) {
	status, code, message := http.StatusInternalServerError, "internal_error", "An unexpected error occurred"
	if errors.Is(err, ErrUnavailable) {
		status, code, message = http.StatusServiceUnavailable, "unavailable", "Database unavailable"
	} else {
		log.ErrorContext(r.Context(), "request failed", "error", err)
	}
	JSON(w, status, errorResponse{Error: Error{Code: code, Message: message}})
}

func NotFound(w http.ResponseWriter, _ *http.Request) {
	JSON(w, http.StatusNotFound, errorResponse{Error: Error{Code: "not_found", Message: "Resource not found"}})
}

func MethodNotAllowed(w http.ResponseWriter, _ *http.Request) {
	JSON(w, http.StatusMethodNotAllowed, errorResponse{Error: Error{Code: "method_not_allowed", Message: "Method not allowed"}})
}
