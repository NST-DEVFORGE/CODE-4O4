#!/bin/bash

echo "🔥 Testing Firebase Connection..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local and add your Firebase credentials."
    echo "See FIREBASE_SETUP.md for instructions."
    exit 1
fi

# Check if API key is set
if grep -q "your_api_key_here" .env.local; then
    echo "⚠️  Warning: .env.local still has placeholder values"
    echo "Please update with your actual Firebase credentials from Firebase Console."
    echo ""
    echo "Steps:"
    echo "1. Go to https://console.firebase.google.com/"
    echo "2. Select project: nst-swc1"
    echo "3. Project Settings > Your apps > Add web app (if not exists)"
    echo "4. Copy the config values to .env.local"
    echo ""
    exit 1
fi

echo "✅ .env.local file found"
echo ""

# Check if dev server is running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Dev server is running on port 3000"
else
    echo "⚠️  Dev server is not running"
    echo "Start it with: npm run dev"
fi

echo ""
echo "📋 Next steps:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Login with: geetansh / admin123"
echo "3. Go to Projects page"
echo "4. Click 'Create Project' and fill the form"
echo "5. Check Firebase Console > Firestore to see if data was saved"
echo ""
echo "If you see 'Demo mode' warnings in console, follow FIREBASE_SETUP.md"
echo "to grant Firestore permissions to your service account."
