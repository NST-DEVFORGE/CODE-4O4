# Setup credentials for Sahitya Singh

Once the deployment is complete, run this command to set up credentials:

```bash
curl -X PATCH https://website-h9ee3h4v9-geetansh-goyals-projects.vercel.app/api/members/credentials \
  -H "Content-Type: application/json" \
  -d '{"memberId": "user-1762834506814-7ej1ufwp6"}'
```

This will set:
- **Username**: `sahitya` (from first name "Sahitya")
- **Password**: `sahitya123` (firstname + 123)

Then the user can login with these credentials!

## Alternative: Manually update in Firebase Console

Go to Firebase Console → Firestore → members collection → document `user-1762834506814-7ej1ufwp6`

Add these fields:
- `username`: `sahitya`
- `password`: `sahitya123`
