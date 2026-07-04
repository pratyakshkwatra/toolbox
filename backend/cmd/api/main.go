package main

import (
	"log"
	"net/http"

	"github.com/pratyakshkwatra/toolbox/backend/internal/config"
	"github.com/pratyakshkwatra/toolbox/backend/internal/server"
)

func main() {
	cfg := config.Load()
	srv := server.New(cfg)

	log.Printf("Starting Toolbox API on port %s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, srv); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
