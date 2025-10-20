# 🚀 Quick Start Docker Commands

## Production Build & Run

```bash
# Build
docker build -t aniverse-server:latest -f dockerfile .

# Run
docker run -d --name aniverse-server -p 8080:8080 --env-file .env aniverse-server:latest

# View logs
docker logs -f aniverse-server
```

## Development with Hot Reload

```bash
# Using Docker Compose (Recommended)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Or Manual Development Build

```bash
# Build
docker build -t aniverse-server:dev -f dockerfile.dev .

# Run with volume mounting
docker run -d --name aniverse-server-dev -p 8080:8080 --env-file .env -v $(pwd):/app aniverse-server:dev
```

## Rebuild & Restart

```bash
# Stop and remove
docker stop aniverse-server && docker rm aniverse-server

# Rebuild and run
docker build -t aniverse-server:latest -f dockerfile . && docker run -d --name aniverse-server -p 8080:8080 --env-file .env aniverse-server:latest
```

## Check Health

```bash
# Container status
docker ps

# Logs
docker logs -f aniverse-server

# Test endpoint
curl http://localhost:8080/health
```

---

📖 For more commands, see [DOCKER_COMMANDS.md](./DOCKER_COMMANDS.md)
