#!/bin/bash

# Start MongoDB using Docker
echo "Starting MongoDB using Docker..."
./scripts/start-mongodb.sh

# Check if MongoDB container started successfully
if [ $? -ne 0 ]; then
    echo "Failed to start MongoDB. Check if Docker is running."
    echo "Using MongoDB Atlas instead..."
    # Make sure .env.local exists with MONGODB_URI
    if [ ! -f .env.local ]; then
        echo "Warning: .env.local file not found. Make sure you have a MongoDB connection string configured."
    fi
fi

# Check if symptoms data needs to be seeded
echo "Checking if symptoms data needs to be seeded..."
npm run seed-symptoms

# Start the Next.js development server
echo "Starting Next.js development server..."
npm run dev 