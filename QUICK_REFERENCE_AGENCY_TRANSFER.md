# Quick Reference - Agency Account Transfer

## ✅ What's Implemented

When you approve an agency application, the system now:

1. ✅ **Creates a new `agencyAccounts` document** with all agency data
2. ✅ **Updates the `users` document** to link to the agency account
3. ✅ **Updates the `agencies` document** to mark as approved
4. ✅ **Logs the activity** in `adminlogs`

## 🔥 Firebase Collections After Approval

### `users/{userId}` - Updated
```json
{
  "type": "Agency",                    // Changed from "Traveler"
  "agencies": ["agency-123"],          // Agency ID added
  "hasAgencyAccount": true,            // NEW field
  "agencyAccountId": "agency-123"      // NEW field
}
```

### `agencies/{agencyId}` - Updated
```json
{
  "status": "active",                  // Changed from "pending"
  "application": {
    "isApproved": true,                // Changed from false
    "reviewedOn": "2024-01-15...",     // Added
    "reviewedBy": "admin@..."          // Added
  }
}
```

### `agencyAccounts/{agencyId}` - ✨ NEW CREATED
```json
{
  "agencyId": "agency-123",
  "userId": "user-xyz789",
  "ownerName": "John Doe",
  "ownerEmail": "john@example.com",
  "agencyName": "Sunset Travel Co.",
  "registrationNumber": "REG-12345",
  "businessEmail": "business@sunsettravel.com",
  "accountType": "Agency",
  "status": "active",
  "isApproved": true,
  "approvedOn": "2024-01-15...",
  "approvedBy": "admin@..."
}
```

## 🚀 How to Use in Your App

### Check if user has agency account:
```javascript
const userDoc = await getDoc(doc(db, 'users', userId));
const userData = userDoc.data();

if (userData.hasAgencyAccount) {
  console.log('User has agency account!');
  console.log('Agency Account ID:', userData.agencyAccountId);
}
```

### Get agency account:
```javascript
const agencyAccountDoc = await getDoc(
  doc(db, 'agencyAccounts', userData.agencyAccountId)
);
const agencyAccount = agencyAccountDoc.data();
console.log('Agency:', agencyAccount.agencyName);
```

### Login redirect:
```javascript
if (userData.type === 'Agency' && userData.hasAgencyAccount) {
  // Load agency account
  const agencyAccountDoc = await getDoc(
    doc(db, 'agencyAccounts', userData.agencyAccountId)
  );
  
  // Redirect to agency dashboard
  navigate('/agency/dashboard', { 
    state: { agencyAccount: agencyAccountDoc.data() } 
  });
}
```

## 🧪 Testing

1. **Create test application** in Firebase Console:
   - Collection: `agencies`
   - Status: `pending`
   - Include `contactPerson.userID`

2. **Create test user** in Firebase Console:
   - Collection: `users`
   - Type: `Traveler`
   - Match the userID in agency application

3. **Approve in admin panel**:
   - Go to Applications tab
   - Click "Approve"

4. **Verify in Firebase Console**:
   - Check `users` → type should be "Agency"
   - Check `agencies` → status should be "active"
   - Check `agencyAccounts` → NEW document should exist

## 🔐 Security Rules

Add to your Firestore rules:

```javascript
match /agencyAccounts/{agencyAccountId} {
  // Only the owner or admin can read
  allow read: if request.auth != null && (
    resource.data.userId == request.auth.uid ||
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.type == 'Admin'
  );
  
  // Only admin can write
  allow write: if request.auth != null &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.type == 'Admin';
}
```

## 📋 Checklist

- [x] Admin can approve applications
- [x] System creates `agencyAccounts` document
- [x] System updates `users` document
- [x] System updates `agencies` document
- [x] Activity is logged
- [ ] Add security rules for `agencyAccounts`
- [ ] Update login flow in main app
- [ ] Create agency dashboard in main app

## 🎯 Key Points

- **User account stays in `users`** for authentication
- **Agency account created in `agencyAccounts`** for operations
- **Both are linked** via `userId` and `agencyAccountId`
- **User can log in** with original credentials
- **System redirects** to agency dashboard based on `type`

## 📚 Full Documentation

- `AGENCY_ACCOUNT_TRANSFER.md` - Complete explanation
- `ACCOUNT_TRANSFER_VISUAL.md` - Visual diagrams
- `AGENCY_APPROVAL_FLOW.md` - Original approval flow

---

**Status:** ✅ Fully Implemented  
**Last Updated:** October 23, 2025
