# Build stage
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod tidy
RUN CGO_ENABLED=0 go build -o main cmd/api/main.go
RUN CGO_ENABLED=0 go build -o worker cmd/worker/main.go

# Run stage
FROM alpine:latest
RUN apk add --no-cache qpdf ffmpeg
WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/worker .
EXPOSE 8000
CMD ["./main"]
