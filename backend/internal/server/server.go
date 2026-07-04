package server

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/pratyakshkwatra/toolbox/backend/internal/config"
	"github.com/pratyakshkwatra/toolbox/backend/internal/handlers"
	"github.com/pratyakshkwatra/toolbox/backend/internal/processor"
	"github.com/pratyakshkwatra/toolbox/backend/internal/storage"
)

func New(cfg *config.Config) http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{cfg.FrontendURL, "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Setup dependencies
	store := storage.NewLocalStorage("./tmp")
	
	// Start background auto-cleanup for privacy
	go func() {
		ticker := time.NewTicker(5 * time.Minute)
		for range ticker.C {
			if err := store.CleanupOldFiles(30 * time.Minute); err != nil {
				// Just log it in a real app, ignoring here for brevity
			}
		}
	}()

	redisStore := storage.NewRedisStorage(cfg.RedisURL)
	db := storage.ConnectDB(cfg.DatabaseURL)
	producer := kafka.NewProducer([]string{cfg.KafkaBrokers}, "toolbox-jobs")
	
	statusHandler := handlers.NewStatusHandler(redisStore)
	wsHandler := handlers.NewWSHandler(redisStore)
	genericHandler := handlers.NewGenericToolHandler(store, redisStore, producer)
	authHandler := handlers.NewAuthHandler(db)
	analyticsHandler := handlers.NewAnalyticsHandler(db)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Welcome to Toolbox API"})
	})

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
	})

	// Auth
	r.Post("/api/v1/auth/register", authHandler.HandleRegister)
	r.Post("/api/v1/auth/login", authHandler.HandleLogin)

	// Analytics
	r.Post("/api/v1/analytics/track", analyticsHandler.HandleTrack)
	r.Get("/api/v1/analytics/popular", analyticsHandler.HandlePopular)

	// Dynamic route that handles ALL processing tools (image-compress, pdf-merge, video-rotate, etc.)
	r.Post("/api/v1/process/{tool}", genericHandler.HandleProcess)

	r.Get("/api/v1/jobs/{job_id}", statusHandler.HandleGetStatus)
	r.Get("/api/v1/jobs/ws/{job_id}", wsHandler.HandleJobWebSocket)

	// Since File serving is now decoupled, we need a simple route to serve the finished file if the frontend downloads it
	r.Get("/api/v1/download/{filename}", func(w http.ResponseWriter, r *http.Request) {
		filename := chi.URLParam(r, "filename")
		http.ServeFile(w, r, store.GetFilePath(filename))
	})

	return r
}
