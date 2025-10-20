# Firebase Setup Guide - Fix 400 Error

## 🔴 Current Error
```
GET https://firestore.googleapis.com/google.firestore.v1.Firestore/Listen/...
net::ERR_ABORTED 400 (Bad Request)
WebChannelConnection RPC 'Listen' stream errored
```

## 🎯 Root Cause
This error occurs because **Firestore Security Rules** are blocking the real-time listener. By default, Firebase denies all read/write operations for security.

---

## ✅ Solution: Update Firestore Security Rules

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **taralets-3adb8**
3. Click **Firestore Database** in the left sidebar
4. Click the **Rules** tab at the top

### Step 2: Update Security Rules

Replace the existing rules with these **development-friendly rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own admin logs
    match /adminlogs/{logId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow all other collections (adjust as needed)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 3: Publish Rules
1. Click the **Publish** button
2. Wait for confirmation message

---

## 🔒 Production-Ready Rules (Recommended)

For better security in production, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin logs - users can only read/write their own logs
    match /adminlogs/{logId} {
      allow read: if request.auth != null && 
                     (resource.data.adminId == request.auth.uid ||
                      resource.data.adminEmail == request.auth.token.email);
      allow create: if request.auth != null &&
                       request.resource.data.adminId == request.auth.uid;
      allow update, delete: if false; // Logs should not be modified
    }
    
    // Other collections - customize based on your needs
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Admins can modify users
    }
    
    match /alerts/{alertId} {
      allow read, write: if request.auth != null;
    }
    
    match /emergencies/{emergencyId} {
      allow read, write: if request.auth != null;
    }
    
    match /agencies/{agencyId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🚨 Quick Fix (Development Only)

**⚠️ WARNING: Only use this for testing! NOT for production!**

If you need to test quickly, you can temporarily allow all access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ INSECURE - Anyone can access!
    }
  }
}
```

**Remember to change this before deploying to production!**

---

## 🔧 Alternative: Enable Firebase Authentication

The error might also occur if Firebase Authentication is not properly set up. Here's how to fix it:

### Option 1: Anonymous Authentication (Easiest)
1. Go to Firebase Console → **Authentication**
2. Click **Sign-in method** tab
3. Enable **Anonymous** authentication
4. Save changes

### Option 2: Email/Password Authentication
1. Go to Firebase Console → **Authentication**
2. Click **Sign-in method** tab
3. Enable **Email/Password** authentication
4. Create an admin user in the **Users** tab

---

## 📝 What Changed in Your Code

I've updated `ProfileSection.jsx` to:
- ✅ Gracefully handle Firebase listener errors
- ✅ Fall back to one-time fetch if real-time listener fails
- ✅ Show user-friendly error messages
- ✅ Prevent console spam with warnings instead of errors

---

## 🧪 Testing After Fix

1. **Update Firestore Rules** (see above)
2. **Refresh your admin panel**
3. **Go to Profile → Security → View History**
4. **Check console** - the 400 error should be gone

If you still see errors:
- Check that your Firebase config is correct
- Verify your project ID matches: `taralets-3adb8`
- Ensure you're logged in with a valid access token

---

## 📊 Current Firebase Configuration

Your app is using:
```javascript
{
  apiKey: "AIzaSyCn20TvjC98ePXmOEQiJySSq2QN2p0QuRg",
  authDomain: "taralets-3adb8.firebaseapp.com",
  projectId: "taralets-3adb8",
  storageBucket: "taralets-3adb8.firebasestorage.app",
  messagingSenderId: "353174524186",
  appId: "1:353174524186:web:45cf6ee4f8878bc0df9ca3"
}
```

This configuration is correct ✅

---

## 🆘 Still Having Issues?

If the error persists after updating security rules:

1. **Clear browser cache and reload**
2. **Check Firebase Console → Firestore → Data** - verify the `adminlogs` collection exists
3. **Check browser console** for authentication errors
4. **Verify localStorage** has valid `accessToken` and `user` data

---

## 📞 Quick Checklist

- [ ] Updated Firestore Security Rules
- [ ] Published the rules in Firebase Console
- [ ] Refreshed the admin panel
- [ ] Checked that adminlogs collection exists
- [ ] Verified authentication is working
- [ ] Tested View History modal

---

**Last Updated:** October 2025  
**Status:** ✅ Code Updated - Awaiting Firebase Rules Configuration
