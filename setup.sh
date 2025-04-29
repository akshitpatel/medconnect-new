#!/bin/bash

# MedConnect Setup Script
echo "=== Setting up MedConnect ==="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js v16+ before continuing."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm before continuing."
    exit 1
fi

# Print Node.js and npm versions
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if .env.local exists, create if not
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    echo "MONGODB_URI=mongodb://localhost:27017/medconnect" > .env.local
    echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
    echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local
    echo ".env.local created with default settings. Please update the MongoDB URI if needed."
else
    echo ".env.local already exists. Skipping..."
fi

# Run database setup
echo "Setting up the database with mock data..."
npm run setup-db

echo "=== MedConnect setup complete! ==="
echo "You can now start the development server with: npm run dev"
echo "Access the application at: http://localhost:3000" 