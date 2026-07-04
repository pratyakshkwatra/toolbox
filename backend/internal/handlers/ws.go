package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/gorilla/websocket"
	"github.com/pratyakshkwatra/toolbox/backend/internal/storage"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // In production, restrict to cfg.FrontendURL
	},
}

type WSHandler struct {
	redis *storage.RedisStorage
}

func NewWSHandler(redis *storage.RedisStorage) *WSHandler {
	return &WSHandler{redis: redis}
}

func (h *WSHandler) HandleJobWebSocket(w http.ResponseWriter, r *http.Request) {
	jobID := chi.URLParam(r, "job_id")
	if jobID == "" {
		http.Error(w, "job_id is required", http.StatusBadRequest)
		return
	}

	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer c.Close()

	// First, fetch current state and send it immediately
	job, err := h.redis.GetJob(r.Context(), jobID)
	if err == nil {
		c.WriteJSON(job)
		if job.Status == "COMPLETED" || job.Status == "FAILED" {
			return
		}
	}

	// Subscribe to Redis Pub/Sub for realtime updates
	pubsub := h.redis.SubscribeJobUpdates(r.Context(), jobID)
	defer pubsub.Close()

	// Setup a context that cancels when the client disconnects or timeout
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Hour)
	defer cancel()

	// Listen for close from client
	go func() {
		for {
			if _, _, err := c.NextReader(); err != nil {
				cancel()
				break
			}
		}
	}()

	ch := pubsub.Channel()

	for {
		select {
		case <-ctx.Done():
			return
		case msg := <-ch:
			var updatedJob storage.JobStatus
			if err := json.Unmarshal([]byte(msg.Payload), &updatedJob); err == nil {
				err = c.WriteJSON(updatedJob)
				if err != nil {
					return
				}
				if updatedJob.Status == "COMPLETED" || updatedJob.Status == "FAILED" {
					return // Close connection when done
				}
			}
		}
	}
}
