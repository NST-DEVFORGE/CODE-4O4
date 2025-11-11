# Project Management Quick Reference

## ✨ New Features Added

### 1. **Remove Members**
- Project owners can now remove members from their projects
- Click the "Remove" button next to any member
- Confirmation dialog prevents accidental removals
- Member is immediately removed from the project

### 2. **Project Links Management**
- Edit project to add/update links:
  - GitHub Repository URL
  - Live Demo URL
  - Documentation URL
- Links appear as clickable buttons when set
- Grayed out when not set

### 3. **Complete Project Editing**
- Click "Edit Project" to enable editing mode
- Modify: Title, Description, Status, Links
- Click "Save Changes" to save or "Cancel" to discard
- Changes are saved to Firebase immediately

### 4. **Enhanced Project Schema**
- All projects now support proper metadata
- Timestamps track creation and updates
- Status includes "completed" option
- Proper URL fields for all links

---

## 🚀 Quick Start

### For Existing Projects:

1. **Run Migration Script** (one-time):
   ```bash
   cd /Users/geetanshgoyal/Desktop/website
   node migrate-projects.js
   ```

2. **Verify Migration**:
   - Check Firebase Console
   - Confirm all projects have new fields

### For New Projects:

Projects created through the UI will automatically include all new fields.

---

## 📝 How to Use New Features

### Edit Project Details:
1. Navigate to project management page
2. Click "Edit Project" button
3. Modify any fields
4. Add/update links in the sidebar
5. Click "Save Changes"

### View/Remove Members:
1. Navigate to project management page
2. Find "Current Members" section
3. Click "Show Members" to expand
4. See all current members with join dates
5. Click "Remove" button to remove a member

### Manage Join Requests:
1. See pending requests in "Join Requests" section
2. Click "Approve" to add member to project
3. Click "Reject" to decline request
4. Both actions auto-delete the request

---

## 🔧 API Reference

### Update Project
```javascript
PATCH /api/projects/[id]
Body: {
  title: string,
  description: string,
  status: "active" | "recruiting" | "waitlist" | "completed",
  githubUrl: string,
  demoUrl: string,
  docsUrl: string
}
```

### Get Members
```javascript
GET /api/project-members?projectId=[id]
Response: {
  ok: true,
  data: [
    {
      id: string,
      userId: string,
      userName: string,
      userEmail: string,
      joinedAt: Timestamp
    }
  ]
}
```

### Remove Member
```javascript
DELETE /api/project-members/[memberId]
Body: {
  projectId: string
}
```

---

## ⚠️ Important Notes

1. **Only project owners** can:
   - Edit project details
   - Remove members
   - Approve/reject requests

2. **Member counts** are now dynamic:
   - Counted from projectMembers collection
   - Updates automatically when members join/leave

3. **Links are optional**:
   - Can be added/updated anytime
   - Empty links show as disabled buttons

4. **Changes are immediate**:
   - No page refresh needed
   - Auto-refresh keeps data current

---

## 🐛 Troubleshooting

### "Failed to update project"
- Check if you're the project owner
- Verify Firebase connection
- Check console for detailed errors

### Members not showing
- Run migration script if using old data
- Check projectMembers collection in Firebase
- Verify project ID is correct

### Links not clickable
- Ensure URL includes http:// or https://
- Check that link was saved properly
- Try editing and re-saving the project

---

## 📊 Firebase Console Verification

To verify everything is working:

1. Open Firebase Console
2. Go to Firestore Database
3. Check `projects` collection:
   - Should have githubUrl, demoUrl, docsUrl fields
   - Should have createdAt, updatedAt timestamps
4. Check `projectMembers` collection:
   - Each member should have projectId, userId, userName, userEmail
5. Check `projectInterests` collection:
   - Approved/rejected requests should be deleted

---

## 🎯 Next Steps

After migration:
1. ✅ Test editing a project
2. ✅ Test adding project links
3. ✅ Test removing a member
4. ✅ Test approving a join request
5. ✅ Verify member counts are accurate
