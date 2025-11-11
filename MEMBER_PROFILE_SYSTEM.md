# Member Profile & Leaderboard System

## 🎯 Overview

Complete member profile management system with leaderboard integration for tracking member progress, achievements, and contributions.

---

## 📋 Member Profile Features

### Profile Management
Members can now:
- ✅ View and edit their personal information
- ✅ Add bio and social links (GitHub, Portfolio)
- ✅ Manage skills list
- ✅ Update experience level
- ✅ Track their stats (points, badges, projects completed)
- ✅ View quick actions and navigation

### Profile Fields

#### Personal Information
- **Name** - Full name
- **Email** - Contact email
- **Phone** - Phone number (optional)
- **Bio** - Personal description
- **Experience Level** - beginner | intermediate | advanced
- **Role** - student | mentor | alumni | admin

#### Social Links
- **GitHub** - GitHub username
- **Portfolio** - Portfolio website URL

#### Skills & Interests
- **Skills** - Array of skill tags (editable)
- **Interests** - Array of interest areas

#### Stats (Leaderboard Integration)
- **Points** - Total points earned
- **Badges** - Total badges earned
- **Projects Completed** - Number of completed projects

---

## 🏆 Points System

### How to Earn Points

| Action | Points Awarded |
|--------|----------------|
| Join a project | +10 points |
| Complete a project | +50 points |
| Attend an event | +25 points |
| Custom awards | Variable |

### Automatic Point Awards

Points are automatically awarded when:
1. **Joining a Project**: When owner approves join request → +10 points
2. **Completing a Project**: When project status changes to "completed" → +50 points
3. **Attending Events**: When event attendance is confirmed → +25 points

---

## 📊 Leaderboard System

### Current Features
- Rankings based on total points
- Display top members
- Show points, badges, and projects completed
- Real-time updates

### Future Enhancements (Planned)
- [ ] Weekly/Monthly leaderboards
- [ ] Category-based rankings (projects, events, contributions)
- [ ] Achievement badges with criteria
- [ ] Level system (Bronze, Silver, Gold, Platinum)
- [ ] Streak tracking
- [ ] Contribution graphs

---

## 🔧 API Endpoints

### Profile Management

#### Get Profile
```http
GET /api/profile?userId={userId}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "github": "johndoe",
    "portfolio": "https://johndoe.com",
    "bio": "Passionate developer",
    "skills": ["React", "Node.js", "Python"],
    "interests": ["AI", "Web Dev"],
    "experience": "intermediate",
    "role": "student",
    "points": 150,
    "badges": 3,
    "projectsCompleted": 2
  }
}
```

#### Update Profile
```http
PATCH /api/profile
Content-Type: application/json

{
  "id": "user123",
  "name": "John Doe",
  "bio": "Updated bio",
  "skills": ["React", "Node.js"],
  "github": "johndoe"
}
```

### Leaderboard & Stats

#### Update Member Stats
```http
POST /api/leaderboard
Content-Type: application/json

{
  "userId": "user123",
  "action": "addPoints",
  "value": 10
}
```

**Available Actions:**
- `addPoints` - Add points to user
- `addBadge` - Add a badge
- `completeProject` - Mark project as completed (+50 points)
- `joinProject` - Award points for joining (+10 points)
- `attendEvent` - Award points for attendance (+25 points)
- `setPoints` - Set exact point value
- `setBadges` - Set exact badge count

