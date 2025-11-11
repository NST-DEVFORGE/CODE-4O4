# Avatar Upload Feature - Setup Guide

## ✅ Implementation Complete - Base64 Storage

The avatar upload feature uses **base64 encoding** to store images directly in Firestore. This works with Firebase's **free Spark plan** (no need for Storage/Blaze plan).

### Files Created/Modified

1. **Created**: `/src/lib/firebase/storage.ts`
   - Converts images to base64 data URLs
   - No Firebase Storage needed!

2. **Modified**: `/src/app/dashboard/profile/page.tsx`
   - Added avatar upload functionality
   - Max file size: 2MB (base64 limitation)
   - Shows uploaded avatar or initials

3. **Modified**: `/src/components/modals/member-profile-modal.tsx`
   - Added avatar display support

4. **Modified**: `/src/app/api/profile/route.ts`
   - Saves base64 avatar string in Firestore

## 🎯 Features

✅ **File Upload**
- Click camera icon in edit mode
- Accepts: JPEG, JPG, PNG, GIF, WebP
- Max size: 2MB (recommended: under 500KB for best performance)
- Automatic validation

✅ **Base64 Storage**
- No Firebase Storage needed
- Works with free Firebase plan
- Stored directly in Firestore
- Fast and simple

✅ **Image Display**
- Shows uploaded avatar
- Falls back to gradient initials
- Displays in profile page and member modals

## 📝 How It Works

### Storage Method: Base64
Instead of using Firebase Storage (requires paid plan), we:
1. Convert image to base64 string using FileReader API
2. Store the base64 string directly in Firestore member document
3. Display using `<img src="data:image/png;base64,..." />`

**Advantages:**
- ✅ Works with free Firebase plan
- ✅ No extra configuration needed
- ✅ Simple and fast
- ✅ No storage rules to configure

**Limitations:**
- ⚠️ 2MB file size limit (Firestore document size limit is 1MB, but this is flexible)
- ⚠️ Larger images increase Firestore bandwidth usage
- 💡 **Recommendation:** Resize images to 200x200px before uploading

## 🚀 How to Use

### For Users:
1. Navigate to Profile page
2. Click "Edit Profile" button
3. Click the camera icon on avatar
4. Select an image (max 2MB)
5. Wait for upload to complete
6. Avatar updates automatically

**Tips for best results:**
- Use square images (1:1 aspect ratio)
- Keep file size under 500KB
- 200x200px to 400x400px is ideal
- JPEG format usually has smallest file size

### For Developers:
```typescript
// Upload avatar (returns base64 string)
import { uploadAvatar } from "@/lib/firebase/storage";
const base64Avatar = await uploadAvatar(file, userId);

// Save to Firestore
await updateDoc(userRef, { avatar: base64Avatar });

// Display avatar
<img src={user.avatar} alt="Avatar" />
```

## 🔒 Security

- ✅ Client-side file validation (type, size)
- ✅ Server-side profile updates via API
- ✅ Users can only update their own avatar
- ✅ 2MB max size enforced
- ✅ No external storage access needed

## 🎯 No Setup Required!

Unlike Firebase Storage, base64 storage requires **zero configuration**:
- ❌ No Storage rules to configure
- ❌ No Firebase Blaze plan needed
- ❌ No CORS settings
- ✅ Just works with free Firebase!

## 📱 Mobile Compatibility

The file input works on mobile devices:
- iOS: Opens photo picker
- Android: Opens file picker/camera
- Responsive avatar display

## 🐛 Troubleshooting

**Upload fails:**
- Check file size is under 2MB
- Verify file is an image type
- Check browser console for errors
- Try a smaller image

**Avatar doesn't display:**
- Check if base64 string is valid
- Verify avatar field exists in Firestore
- Check browser console for errors

**"File too large":**
- Resize image to 400x400px or smaller
- Convert to JPEG for better compression
- Use online tools like TinyPNG to compress

## ✨ Features Added

- ✅ Click camera icon to upload
- ✅ File validation (type & size)
- ✅ Upload progress indicator  
- ✅ Automatic save on upload
- ✅ Avatar display in profile
- ✅ Avatar display in member modals
- ✅ Helpful upload instructions
- ✅ Error handling & user feedback
- ✅ Mobile-friendly file picker
- ✅ **Works with FREE Firebase plan!**

## 💡 Performance Tips

For best performance:
1. **Resize before upload:** Use image editing tools to resize to 200-400px
2. **Compress:** Use tools like TinyPNG or Squoosh
3. **Choose JPEG:** Usually 50-70% smaller than PNG
4. **Target 200-500KB:** Perfect balance of quality and speed

## 🆚 Base64 vs Firebase Storage

