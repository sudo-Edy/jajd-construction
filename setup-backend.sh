#!/bin/bash

# Quick Backend Setup Script for JAJD Construction

echo "🚀 JAJD Construction Backend Setup"
echo "===================================="
echo ""

# Check if in backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    echo "   cd backend && chmod +x ../setup-backend.sh && ../setup-backend.sh"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo ""
    echo "📝 Please edit the .env file with your email credentials:"
    echo "   - EMAIL_SERVICE (gmail, sendgrid, etc.)"
    echo "   - EMAIL_USER (your email address)"
    echo "   - EMAIL_PASSWORD (app-specific password)"
    echo "   - RECEIVER_EMAIL (where to send admin notifications)"
    echo ""
    echo "✏️  Edit backend/.env and add your credentials"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your email credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Backend will be available at http://localhost:5000"
echo ""