#### Get Leaderboard
```http
GET /api/leaderboard?limit=50
```

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "rank": 1,
      "id": "user123",
      "name": "John Doe",
      "points": 250,
      "badges": 5,
      "projectsCompleted": 4
    }
  ]
}
```

#### Get User Stats
```http
GET /api/leaderboard?userId={userId}
```

---

## 🚀 Usage Examples

### Award Points When User Joins Project

Already integrated in `/api/project-interests/route.ts`:

```typescript
// Award points for joining a project
const userRef = db.collection("members").doc(userId);
const userDoc = await userRef.get();
if (userDoc.exists) {
  const currentPoints = userDoc.data()?.points || 0;
  await userRef.update({
    points: currentPoints + 10,
    updatedAt: new Date(),
  });
}
```

### Manual Point Award (Admin)

```typescript
// Award custom points
await fetch('/api/leaderboard', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    action: 'addPoints',
    value: 25
  })
});
```

### Award Badge

```typescript
await fetch('/api/leaderboard', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    action: 'addBadge'
  })
});
```

### Mark Project Completed

```typescript
// Awards 50 points + increments projectsCompleted
await fetch('/api/leaderboard', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    action: 'completeProject'
  })
});
```

---

## 🗄️ Firebase Schema Updates

### Members Collection

```javascript
{
  // Existing fields
  id: string,
  name: string,
  email: string,
  role: "student" | "mentor" | "alumni" | "admin",
  
  // New profile fields
  phone: string,
  github: string,
  portfolio: string,
  bio: string,
  skills: string[],
  interests: string[],
  experience: "beginner" | "intermediate" | "advanced",
  availability: string,
  
  // Leaderboard fields
  points: number,                 // Default: 0
  badges: number,                 // Default: 0
  projectsCompleted: number,      // Default: 0
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Example Member Document

```javascript
{
  id: "user123",
  name: "John Doe",
  email: "john@example.com",
  role: "student",
  phone: "+1234567890",
  github: "johndoe",
  portfolio: "https://johndoe.com",
  bio: "Passionate about AI and web development",
  skills: ["React", "Node.js", "Python", "TensorFlow"],
  interests: ["Machine Learning", "Web Development"],
  experience: "intermediate",
  availability: "Weekends",
  points: 150,
  badges: 3,
  projectsCompleted: 2,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🎨 UI Components

### Profile Page
**Location:** `/dashboard/profile`

Features:
- Profile header with avatar
- Personal information form
- Social links section
- Skills management with add/remove
- Stats sidebar (points, badges, projects)
- Quick actions menu
- Edit/Save/Cancel controls

### Navigation Update
Added "Profile" link to dashboard sidebar:
- Icon: User icon
- Link: `/dashboard/profile`
- Accessible to all authenticated users

---

## 🔮 Future Leaderboard Features

### Planned Enhancements

1. **Achievement Badges**
   - First Project
   - Team Player (5 projects)
   - Event Enthusiast (10 events)
   - Code Master (advanced level)
   - Mentor Badge
   - Community Champion

2. **Level System**
   ```
   0-99 points:     Bronze
   100-299 points:  Silver
   300-599 points:  Gold
   600+ points:     Platinum
   ```

3. **Leaderboard Categories**
   - Overall ranking
   - Project contributions
   - Event attendance
   - Community engagement
   - Monthly/Weekly leaders

4. **Streak System**
   - Daily login streaks
   - Project participation streaks
   - Event attendance streaks

5. **Contribution Graphs**
   - Activity heatmap
   - Points over time
   - Project timeline

6. **Team Rankings**
   - Project team leaderboards
   - Collaborative achievements

---

## 📱 Access Points

### For Members
1. Navigate to Dashboard
2. Click "Profile" in sidebar
3. View/Edit profile information
4. Track stats and progress

### For Admins
1. Use leaderboard API to award points
2. Manage badges manually
3. View all member stats
4. Generate reports (future)

---

## 🔒 Security Considerations

1. **Profile Updates**
   - Members can only edit their own profile
   - Email changes may require verification (future)
   - Admin can view all profiles

2. **Points & Badges**
   - Automatic awards through system events
   - Manual awards require admin privileges
   - Audit log for point changes (future)

3. **Data Privacy**
   - Phone numbers are optional
   - Social links are optional
   - Bio is public within club

---

## 🐛 Troubleshooting

### Profile not loading
1. Check if user is authenticated
2. Verify Firebase connection
3. Check console for errors
4. Ensure members collection exists

### Points not updating
1. Verify leaderboard API is accessible
2. Check Firebase rules
3. Review console logs
3. Ensure member document exists

### Skills not saving
1. Press Enter after typing skill
2. Click Save button
3. Check for JavaScript errors
4. Verify array field in Firebase

---

## ✅ Testing Checklist

- [ ] View profile page
- [ ] Edit profile information
- [ ] Add/remove skills
- [ ] Update social links
- [ ] Save profile changes
- [ ] View updated stats
- [ ] Join a project (check points)
- [ ] View leaderboard
- [ ] Award manual points (admin)
- [ ] Check Firebase data

---

## 📞 Support

For issues or questions:
1. Check console logs
2. Verify Firebase connection
3. Review this documentation
4. Check API endpoint responses
