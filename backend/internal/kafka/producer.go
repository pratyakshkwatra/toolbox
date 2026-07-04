package kafka

import (
	"context"
	"encoding/json"
	"log"

	"github.com/segmentio/kafka-go"
)

type Producer struct {
	writer *kafka.Writer
}

func NewProducer(brokers []string, topic string) *Producer {
	w := &kafka.Writer{
		Addr:     kafka.TCP(brokers...),
		Topic:    topic,
		Balancer: &kafka.LeastBytes{},
	}
	return &Producer{writer: w}
}

func (p *Producer) PublishJob(ctx context.Context, job JobMessage) error {
	data, err := json.Marshal(job)
	if err != nil {
		return err
	}

	err = p.writer.WriteMessages(ctx, kafka.Message{
		Key:   []byte(job.JobID),
		Value: data,
	})
	if err != nil {
		log.Printf("failed to write messages: %v", err)
		return err
	}
	return nil
}

func (p *Producer) Close() {
	p.writer.Close()
}
