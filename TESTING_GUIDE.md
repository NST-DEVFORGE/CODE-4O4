# 🧪 Testing Guide - Web App & Notifications

## Pre-Deployment Checklist

### 1. **Add VAPID Key** (REQUIRED)
```bash
# Add to .env.local and Vercel environment variables
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key-here
```

Get from: Firebase Console → Cloud Messaging → Web Push certificates

### 2. **Verify Environment Variables**
Check these are set in Vercel:
- ✅ All Firebase config variables
- ✅ Email SMTP credentials
- ✅ `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

---

## 🌐 Web App Testing

### Desktop Testing
1. **Login Flow**
   - [ ] Login with credentials
   - [ ] Refresh page → Should stay logged in (not redirect to home)
   - [ ] Check console for "🔄 Restoring session cookie" message

2. **Navigation**
   - [ ] Full navbar visible at top
   - [ ] All links work (Dashboard, Projects, Events, Sessions, Leaderboard)
   - [ ] Profile dropdown shows correctly
   - [ ] Logout works properly

3. **Admin Panel** (admin/mentor only)
   - [ ] Access `/admin` route
   - [ ] No React Hooks order errors in console
   - [ ] Can approve/reject members
   - [ ] Can view project interests

### Mobile Testing (< 1024px width)
1. **Floating Action Buttons (FABs)**
   - [ ] Navbar hidden on mobile
   - [ ] Two floating buttons visible (bottom-right):
     - Cyan menu button (hamburger icon)
     - Notification bell
   - [ ] Buttons positioned in thumb-friendly zone
   - [ ] Smooth animations on appear

2. **Mobile Navigation**
   - [ ] Click menu button → Sidebar slides in from right
   - [ ] Sidebar shows all navigation links
   - [ ] Click outside → Sidebar closes
   - [ ] Profile section visible in sidebar

3. **Responsiveness**
   - [ ] Content adjusts properly
   - [ ] No horizontal scroll
   - [ ] Buttons remain accessible

---

## 🔔 Notifications Testing

### 1. **Permission Request**
```javascript
// Open browser console and run:
Notification.requestPermission().then(perm => console.log('Permission:', perm))
```
- [ ] Browser asks for notification permission
- [ ] "Allow" grants permission
- [ ] "Block" denies permission

### 2. **Token Generation**
```javascript
// After granting permission, check:
// 1. Open DevTools → Application → Local Storage
// 2. Look for FCM token (long string)
```
- [ ] FCM token generated and stored
- [ ] Token visible in localStorage

### 3. **Subscribe to Notifications**
Click the notification bell icon:
- [ ] Bell icon shows in navbar (desktop) or floating (mobile)
- [ ] Click opens dropdown
- [ ] "Enable Notifications" button visible
- [ ] Click button → Permission requested
- [ ] After allowing → Shows "Notifications enabled" message

### 4. **Test Notification Sending**

**Option A: Using Test Script**
```bash
npm run test:notifications
```
Follow the prompts to send test notifications.

**Option B: Trigger Real Events**
1. **New Member Joins**
   - [ ] Fill out join form
   - [ ] Admin receives notification

2. **Project Interest**
   - [ ] Express interest in a project
   - [ ] Project creator receives notification

3. **Admin Decision**
   - [ ] Admin approves/rejects member
   - [ ] Applicant receives notification

4. **Event RSVP**
   - [ ] RSVP to an event
   - [ ] Admins receive notification

### 5. **Notification Display**
- [ ] **Background**: Notification appears when tab is inactive
- [ ] **Foreground**: In-app notification or dropdown updates
- [ ] **Click**: Clicking notification navigates to relevant page
- [ ] **Badge**: Unread count shows on bell icon
- [ ] **Sound**: Browser plays notification sound (if enabled)

### 6. **Notification Dropdown**
Click the notification bell:
- [ ] Dropdown shows recent notifications
- [ ] Unread notifications highlighted
- [ ] Click notification → Marks as read + navigates
- [ ] "View All" button works
- [ ] Empty state shows when no notifications

---

## 📊 Firebase Usage Monitoring

### Check Current Usage
```bash
npm run monitor:usage
```
Expected output:
- **Daily reads**: 660 - 4,000 (1-8% of limit)
- **Daily writes**: 30 - 200 (<1% of limit)
- **Notifications**: Unlimited (FCM is free)

### Monitor After Deployment
1. **Firebase Console** → Usage tab
2. Track these metrics:
   - Reads per day (target: < 10,000)
   - Writes per day (target: < 2,000)
   - Active users

3. **Optimization Working?**
   - [ ] Cache hit rate > 70%
   - [ ] Lazy loading reduces reads
   - [ ] No unnecessary re-fetches

---

## 🔍 Common Issues & Fixes

### Issue: Redirected to home on refresh
**Fix**: Check browser console for:
- "🔄 Restoring session cookie" message
- Cookie set successfully
- If missing, clear cookies and login again

### Issue: Notification permission denied
**Fix**: 
1. Open browser settings
2. Site settings → Notifications → Allow
3. Refresh page and try again

### Issue: Hooks order error
**Fix**: Already fixed! Check that:
- All hooks are called before any conditional returns
- No early returns before `useEffect`

### Issue: Service worker not registering
**Fix**:
1. Check `/firebase-messaging-sw.js` is accessible
2. Must be at root of public folder
3. Must be served over HTTPS (or localhost)

### Issue: Notifications not appearing
**Check**:
1. Browser notification permission granted?
2. FCM token generated? (Check localStorage)
3. Service worker registered? (DevTools → Application → Service Workers)
4. Firebase Cloud Messaging enabled? (Firebase Console)
5. VAPID key set in environment variables?

---

## 🚀 Production Deployment Checklist

### Before Deploying
- [ ] All environment variables set in Vercel
- [ ] VAPID key added to Vercel
- [ ] Build succeeds locally: `npm run build`
- [ ] No console errors
- [ ] All tests pass

### After Deploying
- [ ] Test login/logout flow
- [ ] Test mobile responsiveness
- [ ] Request notification permission
- [ ] Send test notification
- [ ] Check Firebase usage (should be low)
- [ ] Monitor errors in Vercel logs

### Performance Checks
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Service Worker caching working

---

## 📱 PWA Testing (Optional)

### Desktop
1. Chrome: Click install icon in address bar
2. [ ] App installs successfully
3. [ ] Launches in standalone window
4. [ ] All features work offline (cached pages)

### Mobile
1. Safari (iOS): Share → Add to Home Screen
2. Chrome (Android): Menu → Install app
3. [ ] Icon appears on home screen
4. [ ] Opens like native app (no browser UI)
5. [ ] Notifications work in standalone mode

---

## 🎯 Success Criteria

### Must Have
- ✅ No console errors
- ✅ Login persists on refresh
- ✅ Mobile FABs work perfectly
- ✅ Notifications send and display correctly
- ✅ Firebase usage under free tier limits
- ✅ No React Hooks violations

### Should Have
- ✅ Fast page loads (< 2s)
- ✅ Smooth animations
- ✅ Responsive on all screen sizes
- ✅ PWA installable

### Nice to Have
- ✅ Offline support (service worker caching)
- ✅ Push notifications on mobile home screen
- ✅ Badge counts update in real-time

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify environment variables
3. Run `npm run monitor:usage` to check Firebase
4. Test in incognito mode (rules out extension conflicts)
5. Clear cache and cookies

**Happy Testing! 🎉**
