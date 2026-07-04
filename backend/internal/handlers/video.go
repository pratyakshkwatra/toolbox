package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"github.com/pratyakshkwatra/toolbox/backend/internal/kafka"
	"github.com/pratyakshkwatra/toolbox/backend/internal/storage"
)

type VideoHandler struct {
	storage  *storage.LocalStorage
	redis    *storage.RedisStorage
	producer *kafka.Producer
}

func NewVideoHandler(store *storage.LocalStorage, redisStore *storage.RedisStorage, prod *kafka.Producer) *VideoHandler {
	return &VideoHandler{
		storage:  store,
		redis:    redisStore,
		producer: prod,
	}
}

func (h *VideoHandler) HandleVideoTrim(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(500 << 20)

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving the file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	startTime := r.FormValue("startTime")
	endTime := r.FormValue("endTime")

	if startTime == "" || endTime == "" {
		http.Error(w, "startTime and endTime are required", http.StatusBadRequest)
		return
	}

	ext := filepath.Ext(handler.Filename)
	uniqueName := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)

	savedPath, err := h.storage.SaveFile(uniqueName, file)
	if err != nil {
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	jobID := fmt.Sprintf("job_%d", time.Now().UnixNano())
	
	h.redis.SaveJob(r.Context(), &storage.JobStatus{
		ID:     jobID,
		Status: "PENDING",
		Tool:   "video-trim",
	})

	h.producer.PublishJob(r.Context(), kafka.JobMessage{
		JobID:      jobID,
		Tool:       "video-trim",
		InputPaths: []string{savedPath},
		Params:     map[string]string{"startTime": startTime, "endTime": endTime, "original_name": handler.Filename},
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"job_id": jobID})
}
