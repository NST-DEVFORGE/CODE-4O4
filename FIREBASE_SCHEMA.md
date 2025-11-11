# Firebase Collections Schema

## Projects Collection

### Collection: `projects`

Each project document should have the following structure:

```javascript
{
  // Required Fields
  id: string,                    // Auto-generated document ID
  title: string,                 // Project name
  description: string,           // Project description
  status: string,                // "active" | "recruiting" | "waitlist" | "completed"
  members: number,               // Count of project members
  tech: string[],                // Array of technologies used
  owner: string,                 // Owner's name
  ownerId: string,               // Owner's user ID
  
  // Optional Fields (URLs)
  githubUrl: string,             // GitHub repository URL
  demoUrl: string,               // Live demo URL
  docsUrl: string,               // Documentation URL
  
  // Timestamps
  createdAt: Timestamp,          // Project creation timestamp
  updatedAt: Timestamp           // Last update timestamp
}
```

### Example Project Document:

```javascript
{
  id: "abc123",
  title: "AI Study Buddy",
  description: "An intelligent tutoring system powered by machine learning",
  status: "active",
  members: 3,
  tech: ["Python", "TensorFlow", "FastAPI", "React"],
  owner: "Geetansh",
  ownerId: "user123",
  githubUrl: "https://github.com/username/ai-study-buddy",
  demoUrl: "https://ai-study-buddy.example.com",
  docsUrl: "https://docs.ai-study-buddy.example.com",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Project Members Collection

### Collection: `projectMembers`

Each member document represents a user's membership in a project:

```javascript
{
  id: string,                    // Auto-generated document ID
  projectId: string,             // Reference to project document ID
  userId: string,                // User's ID
  userName: string,              // User's display name
  userEmail: string,             // User's email address
  joinedAt: Timestamp            // When user joined the project
}
```

### Example Member Document:

```javascript
{
  id: "member123",
  projectId: "abc123",
  userId: "user456",
  userName: "John Doe",
  userEmail: "john@example.com",
  joinedAt: Timestamp
}
```

---

## Project Interests Collection

### Collection: `projectInterests`

Tracks user requests to join projects:

```javascript
{
  id: string,                    // Auto-generated document ID
  projectId: string,             // Reference to project document ID
  projectName: string,           // Project name for reference
  userId: string,                // User requesting to join
  userName: string,              // User's display name
  userEmail: string,             // User's email
  status: string,                // "pending" | "approved" | "rejected"
  createdAt: Timestamp           // When request was created
}
```

### Example Interest Document:

```javascript
{
  id: "interest123",
  projectId: "abc123",
  projectName: "AI Study Buddy",
  userId: "user789",
  userName: "Jane Smith",
  userEmail: "jane@example.com",
  status: "pending",
  createdAt: Timestamp
}
```

---

## Migration Instructions

### For Existing Projects:

If you have existing projects without the new fields, run the migration script:

```bash
node migrate-projects.js
```

This will:
1. Add empty string values for missing URL fields
2. Add timestamps for createdAt and updatedAt
3. Preserve all existing data

### For New Projects:

When creating new projects through the API or Firebase console, ensure all required fields are included:

```javascript
// Example: Creating a new project
await db.collection('projects').add({
  title: "Project Name",
  description: "Project description",
  status: "recruiting",
  members: 0,
  tech: ["React", "Node.js"],
  owner: "Owner Name",
  ownerId: "owner_user_id",
  githubUrl: "",  // Can be empty initially
  demoUrl: "",    // Can be empty initially
  docsUrl: "",    // Can be empty initially
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
});
```

---

## API Endpoints

### Update Project
**PATCH** `/api/projects/[id]`

Updates project details including links. Only specified fields are updated.

```javascript
// Request body
{
  title: "Updated Title",
  description: "Updated description",
  status: "completed",
  githubUrl: "https://github.com/...",
  demoUrl: "https://demo.example.com",
  docsUrl: "https://docs.example.com"
}
```

### Get Project Members
**GET** `/api/project-members?projectId=[id]`

Returns all members of a specific project.

### Remove Project Member
**DELETE** `/api/project-members/[memberId]`

Removes a member from a project. Only project owners can perform this action.

```javascript
// Request body
{
  projectId: "project_id"
}
```

---

## Owner Capabilities

Project owners can:
1. ✅ Edit project details (title, description, status)
2. ✅ Update project links (GitHub, Demo, Documentation)
3. ✅ View all project members
4. ✅ Remove members from the project
5. ✅ Approve/reject join requests
6. ✅ Change project status

---

## Security Rules Recommendation

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Projects: Anyone can read, only owners can write
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.uid == resource.data.ownerId;
    }
    
    // Project Members: Anyone can read, only admins/owners can write
    match /projectMembers/{memberId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
                      (request.auth.uid == get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.ownerId ||
                       request.auth.token.role == 'admin');
    }
    
    // Project Interests: Users can create, owners can manage
    match /projectInterests/{interestId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                              (request.auth.uid == get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.ownerId ||
                               request.auth.token.role == 'admin');
    }
  }
}
```
