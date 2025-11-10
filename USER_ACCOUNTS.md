# NSTSWC Dev Club - User Accounts

## Available Users

### 1. Geetansh (Admin/Project Owner) 🔑
- **Username:** `geetansh`
- **Password:** `admin123`
- **Role:** Admin
- **Email:** geetansh@nstswc.com
- **Points:** 1800
- **Badges:** 7
- **Project:** Dev Club Portal (Active)
- **Permissions:**
  - ✅ Can view and approve join requests
  - ✅ Can access Admin Portal
  - ✅ Can manage projects
  - ✅ Full dashboard access

### 2. Utsav (Normal Member) 👤
- **Username:** `utsav`
- **Password:** `user123`
- **Role:** Student (Normal Member)
- **Email:** utsav@nstswc.com
- **Points:** 1200
- **Badges:** 4
- **Permissions:**
  - ✅ Can view projects
  - ✅ Can show interest in projects ("Request to join")
  - ✅ Can RSVP to events
  - ✅ Can view leaderboard
  - ❌ Cannot access Admin Portal

### 3. User Three (Student)
- **Username:** `user3`
- **Password:** `user123`
- **Role:** Student
- **Email:** user3@nstswc.com
- **Points:** 800
- **Badges:** 2

### 4. User Four (Student)
- **Username:** `user4`
- **Password:** `user123`
- **Role:** Student
- **Email:** user4@nstswc.com
- **Points:** 600
- **Badges:** 1

---

## Projects

### Dev Club Portal
- **Owner:** Geetansh • Admin
- **Status:** Active
- **Members:** 1
- **Tech Stack:** Next.js, Firebase, TypeScript, Tailwind
- **Description:** Modern club management system with project tracking, event RSVPs, and member dashboard.

---

## Admin Features (Geetansh Only)

### Pending Join Requests (3)
1. **Rahul Sharma** - Student interested in Web Development, AI/ML
2. **Priya Patel** - Student interested in Mobile Apps, Design Systems  
3. **Amit Kumar** - Mentor interested in DevOps, Cloud Infrastructure

**To test admin features:**
1. Login as **Geetansh** (username: `geetansh`, password: `admin123`)
2. Navigate to **Admin Portal** (visible in sidebar)
3. Review pending join requests
4. Click **"Approve"** or **"Hold for Review"** buttons
5. Decisions are logged in demo mode

---

## Testing Project Interest Feature

### As Normal Member (Utsav):
1. **Login as Utsav** (username: `utsav`, password: `user123`)
2. Go to **Dashboard** → View the "Dev Club Portal" project
3. Click **"Request to join"** button
4. Button changes to **"Request sent"** and becomes disabled
5. Check terminal logs - you should see:
   - "Received project interest request"
   - "✅ Demo mode: Project interest logged for..."

### As Admin (Geetansh):
1. **Login as Geetansh** (username: `geetansh`, password: `admin123`)
2. **Admin Portal** link is visible in sidebar
3. Can see all pending join requests
4. Can approve or hold requests
5. Project interest requests from members would appear here (when Firestore is configured)

---

## Key Differences

| Feature | Geetansh (Admin) | Utsav (Normal Member) |
|---------|------------------|----------------------|
| View Projects | ✅ | ✅ |
| Request to Join Projects | ✅ | ✅ |
| Admin Portal Access | ✅ | ❌ |
| Approve Join Requests | ✅ | ❌ |
| Manage Members | ✅ | ❌ |
| Admin Link in Sidebar | ✅ Visible | ❌ Hidden |

---

## Notes

- **Admin Portal** is only visible to users with `role: "admin"`
- Normal members (Utsav, User3, User4) can view projects and show interest
- The application is running in **demo mode** due to Firebase authentication issues
- Data is logged to console but not saved to Firestore (will be fixed with proper Firebase credentials)
- All project interest requests return success and show "Request sent" in UI
- Join request approvals are logged but not persisted until Firestore is configured
