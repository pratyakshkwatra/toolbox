package storage

import (
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	ID           string    `gorm:"primaryKey"`
	Email        string    `gorm:"uniqueIndex"`
	PasswordHash string    
	Name         string
	Image        string
	CreatedAt    time.Time
}

type JobHistory struct {
	ID        string    `gorm:"primaryKey"`
	UserID    string    `gorm:"index"`
	Tool      string
	Status    string
	ResultURL string
	CreatedAt time.Time
}

type AnalyticsEvent struct {
	ID        string    `gorm:"primaryKey"`
	EventType string    `gorm:"index"` // e.g., "page_view", "tool_click", "job_start"
	ToolSlug  string    `gorm:"index"`
	CreatedAt time.Time `gorm:"index"`
}

type DB struct {
	*gorm.DB
}

func ConnectDB(dsn string) *DB {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// Auto Migrate the schemas
	db.AutoMigrate(&User{}, &JobHistory{}, &AnalyticsEvent{})
	
	return &DB{db}
}

// LogJobHistory records a job to the database if the user is authenticated.
func (db *DB) LogJobHistory(jobID string, userID string, tool string, status string, resultURL string) {
	if userID == "" {
		return // Anonymous job, don't store in PG
	}
	
	job := JobHistory{
		ID:        jobID,
		UserID:    userID,
		Tool:      tool,
		Status:    status,
		ResultURL: resultURL,
		CreatedAt: time.Now(),
	}
	db.Save(&job)
}
