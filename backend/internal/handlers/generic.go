package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/pratyakshkwatra/toolbox/backend/internal/kafka"
	"github.com/pratyakshkwatra/toolbox/backend/internal/storage"
)

type GenericToolHandler struct {
	storage  *storage.LocalStorage
	redis    *storage.RedisStorage
	producer *kafka.Producer
}

func NewGenericToolHandler(store *storage.LocalStorage, redisStore *storage.RedisStorage, prod *kafka.Producer) *GenericToolHandler {
	return &GenericToolHandler{
		storage:  store,
		redis:    redisStore,
		producer: prod,
	}
}

// HandleProcess accepts a file and generic params and forwards them to Kafka based on the tool URL parameter
func (h *GenericToolHandler) HandleProcess(w http.ResponseWriter, r *http.Request) {
	toolName := chi.URLParam(r, "tool")
	if toolName == "" {
		http.Error(w, "tool name is required", http.StatusBadRequest)
		return
	}

	err := r.ParseMultipartForm(500 << 20)
	if err != nil {
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}

	// Extract all generic string params to pass to Kafka
	params := make(map[string]string)
	for key, values := range r.MultipartForm.Value {
		if len(values) > 0 {
			params[key] = values[0]
		}
	}

	// Extract all files (supports single or multi-file tools)
	files := r.MultipartForm.File["file"]
	if len(files) == 0 {
		files = r.MultipartForm.File["files"]
	}

	if len(files) == 0 {
		http.Error(w, "No file provided", http.StatusBadRequest)
		return
	}

	var savedPaths []string

	for i, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Error opening file", http.StatusInternalServerError)
			return
		}

		ext := filepath.Ext(fileHeader.Filename)
		uniqueName := fmt.Sprintf("%d_%d%s", time.Now().UnixNano(), i, ext)
		
		savedPath, err := h.storage.SaveFile(uniqueName, file)
		file.Close()
		
		if err != nil {
			http.Error(w, "Error saving file", http.StatusInternalServerError)
			return
		}
		
		savedPaths = append(savedPaths, savedPath)
	}

	params["original_name"] = files[0].Filename

	jobID := fmt.Sprintf("job_%d", time.Now().UnixNano())
	
	h.redis.SaveJob(r.Context(), &storage.JobStatus{
		ID:     jobID,
		Status: "PENDING",
		Tool:   toolName,
	})

	h.producer.PublishJob(r.Context(), kafka.JobMessage{
		JobID:      jobID,
		Tool:       toolName,
		InputPaths: savedPaths,
		Params:     params,
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"job_id": jobID})
}
