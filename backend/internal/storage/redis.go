package storage

import (
	"context"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
)

type JobStatus struct {
	ID        string `json:"id"`
	Status    string `json:"status"` // PENDING, PROCESSING, COMPLETED, FAILED
	Tool      string `json:"tool"`
	ResultURL string `json:"result_url,omitempty"`
	Error     string `json:"error,omitempty"`
}

type RedisStorage struct {
	client *redis.Client
}

func NewRedisStorage(url string) *RedisStorage {
	if url == "" {
		url = "redis://localhost:6379/0"
	}
	opts, err := redis.ParseURL(url)
	if err != nil {
		panic(err)
	}

	client := redis.NewClient(opts)
	return &RedisStorage{client: client}
}

func (r *RedisStorage) SaveJob(ctx context.Context, job *JobStatus) error {
	data, err := json.Marshal(job)
	if err != nil {
		return err
	}
	
	// Save to KV store with expiration
	err = r.client.Set(ctx, "job:"+job.ID, data, 24*time.Hour).Err()
	if err != nil {
		return err
	}

	// Publish to Pub/Sub channel for WebSockets
	return r.client.Publish(ctx, "job_updates:"+job.ID, data).Err()
}

func (r *RedisStorage) SubscribeJobUpdates(ctx context.Context, id string) *redis.PubSub {
	return r.client.Subscribe(ctx, "job_updates:"+id)
}

func (r *RedisStorage) GetJob(ctx context.Context, id string) (*JobStatus, error) {
	data, err := r.client.Get(ctx, "job:"+id).Result()
	if err != nil {
		return nil, err
	}
	var job JobStatus
	if err := json.Unmarshal([]byte(data), &job); err != nil {
		return nil, err
	}
	return &job, nil
}
