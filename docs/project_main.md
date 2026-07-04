# PROJECT_MAIN.md

# Toolbox

**Toolbox** is a free, privacy-first, open-source platform that provides fast, browser-based utilities for everyday file operations. The platform aims to become the go-to destination for document, image, video, and audio processing while maintaining complete transparency, excellent performance, and an exceptional user experience.

---

# Vision

Build the most modern, reliable, privacy-first, and open-source collection of file utilities.

The goal is **not** to create another iLovePDF clone.

The goal is to build an ecosystem of high-quality utilities with a consistent experience across every tool.

---

# Core Principles (Non-Negotiable)

## Privacy First

Privacy is the highest priority.

* Files belong to users.
* Files are never sold.
* Files are never used for AI training.
* Files are never manually inspected.
* Files are encrypted during transmission.
* Files are automatically deleted after processing.
* Temporary storage must have automatic expiry.
* Metadata should be removed whenever requested.
* Every tool should expose privacy information clearly.

---

## No Artificial Restrictions

The platform should remain generous.

Avoid:

* Watermarks
* Forced sign-ups
* Feature paywalls
* Artificial waiting timers
* Fake loading animations
* Aggressive advertisements
* Dark patterns

If limits become necessary, they should exist solely to prevent abuse and protect platform stability.

---

## Performance First

Every operation should feel instant.

Goals:

* Extremely fast page loads
* Low memory footprint
* Streaming wherever possible
* Parallel processing
* Efficient file handling
* Intelligent caching
* Minimal frontend bundle size

---

## Simplicity

Every tool should require as few clicks as possible.

Example:

Upload → Configure → Download

No unnecessary steps.

---

## Open Source

The platform should be fully open source.

Repository should include:

* Frontend
* Backend
* Infrastructure
* Docker setup
* Documentation
* API documentation
* Contribution guidelines

Encourage community contributions.

---

# Platform Features

## Guest Users

Guest users can:

* Upload files
* Process files
* Download results
* Use every supported tool
* Access the platform without creating an account

---

## Registered Users

Accounts are optional.

Benefits include:

* Processing history
* Saved preferences
* Favorite tools
* Batch history
* Download history
* API keys (future)
* Sync across devices
* Saved templates
* Processing statistics

The platform should never require an account for basic functionality.

---

# Initial Categories

## PDF

* Merge
* Split
* Compress
* Convert
* Edit
* Security
* Extraction

---

## Images

* Resize
* Compress
* Convert
* Crop
* Transform
* Batch Processing

---

## Video & Audio

* Convert
* Compress
* Trim
* Merge
* Extract Audio
* Format Conversion

---

# Architecture Philosophy

The architecture should be modular.

Every major service must remain independently deployable.

Preferred architecture:

Frontend

↓

API Gateway

↓

Authentication

↓

Processing Queue

↓

Worker Services

↓

Storage

↓

Cleanup

Each processing engine should be replaceable without affecting other components.

---

# Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Query
* Zustand
* Framer Motion

---

## Backend

* FastAPI
* Python
* Pydantic
* SQLAlchemy
* Alembic

---

## Database

* PostgreSQL

---

## Cache

* Redis

Uses:

* Caching
* Sessions
* Rate limiting
* Temporary data
* Queue support

---

## Message Broker

* Apache Kafka

Used for:

* Processing events
* Upload events
* Analytics
* Notifications
* Logging pipeline
* Admin events
* Future event-driven architecture

Kafka should be treated as a core component rather than an optional addition.

---

## Object Storage

S3-compatible storage.

Examples:

* MinIO
* AWS S3
* Cloudflare R2

Files should never remain permanently unless explicitly requested by authenticated users.

---

## Search

Design the architecture to support future indexing and search capabilities.

---

## Reverse Proxy

* Nginx or Traefik

Responsibilities:

* HTTPS
* Compression
* Caching
* Load balancing
* Rate limiting

---

## Background Workers

Dedicated worker containers should process all heavy operations.

Examples:

* PDF Worker
* Image Worker
* Video Worker
* Audio Worker

Workers should be horizontally scalable.

---

# Processing Libraries

PDF

* qpdf
* PDFium
* Ghostscript
* LibreOffice

Images

* ImageMagick
* libvips

Video

* FFmpeg

OCR support may be added later without changing the architecture.

---

# Docker Requirements

Every component must run in Docker.

Development should require only:

docker compose up

Containers should include:

* frontend
* backend
* postgres
* redis
* kafka
* object storage
* nginx
* workers
* logging
* monitoring

Every service must expose health checks.

---

# API Design

REST-first.

Consistent endpoints.

Versioned API.

Example:

/api/v1/

OpenAPI documentation should always remain up to date.

---

# Authentication

JWT

Refresh Tokens

Secure Cookies where appropriate.

OAuth support later.

---

# Logging (Non-Negotiable)

Every meaningful interaction should generate structured logs.

Examples:

* Upload started
* Upload completed
* Processing started
* Processing completed
* Tool selected
* Processing duration
* Download completed
* Processing failure
* API error
* Authentication event
* Queue delay
* Worker status
* File cleanup
* Storage usage

Logs should be structured JSON.

No sensitive user data should ever be logged.

---

# Analytics (Non-Negotiable)

The system should collect anonymous platform analytics.

Examples:

* Most used tools
* Average processing time
* Peak usage hours
* Error rates
* Device type
* Browser
* Operating system
* Country
* File types
* File sizes
* Queue utilization

Personally identifiable file content must never be collected.

Analytics should support future dashboards.

---

# Admin Panel (Future)

Architecture should support an internal admin dashboard.

Potential modules:

* User Management
* Worker Status
* Queue Monitoring
* Active Jobs
* Storage Usage
* Analytics
* Logs
* Error Reports
* Abuse Detection
* Health Monitoring
* Rate Limits
* File Cleanup
* Feature Flags
* Maintenance Mode
* System Metrics

No architectural rewrites should be required to build the admin panel.

---

# Monitoring

Integrate:

* Prometheus
* Grafana

Monitor:

* CPU
* Memory
* Disk
* Queue Size
* API Latency
* Worker Latency
* Success Rate
* Error Rate

---

# Error Handling

Every request should have:

* Request ID
* Correlation ID
* Structured errors
* Retry support
* Meaningful error messages

Never expose internal stack traces.

---

# Security

Mandatory:

* HTTPS
* Secure headers
* CORS
* CSRF protection where applicable
* JWT validation
* Input validation
* File validation
* MIME validation
* Virus scanning support
* Rate limiting
* SQL injection prevention
* XSS prevention

---

# Scalability

The platform should support horizontal scaling from day one.

Workers should scale independently.

Stateless APIs.

Distributed processing.

Container orchestration ready.

---

# Code Quality

Required:

* Strict typing
* Unit tests
* Integration tests
* CI/CD
* Pre-commit hooks
* Linting
* Formatting
* Automated testing

---

# Documentation

Maintain:

* API Docs
* Architecture Docs
* Developer Guide
* Contribution Guide
* Deployment Guide
* Security Policy
* Changelog
* Roadmap

Documentation should be treated as part of the product.

---

# Long-Term Goal

Create the largest open-source ecosystem of modern file utilities that users trust because it is:

* Free
* Fast
* Transparent
* Privacy-first
* Beautifully designed
* Open source
* Highly scalable
* Built with production-grade engineering practices from day one.
