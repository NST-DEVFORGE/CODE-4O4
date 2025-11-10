# 🔥 Firebase Production Setup Guide

## Step 1: Get Firebase Web App Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **nst-swc1**
3. Click on **Project Settings** (gear icon)
4. Scroll down to **Your apps** section
5. If you don't have a web app yet:
   - Click **Add app** → Choose **Web** (</> icon)
   - Register app with a nickname (e.g., "Dev Club Website")
   - Copy the configuration

## Step 2: Update `.env.local` File

Replace the placeholder values in `.env.local` with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nst-swc1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nst-swc1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nst-swc1.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123
```

## Step 3: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (or test mode for now)
4. Select a location (e.g., `us-central`)
5. Click **Enable**

## Step 4: Set Up Firestore Security Rules

In Firestore → **Rules** tab, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Project interest requests - anyone can create, only admins can update
    match /projectInterests/{interestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Event RSVPs
    match /eventRSVPs/{rsvpId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Join requests - admins only
    match /joinRequests/{requestId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Step 5: Grant Firestore Permissions to Service Account

1. Go to [Google Cloud Console IAM](https://console.cloud.google.com/iam-admin/iam?project=nst-swc1)
2. Find your service account: `firebase-adminsdk-fbsvc@nst-swc1.iam.gserviceaccount.com`
3. Click **Edit** (pencil icon)
4. Click **Add Another Role**
5. Add these roles:
   - **Cloud Datastore User**
   - **Firebase Admin SDK Administrator Service Agent**
6. Click **Save**

## Step 6: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 7: Test Firebase Connection

1. Open browser console
2. Navigate to any page
3. Look for Firebase connection logs
4. Try creating a project or joining one
5. Check Firebase Console → Firestore to see if data is saved

## Troubleshooting

### "UNAUTHENTICATED" Error
- Make sure service account has Firestore permissions (Step 5)
- Wait a few minutes for IAM changes to propagate

### "Missing API Key" Warning
- Check that `.env.local` has all values filled in
- Restart the dev server after editing `.env.local`

### Data Not Saving
- Check Firestore security rules
- Look at browser console for errors
- Check Firebase Console → Firestore → Usage tab

## Production Build

Once Firebase is connected and tested:

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel
vercel deploy --prod
```

## Environment Variables for Vercel

If deploying to Vercel, add these environment variables in:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

Add all the `NEXT_PUBLIC_*` variables from your `.env.local` file.

---

✅ Once setup is complete, the "Manage Project" button will show for project owners and all data will be persisted to Firestore!
