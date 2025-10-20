# Docker Commands for Aniverse Server

## 📦 Production Build

### Build the Docker Image

```bash
docker build -t aniverse-server:latest -f dockerfile .
```

### Build with a specific tag

```bash
docker build -t aniverse-server:v1.0.0 -f dockerfile .
```

### Build without cache (clean build)

```bash
docker build --no-cache -t aniverse-server:latest -f dockerfile .
```

## 🚀 Running the Container

### Run the production container

```bash
docker run -d \
  --name aniverse-server \
  -p 8080:8080 \
  --env-file .env \
  aniverse-server:latest
```

### Run with custom port mapping

```bash
docker run -d \
  --name aniverse-server \
  -p 3000:8080 \
  --env-file .env \
  aniverse-server:latest
```

### Run with environment variables

```bash
docker run -d \
  --name aniverse-server \
  -p 8080:8080 \
  -e PORT=8080 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-secret" \
  aniverse-server:latest
```

## 🔧 Development Build (with Hot Reload)

### Build development image

```bash
docker build -t aniverse-server:dev -f dockerfile.dev .
```

### Run development container with volume mounting

```bash
docker run -d \
  --name aniverse-server-dev \
  -p 8080:8080 \
  --env-file .env \
  -v $(pwd):/app \
  aniverse-server:dev
```

### Run with Docker Compose (Recommended for Development)

Create a `docker-compose.yml` file and run:

```bash
docker-compose up -d
```

## 📊 Container Management

### View running containers

```bash
docker ps
```

### View all containers (including stopped)

```bash
docker ps -a
```

### View container logs

```bash
docker logs aniverse-server
```

### Follow logs in real-time

```bash
docker logs -f aniverse-server
```

### Stop the container

```bash
docker stop aniverse-server
```

### Start the container

```bash
docker start aniverse-server
```

### Restart the container

```bash
docker restart aniverse-server
```

### Remove the container

```bash
docker rm aniverse-server
```

### Remove the container forcefully

```bash
docker rm -f aniverse-server
```

## 🧹 Cleanup

### Remove all stopped containers

```bash
docker container prune
```

### Remove unused images

```bash
docker image prune
```

### Remove all unused resources

```bash
docker system prune -a
```

### Remove specific image

```bash
docker rmi aniverse-server:latest
```

## 🔍 Debugging

### Execute commands inside running container

```bash
docker exec -it aniverse-server sh
```

### Check container health

```bash
docker inspect --format='{{.State.Health.Status}}' aniverse-server
```

### View container resource usage

```bash
docker stats aniverse-server
```

### Inspect container details

```bash
docker inspect aniverse-server
```

## 🌐 Docker Hub Deployment

### Tag image for Docker Hub

```bash
docker tag aniverse-server:latest your-username/aniverse-server:latest
```

### Login to Docker Hub

```bash
docker login
```

### Push to Docker Hub

```bash
docker push your-username/aniverse-server:latest
```

### Pull from Docker Hub

```bash
docker pull your-username/aniverse-server:latest
```

## 📝 Docker Compose Example

Create a `docker-compose.yml` file:

```yaml
version: "3.8"

services:
  server:
    build:
      context: .
      dockerfile: dockerfile.dev
    container_name: aniverse-server
    ports:
      - "8080:8080"
    env_file:
      - .env
    volumes:
      - .:/app
      - /app/tmp
    restart: unless-stopped
    networks:
      - aniverse-network

networks:
  aniverse-network:
    driver: bridge
```

Then run:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

## ⚡ Quick Commands

### One-liner: Build and Run

```bash
docker build -t aniverse-server:latest -f dockerfile . && docker run -d --name aniverse-server -p 8080:8080 --env-file .env aniverse-server:latest
```

### One-liner: Stop, Remove, Rebuild, and Run

```bash
docker stop aniverse-server; docker rm aniverse-server; docker build -t aniverse-server:latest -f dockerfile . && docker run -d --name aniverse-server -p 8080:8080 --env-file .env aniverse-server:latest
```

## 🎯 Best Practices

1. **Use `.dockerignore`**: Exclude unnecessary files from the build context
2. **Multi-stage builds**: Separate build and runtime environments
3. **Non-root user**: Run containers with least privilege
4. **Health checks**: Monitor container health
5. **Environment variables**: Never hardcode secrets
6. **Volume mounting**: For development with hot reload
7. **Layer caching**: Order Dockerfile commands properly
8. **Small base images**: Use Alpine for smaller image sizes

## 📌 Notes

- The production Dockerfile uses multi-stage builds for optimal image size
- Development Dockerfile includes Air for hot reload
- Health check endpoint: `http://localhost:8080/health`
- Default port: 8080 (configurable via environment variables)
- Built binary is statically linked for better portability
