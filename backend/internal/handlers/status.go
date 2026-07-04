package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/pratyakshkwatra/toolbox/backend/internal/storage"
)

type StatusHandler struct {
	redis *storage.RedisStorage
}

func NewStatusHandler(redis *storage.RedisStorage) *StatusHandler {
	return &StatusHandler{redis: redis}
}

func (h *StatusHandler) HandleGetStatus(w http.ResponseWriter, r *http.Request) {
	jobID := chi.URLParam(r, "job_id")
	if jobID == "" {
		http.Error(w, "job_id is required", http.StatusBadRequest)
		return
	}

	job, err := h.redis.GetJob(r.Context(), jobID)
	if err != nil {
		http.Error(w, "Job not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(job)
}
