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

type UploadHandler struct {
	storage  *storage.LocalStorage
	redis    *storage.RedisStorage
	producer *kafka.Producer
}

func NewUploadHandler(store *storage.LocalStorage, redisStore *storage.RedisStorage, prod *kafka.Producer) *UploadHandler {
	return &UploadHandler{
		storage:  store,
		redis:    redisStore,
		producer: prod,
	}
}

func (h *UploadHandler) HandleImageCompress(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving the file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	qualityStr := r.FormValue("quality")
	if qualityStr == "" {
		qualityStr = "80"
	}

	ext := filepath.Ext(handler.Filename)
	uniqueName := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)

	savedPath, err := h.storage.SaveFile(uniqueName, file)
	if err != nil {
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	jobID := fmt.Sprintf("job_%d", time.Now().UnixNano())
	
	// Init job in Redis
	h.redis.SaveJob(r.Context(), &storage.JobStatus{
		ID:     jobID,
		Status: "PENDING",
		Tool:   "image-compress",
	})

	// Publish to Kafka
	h.producer.PublishJob(r.Context(), kafka.JobMessage{
		JobID:      jobID,
		Tool:       "image-compress",
		InputPaths: []string{savedPath},
		Params:     map[string]string{"quality": qualityStr, "original_name": handler.Filename},
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"job_id": jobID})
}
