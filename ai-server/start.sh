#!/bin/bash

# Exit on error
set -e

echo "📦 Checking for existing vectors.json..."

# Check if vectors.json already exists
if [ ! -f vectors.json ]; then
  echo "✅ vectors.json not found, generating vectors from product images..."
  python generate_vectors.py
else
  echo "🟢 vectors.json found, skipping generation."
fi

echo "🚀 Starting FastAPI AI search server..."
uvicorn search:app --host 0.0.0.0 --port 8000