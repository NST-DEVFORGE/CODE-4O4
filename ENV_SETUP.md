 # Environment Variables Required

## Security-Related Variables (NEW - REQUIRED)

### JWT_SECRET
**Required**: YES  
**Description**: Secret key for signing and verifying JWT tokens  
**How to generate**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
**Example**:
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### ADMIN_PASSWORD
**Required**: YES (already exists)  
**Description**: Password for admin authentication  
**Note**: Keep this secure and change it regularly

---

## Existing Variables

### Firebase Configuration
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### SMTP Configuration
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

### Other
```bash
WEBPUSH_SEND_SECRET=your-webpush-secret
```

---

## Deployment Instructions

### Vercel Deployment

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables

2. Add the following NEW variable:
   ```
   JWT_SECRET = [paste generated secret]
   ```

3. Verify existing variables are set:
   - `ADMIN_PASSWORD`
   - All Firebase variables
   - SMTP variables

4. Redeploy the application

### Local Development

1. Create `.env.local` file in project root:
   ```bash
   cp .env.example .env.local
   ```

2. Add all required variables to `.env.local`

3. Never commit `.env.local` to git (already in .gitignore)

---

## Security Best Practices

- ✅ Never commit `.env` files to version control
- ✅ Use different secrets for development and production
- ✅ Rotate secrets regularly (every 90 days recommended)
- ✅ Use strong, random values for all secrets
- ✅ Limit access to environment variables
- ✅ Monitor for exposed secrets in code
