#!/usr/bin/env bash
set -e

echo "=== Node & NPM versions ==="
node -v
npm -v

echo "=== Building Frontend ==="
cd frontend
npm install --include=dev
npm run build
cd ..

echo "=== Building Backend ==="
cd backend
npm install --include=dev
npm run build
cd ..

echo "=== Build Complete ==="
