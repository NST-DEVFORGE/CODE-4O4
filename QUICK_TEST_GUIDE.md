# Quick Test Guide

## Testing Admin Features (Geetansh)

### Login
```
Username: geetansh
Password: admin123
```

### What Geetansh Can Do:
1. **View Admin Portal** (link visible in sidebar)
2. **See 3 pending join requests:**
   - Rahul Sharma (Student - Web Dev, AI/ML)
   - Priya Patel (Student - Mobile, Design)
   - Amit Kumar (Mentor - DevOps, Cloud)
3. **Approve/Hold requests** with interactive buttons
4. **Own Dev Club Portal project**
5. **View all dashboard features**

---

## Testing Normal Member Features (Utsav)

### Login
```
Username: utsav
Password: user123
```

### What Utsav Can Do:
1. **View projects** - See "Dev Club Portal" by Geetansh
2. **Request to join projects** - Click "Request to join" button
3. **RSVP to events** - Sign up for workshops and hackathons
4. **View leaderboard** - See rankings and points
5. **Track sessions** - View upcoming workshop calendar

### What Utsav CANNOT Do:
❌ Access Admin Portal (link is hidden)
❌ Approve join requests
❌ Manage other members

---

## Quick Test Flow

### Test 1: Admin Approving Requests
1. Login as **geetansh**
2. Click **Admin** in sidebar
3. See 3 pending requests
4. Click **Approve** or **Hold for Review**
5. See success toast message
6. Check terminal for logs

### Test 2: Member Showing Interest
1. Logout (if logged in as geetansh)
2. Login as **utsav**
3. Dashboard shows "Dev Club Portal" project
4. Click **"Request to join"**
5. Button changes to **"Request sent"**
6. Button becomes disabled
7. Check terminal - see demo mode success log

### Test 3: Role-Based Access
1. Login as **utsav**
2. Notice **no Admin link** in sidebar (filtered out)
3. Try to manually visit `/admin` (will see page but shouldn't have access in production)
4. Logout and login as **geetansh**
5. Now **Admin link appears** in sidebar

---

## Expected Terminal Logs

### When Utsav requests to join:
```
Received project interest request: { projectId: 'geetansh-project', userId: 'utsav-1' }
Getting Firestore database...
Using existing admin app
Firestore instance obtained
Writing to projectInterests collection...
⚠️  Firestore save failed (running in demo mode): Error: 16 UNAUTHENTICATED...
✅ Demo mode: Project interest logged for: geetansh-project from user: utsav-1
POST /api/project-interest 200
```

### When Geetansh approves request:
```
⚠️  Firestore save failed (demo mode): Error: 16 UNAUTHENTICATED...
✅ Demo mode: Decision logged for request: req-1
POST /api/admin/decision 200
```

---

## Current Status

✅ **Working Features:**
- Login/Logout for all 4 users
- Role-based navigation (Admin link only for geetansh)
- Project interest requests (demo mode)
- Admin approval buttons (demo mode)
- Toast notifications
- Button state management (disabled after action)

⚠️ **Demo Mode:**
- All API calls return success (200)
- Data logged to console
- NOT persisted to Firestore (needs proper Firebase credentials)
- UI fully functional

🔧 **To Enable Persistence:**
- Configure Firestore rules
- Generate new service account key with proper permissions
- Replace service account JSON file
