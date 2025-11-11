# Email Setup Guide for CODE 4O4 Dev Club

## Overview
The application now sends automated emails with login credentials to new members when they're approved or when credentials are regenerated.

## Email Configuration

### 1. Using PurelyMail (Recommended)

1. **Set up your PurelyMail account**
   - Sign up at: https://purelymail.com
   - Add your domain or use their provided email

2. **Get your email credentials**
   - Your email address
   - Your email password

3. **Update Environment Variables**
   Create or update your `.env.local` file:
   ```bash
   SMTP_HOST=smtp.purelymail.com
   SMTP_PORT=465
   SMTP_USER=your-email@your-domain.com
   SMTP_PASS=your-email-password
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 2. Using Gmail (Alternative)

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate an App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update Environment Variables**
   Create or update your `.env.local` file:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 3. Using Custom SMTP Server

Update your `.env.local`:
```bash
SMTP_HOST=smtp.your-domain.com
SMTP_PORT=465  # or 587 for STARTTLS
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Note:** Port 465 uses SSL/TLS, Port 587 uses STARTTLS. The system automatically detects and uses the correct security method.

### 4. Production Deployment (Vercel)

Add these environment variables in your Vercel project settings:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `NEXT_PUBLIC_APP_URL`

## Features

### 1. **Automatic Email on Member Approval**
When an admin approves a new member, the system:
- Generates unique credentials (username + password)
- Saves credentials to Firebase
- Sends a welcome email with login details
- Shows credentials in admin modal

### 2. **Bulk Credential Regeneration**
Admin can regenerate all member credentials:
- Click "🔑 Regenerate All Credentials" in Admin Portal
- System generates unique passwords for each member:
  - `firstname@123`
  - `firstname!123`
  - `firstname#123`
  - `firstname@lastname`
  - `firstname!lastname`
  - `firstname_###` (random number)
- Sends email to all members with new credentials
- Updates Firebase with new credentials

### 3. **Unique Password Patterns**
Each member gets a different password pattern based on their ID:
- More secure than using the same pattern for everyone
- Easy to remember (based on their name)
- Includes special characters (@, !, #, _)

## Email Template Features

The credential email includes:
- ✅ Professional branding with CODE 4O4 colors
- ✅ Clear display of username and password
- ✅ Direct link to login page
- ✅ Security warning to change password
- ✅ Welcome message and next steps
- ✅ Both HTML and plain text versions

## API Endpoints

### Generate/Update Credentials for Single Member
```bash
PATCH /api/members/credentials
Body: {
  "memberId": "member-id",
  "username": "optional-custom-username",
  "password": "optional-custom-password",
  "sendEmail": true
}
```

### Regenerate All Member Credentials (Admin Only)
```bash
POST /api/admin/regenerate-credentials
Body: {
  "sendEmails": true
}
```

## Testing Emails Locally

1. **Test with a real email** (recommended):
   - Use your Gmail with App Password
   - Send to your own email address first

2. **Check Email Logs**:
   - Check terminal/console for email sending logs
   - Look for ✅ success or ❌ error messages

3. **Test Without Sending Emails**:
   ```bash
   # Set sendEmail to false in the request
   POST /api/admin/regenerate-credentials
   Body: { "sendEmails": false }
   ```

## Troubleshooting

### Email Not Sending
1. Check environment variables are set correctly
2. Verify your email credentials (username and password)
3. Check SMTP port (465 for SSL/TLS, 587 for STARTTLS)
4. Ensure your email provider allows SMTP access
5. Look for errors in console/logs

### PurelyMail Issues
- Verify your domain is properly configured
- Check that SMTP is enabled in your account settings
- Confirm you're using the correct email and password
- Port 465 with SSL/TLS should work by default

### Gmail Blocks Emails
- Ensure 2FA is enabled
- Use App Password, not regular password
- Check "Less secure app access" is not needed (App Passwords bypass this)

### Rate Limiting
- Gmail: ~500 emails/day limit
- Bulk regeneration adds 1-second delay between emails
- For production, consider services like:
  - SendGrid
  - AWS SES
  - Mailgun
  - Postmark

## Security Best Practices

1. **Never commit `.env.local`** to git (already in .gitignore)
2. **Use App Passwords**, not regular passwords
3. **Rotate SMTP credentials** periodically
4. **Monitor email logs** for suspicious activity
5. **Set up email quotas** to prevent abuse

## Example Email Preview

```
Subject: 🎉 Welcome to CODE 4O4 Dev Club - Your Login Credentials

Hi Namah Omprakash,

Congratulations! Your membership has been approved.

Your Login Credentials:
Username: namah
Password: namah@123

[Login to Dashboard →]

⚠️ Security Note: Please keep your credentials secure and change 
your password after your first login.

Best regards,
CODE 4O4 Dev Club Team
```

## Support

For issues or questions, contact the admin team or check the logs in the admin portal.
