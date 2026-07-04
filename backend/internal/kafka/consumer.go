package kafka

import (
	"context"
	"encoding/json"
	"log"

	"github.com/segmentio/kafka-go"
)

type Consumer struct {
	reader *kafka.Reader
}

func NewConsumer(brokers []string, topic string, groupID string) *Consumer {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  brokers,
		GroupID:  groupID,
		Topic:    topic,
		MinBytes: 10e3, // 10KB
		MaxBytes: 10e6, // 10MB
	})
	return &Consumer{reader: r}
}

func (c *Consumer) ReadJob(ctx context.Context) (*JobMessage, func(), error) {
	m, err := c.reader.FetchMessage(ctx)
	if err != nil {
		return nil, nil, err
	}

	var job JobMessage
	if err := json.Unmarshal(m.Value, &job); err != nil {
		// Even if unmarshal fails, we might want to commit so it doesn't get stuck, 
		// but for simplicity return the error.
		return nil, nil, err
	}

	commitFunc := func() {
		if err := c.reader.CommitMessages(context.Background(), m); err != nil {
			log.Printf("failed to commit message: %v", err)
		}
	}

	return &job, commitFunc, nil
}

func (c *Consumer) Close() {
	c.reader.Close()
}