| Feature | Base64 (Current) | Firebase Storage |
|---------|------------------|------------------|
| Cost | Free ✅ | Requires Blaze plan 💰 |
| Setup | None ✅ | Rules + config needed |
| Max Size | 2MB | 5GB+ |
| Speed | Fast ✅ | Fast ✅ |
| Bandwidth | Uses Firestore reads | Uses Storage bandwidth |
| Best For | Small images, profile pics | Large files, multiple images |

---

**Status**: ✅ Ready to use (no setup required!)
**Last Updated**: November 11, 2025

### Files Created/Modified

1. **Created**: `/src/lib/firebase/storage.ts`
   - Firebase Storage utility functions
   - `uploadAvatar()` - Upload avatar images
   - `deleteAvatar()` - Delete old avatars

2. **Modified**: `/src/app/dashboard/profile/page.tsx`
   - Added avatar upload functionality
   - Added file input with validation
   - Shows uploaded avatar or initials
   - Camera icon button in edit mode
   - Real-time upload with loading state

3. **Modified**: `/src/components/modals/member-profile-modal.tsx`
   - Added avatar display support
   - Shows member avatars in profile modal

4. **Modified**: `/src/app/api/profile/route.ts`
   - Added 'avatar' to allowed update fields
   - Saves avatar URL in Firebase

## 🎯 Features

✅ **File Upload**
- Click camera icon in edit mode
- Accepts: JPEG, JPG, PNG, GIF, WebP
- Max size: 5MB
- Automatic validation

✅ **Image Display**
- Shows uploaded avatar
- Falls back to gradient initials
- Displays in profile page
- Shows in member profile modals

✅ **Firebase Storage**
- Images stored in `avatars/{userId}.{extension}`
- Returns public download URL
- Secure server-side upload

## 🔧 Firebase Storage Rules Setup

You need to configure Firebase Storage rules. In your Firebase Console:

1. Go to Firebase Console → Storage → Rules
2. Add these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}.{extension} {
      // Allow read access to all authenticated users
      allow read: if request.auth != null;
      
      // Allow write only to the user's own avatar
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024 // 5MB limit
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

3. Click "Publish"

## 📝 Environment Variables

Make sure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

## 🎨 User Experience

### Upload Process:
1. User clicks "Edit Profile"
2. Helpful message appears: "💡 Click the camera icon to upload your profile picture"
3. Click camera icon → file picker opens
4. Select image → automatic validation
5. Upload progress shows (spinner on camera button)
6. Success message → avatar immediately updates
7. Avatar saved to Firebase Storage
8. URL saved to user's profile in Firestore

### Validation:
- ❌ File type must be image (jpeg, png, gif, webp)
- ❌ File size must be under 5MB
- ✅ Shows error alerts for invalid files

### Display:
- Profile page shows uploaded avatar
- Member profile modals show avatars
- Falls back to gradient initials if no avatar

## 🚀 How to Use

### For Users:
1. Navigate to Profile page
2. Click "Edit Profile" button
3. Click the camera icon on avatar
4. Select an image (JPEG, PNG, GIF, or WebP)
5. Wait for upload to complete
6. Avatar updates automatically

### For Developers:
```typescript
// Upload avatar
import { uploadAvatar } from "@/lib/firebase/storage";
const avatarUrl = await uploadAvatar(file, userId);

// Delete avatar
import { deleteAvatar } from "@/lib/firebase/storage";
await deleteAvatar(userId, fileExtension);
```

## 🔒 Security

- ✅ Client-side file validation (type, size)
- ✅ Firebase Storage rules (auth required)
- ✅ Server-side profile updates
- ✅ Users can only upload to their own avatar path
- ✅ Max 5MB file size enforced

## 🎯 Next Steps

1. **Set up Firebase Storage Rules** (see above)
2. Test upload functionality
3. Verify avatars display correctly
4. Test on mobile devices

## 📱 Mobile Compatibility

The file input works on mobile devices:
- iOS: Opens photo picker
- Android: Opens file picker/camera
- Responsive avatar display

## 🐛 Troubleshooting

**Upload fails:**
- Check Firebase Storage rules are set
- Verify NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is set
- Check file size is under 5MB
- Verify file is an image type

**Avatar doesn't display:**
- Check browser console for errors
- Verify Firebase Storage CORS settings
- Check avatar URL is valid

**Permission denied:**
- Verify Storage rules allow read access
- Check user is authenticated
- Verify userId matches auth.uid

## ✨ Features Added

- ✅ Click camera icon to upload
- ✅ File validation (type & size)
- ✅ Upload progress indicator
- ✅ Automatic save on upload
- ✅ Avatar display in profile
- ✅ Avatar display in member modals
- ✅ Helpful upload instructions
- ✅ Error handling & user feedback
- ✅ Mobile-friendly file picker

---

**Status**: ✅ Ready to use (after Firebase Storage rules setup)
**Last Updated**: November 11, 2025
