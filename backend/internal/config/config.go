package config

import (
	"os"
)

type Config struct {
	Port        string
	FrontendURL string
	DatabaseURL string
	RedisURL    string
	KafkaBrokers string
}

func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	return &Config{
		Port:        port,
		FrontendURL: frontendURL,
		DatabaseURL: os.Getenv("DATABASE_URL"),
		RedisURL:    os.Getenv("REDIS_URL"),
		KafkaBrokers: os.Getenv("KAFKA_BOOTSTRAP_SERVERS"),
	}
}
