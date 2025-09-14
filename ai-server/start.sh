#!/bin/bash
set -e

VECTORS_PATH="${VECTORS_PATH:-data/vectors.json}"

echo "📦 Checking for existing $VECTORS_PATH..."
if [ ! -f "$VECTORS_PATH" ]; then
  echo "✅ $VECTORS_PATH not found, generating vectors..."
  python generate_vectors.py
else
  echo "🟢 $VECTORS_PATH found, skipping generation."
fi

echo "🚀 Starting FastAPI AI search server..."
uvicorn search:app --host 0.0.0.0 --port 8000