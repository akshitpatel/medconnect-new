#!/bin/bash

# Start MongoDB using Docker for local development
# Usage: ./scripts/start-mongodb.sh

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker first."
  exit 1
fi

# Container name
CONTAINER_NAME="healcard-mongodb"

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  # Check if it's running
  if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "✅ MongoDB container is already running."
    echo "MongoDB is available at mongodb://localhost:27017/healcard"
    exit 0
  else
    # Container exists but not running, start it
    echo "📦 Starting existing MongoDB container..."
    docker start ${CONTAINER_NAME}
    echo "✅ MongoDB container started."
    echo "MongoDB is available at mongodb://localhost:27017/healcard"
    exit 0
  fi
fi

# Create and start a new MongoDB container
echo "🔄 Creating and starting new MongoDB container..."
docker run --name ${CONTAINER_NAME} \
  -p 27017:27017 \
  -v healcard-mongodb-data:/data/db \
  -d \
  mongo:latest

# Check if container started successfully
if [ $? -eq 0 ]; then
  echo "✅ MongoDB container started successfully."
  echo "MongoDB is available at mongodb://localhost:27017/healcard"
  echo ""
  echo "To seed the symptoms database, run: npm run seed-symptoms"
  echo "To stop MongoDB, run: docker stop ${CONTAINER_NAME}"
else
  echo "❌ Failed to start MongoDB container."
  exit 1
fi 