# Toolbox

**Toolbox** is a free, privacy-first, open-source platform providing fast, browser-based utilities for everyday file operations (PDFs, Images, Video, and Audio). Our mission is to deliver excellent performance, a stunning user experience, and completely transparent, secure file handling without artificial restrictions.

## 🚀 Core Principles

- **Privacy First:** Your files belong to you. They are never sold, never used for AI training, and always automatically deleted after processing.
- **No Artificial Restrictions:** No watermarks, no forced sign-ups, no feature paywalls.
- **Performance First:** Extremely fast page loads, local/browser-based processing where possible, and minimal overhead.
- **Simplicity:** Upload → Configure → Download.
- **Open Source:** The entire platform is open for community contribution and inspection.

## 🛠 Technology Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Framer Motion
- **Backend:** Go, Chi Router
- **Database:** PostgreSQL
- **Cache / Sessions:** Redis
- **Message Broker:** Apache Kafka
- **Infrastructure:** Docker & Docker Compose

## 📦 Project Structure

```
toolbox/
├── frontend/          # Next.js web application
├── backend/           # FastAPI application & workers
├── docs/              # Project documentation and UI/UX assets
└── docker-compose.yml # Orchestration for local development
```

## ⚙️ Getting Started (Local Development)

We use Docker Compose to spin up the entire stack seamlessly.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pratyakshkwatra/toolbox.git
   cd toolbox
   ```

2. **Start the environment:**
   ```bash
   docker compose up --build
   ```

3. **Access the services:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000/docs](http://localhost:8000/docs)

## 📄 Documentation

- [Project Main Specifications](docs/project_main.md)
- [Feature List V1](docs/features_v1.md)

## 🤝 Contributing

Contributions are welcome! Please ensure you follow the core principles and maintain high code quality standards.

## 🛡 License

MIT License (or as otherwise specified).
