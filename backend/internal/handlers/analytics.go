package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/pratyakshkwatra/toolbox/backend/internal/storage"
)

type AnalyticsHandler struct {
	db *storage.DB
}

func NewAnalyticsHandler(db *storage.DB) *AnalyticsHandler {
	return &AnalyticsHandler{db: db}
}

type TrackRequest struct {
	EventType string `json:"event_type"`
	ToolSlug  string `json:"tool_slug"`
}

func (h *AnalyticsHandler) HandleTrack(w http.ResponseWriter, r *http.Request) {
	var req TrackRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	event := storage.AnalyticsEvent{
		ID:        fmt.Sprintf("evt_%d", time.Now().UnixNano()),
		EventType: req.EventType,
		ToolSlug:  req.ToolSlug,
		CreatedAt: time.Now(),
	}

	// Fire and forget, don't block the request
	go h.db.Create(&event)

	w.WriteHeader(http.StatusAccepted)
}

func (h *AnalyticsHandler) HandlePopular(w http.ResponseWriter, r *http.Request) {
	var results []struct {
		ToolSlug string `json:"tool_slug"`
		Count    int    `json:"count"`
	}

	// Group by tool slug and count occurrences, order by count descending
	h.db.Model(&storage.AnalyticsEvent{}).
		Select("tool_slug, count(*) as count").
		Where("tool_slug != ''").
		Group("tool_slug").
		Order("count desc").
		Scan(&results)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}
