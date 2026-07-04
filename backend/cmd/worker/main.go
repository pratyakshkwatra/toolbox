package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/pratyakshkwatra/toolbox/backend/internal/config"
	"github.com/pratyakshkwatra/toolbox/backend/internal/kafka"
	"github.com/pratyakshkwatra/toolbox/backend/internal/processor"
	"github.com/pratyakshkwatra/toolbox/backend/internal/storage"
)

func main() {
	cfg := config.Load()

	redisStore := storage.NewRedisStorage(cfg.RedisURL)
	consumer := kafka.NewConsumer([]string{cfg.KafkaBrokers}, "toolbox-jobs", "toolbox-worker-group")
	defer consumer.Close()

	imgProc := processor.NewImageProcessor()
	pdfProc := processor.NewPDFProcessor()
	vidProc := processor.NewVideoProcessor()

	store := storage.NewLocalStorage("./tmp")

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	log.Println("Worker started, waiting for jobs...")

	go func() {
		for {
			job, commit, err := consumer.ReadJob(ctx)
			if err != nil {
				log.Printf("Error reading job: %v", err)
				time.Sleep(1 * time.Second)
				continue
			}

			log.Printf("Processing job: %s (Tool: %s)", job.JobID, job.Tool)

			// Update status to PROCESSING
			redisStore.SaveJob(ctx, &storage.JobStatus{
				ID:     job.JobID,
				Status: "PROCESSING",
				Tool:   job.Tool,
			})

			var resultFile string
			var procErr error

			switch job.Tool {
			case "image-compress":
				q, _ := strconv.Atoi(job.Params["quality"])
				if q == 0 { q = 80 }
				resultFile, procErr = imgProc.Compress(job.InputPaths[0], q)

			case "pdf-merge":
				resultFile, procErr = pdfProc.MergePDFs(job.InputPaths, store.BaseDir)

			case "video-trim":
				resultFile, procErr = vidProc.TrimVideo(job.InputPaths[0], job.Params["startTime"], job.Params["endTime"])

			case "pdf-split":
				resultFile, procErr = pdfProc.SplitPDF(job.InputPaths[0], store.BaseDir)

			case "video-rotate":
				resultFile, procErr = vidProc.RotateVideo(job.InputPaths[0], job.Params["degrees"])

			case "video-to-audio":
				resultFile, procErr = vidProc.ExtractAudio(job.InputPaths[0])

			case "image-resize":
				resultFile, procErr = imgProc.ResizeImage(job.InputPaths[0], job.Params["width"], job.Params["height"])

			case "audio-convert":
				// Initialize audio processor locally since it doesn't hold state
				audioProc := processor.NewAudioProcessor()
				resultFile, procErr = audioProc.ConvertAudio(job.InputPaths[0])

			default:
				// Fallback to the new Dynamic Command Builder!
				genericProc := processor.NewGenericProcessor()
				resultFile, procErr = genericProc.Process(job.Tool, job.InputPaths[0], job.Params)
			}

			if procErr != nil {
				log.Printf("Job %s failed: %v", job.JobID, procErr)
				redisStore.SaveJob(ctx, &storage.JobStatus{
					ID:     job.JobID,
					Status: "FAILED",
					Tool:   job.Tool,
					Error:  procErr.Error(),
				})
			} else {
				log.Printf("Job %s completed successfully", job.JobID)
				redisStore.SaveJob(ctx, &storage.JobStatus{
					ID:        job.JobID,
					Status:    "COMPLETED",
					Tool:      job.Tool,
					ResultURL: "/api/v1/download/" + resultFile,
				})
			}

			// Clean up input files immediately
			for _, inPath := range job.InputPaths {
				os.Remove(inPath) // delete original
			}

			commit()
		}
	}()

	// Wait for interrupt
	sigchan := make(chan os.Signal, 1)
	signal.Notify(sigchan, syscall.SIGINT, syscall.SIGTERM)
	<-sigchan
	log.Println("Worker shutting down...")
}
