# Chat App

A streaming chat app where assistant replies appear word by word, with support for stopping and resuming mid-stream.

## Prerequisites

- Node 18+
- npm 9+
- Docker (optional)

## Environment setup

Copy `.env.example` to `backend/.env` before running:

```bash
cp .env.example backend/.env
```

## Running locally

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. The Vite dev server proxies `/stream` requests to the backend automatically.

## Running tests

```bash
cd backend
npm test
```

## Docker

Make sure Docker is running, then from the root:

```bash
docker compose up --build
```

The app will be available at `http://localhost:3000`.

## How it works

Type a message and send it. The assistant's reply streams in word by word. You can stop the stream at any point using the stop button, and resume it later from exactly where it left off. If the connection drops mid-stream, a retry button appears on the partial reply.

## Bonus features

**Docker** — both services have multi-stage Dockerfiles. The backend build stage compiles TypeScript and the production stage runs only the compiled output with no dev dependencies. The frontend build stage runs Vite and the production stage serves the static files with `serve`. The `docker-compose.yml` includes a healthcheck on the backend `/health` endpoint and the frontend container waits for it to pass before starting.

## Time spent

About 4 hours
