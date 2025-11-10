# 🚀 Quick Start: Connect to Firebase Production

## Current Status
✅ Service account configured (nst-swc1)
✅ API routes ready with demo mode fallback
✅ `.env.local` file created (needs your Firebase web app credentials)
⏳ Waiting for Firebase web app credentials

## 🔥 **QUICK SETUP (5 minutes)**

### 1. Get Firebase Web Credentials

Open this link in your browser:
👉 **https://console.firebase.google.com/project/nst-swc1/settings/general**

Scroll down to "Your apps" section:
- If you see a web app (</> icon), click it to view credentials
- If not, click **"Add app"** → Select **Web** → Register with name "Dev Club Website"

You'll see a config object like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "nst-swc1.firebaseapp.com",
  projectId: "nst-swc1",
  storageBucket: "nst-swc1.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcd1234",
  measurementId: "G-ABCD1234"
};
```

### 2. Update `.env.local`

Open `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...           # ← Paste your apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nst-swc1.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nst-swc1
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nst-swc1.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890  # ← Your sender ID
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcd1234  # ← Your app ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCD1234  # ← Your measurement ID
```

### 3. Enable Firestore

👉 **https://console.firebase.google.com/project/nst-swc1/firestore**

- Click "Create database"
- Choose "Start in test mode" (for now)
- Select location: `us-central`
- Click "Enable"

### 4. Grant Service Account Permissions

👉 **https://console.cloud.google.com/iam-admin/iam?project=nst-swc1**

1. Find: `firebase-adminsdk-fbsvc@nst-swc1.iam.gserviceaccount.com`
2. Click pencil icon (Edit)
3. Click "Add Another Role"
4. Add: **"Cloud Datastore User"**
5. Click Save

Wait 2-3 minutes for permissions to propagate.

### 5. Restart Server

```bash
# Stop current server (Ctrl+C if running)
npm run dev
```

### 6. Test It!

1. Open http://localhost:3000
2. Login: `geetansh` / `admin123`
3. Go to Projects page
4. You should see **"Manage Project"** button (not "Request to join")
5. Click "Create Project" → Fill form → Submit
6. Check Firebase Console → Firestore → You should see data!

---

## 🎯 What This Fixes

✅ **"Manage Project" button will appear** for project owners
✅ **Data will persist** to Firestore (not just console logs)
✅ **Production-ready** setup (not demo mode)
✅ **Real-time updates** across sessions

## 📝 Build for Production

Once Firebase is connected and working:

```bash
# Create production build
npm run build

# Test production build locally
npm start

# Deploy (if using Vercel)
vercel --prod
```

---

## ❓ Troubleshooting

**"Manage Project" button still not showing?**
- Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows)
- Clear browser cache
- Check console for errors

**"Demo mode" messages in console?**
- Service account needs Firestore permissions (Step 4)
- Wait 2-3 minutes after granting permissions

**Data not saving to Firestore?**
- Check Firestore is enabled (Step 3)
- Check service account has permissions (Step 4)
- Look at browser console for error details

---

For detailed setup instructions, see `FIREBASE_SETUP.md`
