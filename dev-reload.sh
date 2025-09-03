#!/bin/bash

# Development reload script for Companies House N8N node
echo "🔄 Starting development reload..."

# Stop N8N
echo "⏹️  Stopping N8N..."
pkill -f n8n

# Build the project
echo "🔨 Building project..."
npm run build

# Re-link the package (following official N8N docs)
echo "🔗 Re-linking package..."
npm link
cd ~/.n8n/custom
npm link n8n-nodes-companies-house-chris
cd - > /dev/null

# Clear N8N cache
echo "🧹 Clearing N8N cache..."
rm -rf ~/.n8n/.cache

# Start N8N with custom extensions
echo "🚀 Starting N8N with custom extensions..."
N8N_CUSTOM_EXTENSIONS=~/.n8n/custom n8n start &

echo "✅ Development reload complete!"
echo "🌐 N8N should be available at http://localhost:5678"
echo ""
echo "💡 To use this script:"
echo "   1. Make your changes to .ts files"
echo "   2. Run: ./dev-reload.sh"
echo "   3. Refresh your browser"
