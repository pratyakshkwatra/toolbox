package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/pratyakshkwatra/toolbox/backend/internal/kafka"
	"github.com/pratyakshkwatra/toolbox/backend/internal/storage"
)

type PDFHandler struct {
	storage  *storage.LocalStorage
	redis    *storage.RedisStorage
	producer *kafka.Producer
}

func NewPDFHandler(store *storage.LocalStorage, redisStore *storage.RedisStorage, prod *kafka.Producer) *PDFHandler {
	return &PDFHandler{
		storage:  store,
		redis:    redisStore,
		producer: prod,
	}
}

func (h *PDFHandler) HandlePDFMerge(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(50 << 20)
	if err != nil {
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}

	files := r.MultipartForm.File["files"]
	if len(files) < 2 {
		http.Error(w, "At least 2 files are required", http.StatusBadRequest)
		return
	}

	var savedPaths []string

	for i, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Error opening file", http.StatusInternalServerError)
			return
		}

		uniqueName := fmt.Sprintf("%d_%d_%s", time.Now().UnixNano(), i, fileHeader.Filename)
		savedPath, err := h.storage.SaveFile(uniqueName, file)
		file.Close()
		
		if err != nil {
			http.Error(w, "Error saving file", http.StatusInternalServerError)
			return
		}
		
		savedPaths = append(savedPaths, savedPath)
	}

	jobID := fmt.Sprintf("job_%d", time.Now().UnixNano())
	
	h.redis.SaveJob(r.Context(), &storage.JobStatus{
		ID:     jobID,
		Status: "PENDING",
		Tool:   "pdf-merge",
	})

	h.producer.PublishJob(r.Context(), kafka.JobMessage{
		JobID:      jobID,
		Tool:       "pdf-merge",
		InputPaths: savedPaths,
		Params:     map[string]string{},
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"job_id": jobID})
}
