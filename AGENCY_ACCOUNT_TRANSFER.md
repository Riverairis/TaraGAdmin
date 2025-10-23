# Agency Account Transfer System

## 🎯 What Happens When You Approve an Agency Application

When an admin approves an agency application, the system now creates a **separate agency account** while maintaining the original user account for authentication.

## 📊 Three Collections Working Together

### 1. **`users` Collection** (Original User Account)
- **Purpose**: Authentication and basic user data
- **Remains Active**: User can still log in with their credentials
- **Updated Fields**:
  ```javascript
  {
    type: 'Agency',                    // Changed from 'Traveler'
    agencies: ['agency-id-123'],       // Agency IDs linked to this user
    hasAgencyAccount: true,            // NEW: Indicates agency account exists
    agencyAccountId: 'agency-id-123',  // NEW: Link to agency account
    updatedAt: [Timestamp]
  }
  ```

### 2. **`agencies` Collection** (Application Data)
- **Purpose**: Store agency application and business information
- **Updated Fields**:
  ```javascript
  {
    status: 'active',                  // Changed from 'pending'
    application: {
      isApproved: true,
      reviewedOn: [Timestamp],
      reviewedBy: 'admin@example.com',
      message: 'Approved!'
    }
  }
  ```

### 3. **`agencyAccounts` Collection** (NEW - Agency Operating Account)
- **Purpose**: Dedicated account for agency operations
- **Created When**: Application is approved
- **Document ID**: Same as agency ID
- **Contains**:
  ```javascript
  {
    // Link to original user and agency
    agencyId: 'agency-id-123',
    userId: 'user-xyz789',
    
    // Owner information (transferred from user account)
    ownerName: 'John Doe',
    ownerEmail: 'john@example.com',
    ownerPhone: '+63 912 345 6789',
    profileImage: 'https://...',
    
    // Agency business information
    agencyName: 'Sunset Travel Co.',
    registrationNumber: 'REG-12345',
    businessEmail: 'business@sunsettravel.com',
    businessPhone: '+63 917 890 1234',
    description: 'Premium travel services...',
    type: 'Sole Proprietor',
    dateEstablished: '2020-01-01',
    address: ['123 Street', 'City', ...],
    
    // Account status
    accountType: 'Agency',
    status: 'active',
    isApproved: true,
    
    // Timestamps
    approvedOn: [Timestamp],
    approvedBy: 'admin@example.com',
    createdOn: [Timestamp],
    updatedOn: [Timestamp]
  }
  ```

## 🔄 Complete Approval Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Admin clicks "Approve" on agency application                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. Fetch agency document (agencies collection)                 │
│     - Get agency data                                           │
│     - Get contactPerson.userID                                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Fetch user document (users collection)                      │
│     - Get user personal data                                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Update agency document (agencies collection)                │
│     - status: 'active'                                          │
│     - application.isApproved: true                              │
│     - application.reviewedOn: [timestamp]                       │
│     - application.reviewedBy: [admin ID]                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. CREATE agency account (agencyAccounts collection) ✨ NEW    │
│     - Transfer user data (name, email, phone, photo)            │
│     - Add agency business data                                  │
│     - Set status: 'active'                                      │
│     - Link to user and agency                                   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Update user document (users collection)                     │
│     - type: 'Agency'                                            │
│     - agencies: [agency ID]                                     │
│     - hasAgencyAccount: true                                    │
│     - agencyAccountId: [agency ID]                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Log activity (adminlogs collection)                         │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  7. Show success message                                        │
│  8. Refresh applications list                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Before and After Comparison

### Before Approval:

**users/user-xyz789:**
```json
{
  "fname": "John",
  "lname": "Doe",
  "email": "john@example.com",
  "type": "Traveler",
  "agencies": []
}
```

**agencies/agency-123:**
```json
{
  "name": "Sunset Travel Co.",
  "status": "pending",
  "contactPerson": {
    "userID": "user-xyz789"
  },
  "application": {
    "isApproved": false
  }
}
```

**agencyAccounts/agency-123:**
```
Does not exist yet
```

### After Approval:

**users/user-xyz789:**
```json
{
  "fname": "John",
  "lname": "Doe",
  "email": "john@example.com",
  "type": "Agency",                    // ✅ Changed
  "agencies": ["agency-123"],          // ✅ Added
  "hasAgencyAccount": true,            // ✅ NEW
  "agencyAccountId": "agency-123",     // ✅ NEW
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**agencies/agency-123:**
```json
{
  "name": "Sunset Travel Co.",
  "status": "active",                  // ✅ Changed
  "contactPerson": {
    "userID": "user-xyz789"
  },
  "application": {
    "isApproved": true,                // ✅ Changed
    "reviewedOn": "2024-01-15T10:30:00Z",
    "reviewedBy": "admin@example.com"
  }
}
```

**agencyAccounts/agency-123:** ✨ **NEW DOCUMENT CREATED**
```json
{
  "agencyId": "agency-123",
  "userId": "user-xyz789",
  "ownerName": "John Doe",
  "ownerEmail": "john@example.com",
  "ownerPhone": "+63 912 345 6789",
  "agencyName": "Sunset Travel Co.",
  "registrationNumber": "REG-12345",
  "businessEmail": "business@sunsettravel.com",
  "accountType": "Agency",
  "status": "active",
  "isApproved": true,
  "approvedOn": "2024-01-15T10:30:00Z",
  "approvedBy": "admin@example.com"
}
```

## 🎯 Why This Approach?

### ✅ Benefits:

1. **Separation of Concerns**
   - User account for authentication
   - Agency account for business operations
   - Clear data organization

2. **Maintains Authentication**
   - User can still log in with original credentials
   - Firebase Auth remains unchanged
   - No authentication issues

3. **Data Integrity**
   - Original user data preserved
   - Agency data separate and organized
   - Easy to query and manage

4. **Flexibility**
   - One user can have multiple agencies
   - Easy to switch between user and agency modes
   - Clear ownership tracking

5. **Security**
   - Separate permissions for user vs agency operations
   - Better access control
   - Audit trail maintained

## 🔍 How to Query Agency Accounts

### Get agency account by user ID:
```javascript
const userDoc = await getDoc(doc(db, 'users', userId));
const userData = userDoc.data();

if (userData.hasAgencyAccount) {
  const agencyAccountId = userData.agencyAccountId;
  const agencyAccountDoc = await getDoc(doc(db, 'agencyAccounts', agencyAccountId));
  const agencyAccount = agencyAccountDoc.data();
  console.log('Agency Account:', agencyAccount);
}
```

### Get all agency accounts:
```javascript
const agencyAccountsRef = collection(db, 'agencyAccounts');
const q = query(agencyAccountsRef, where('status', '==', 'active'));
const querySnapshot = await getDocs(q);

querySnapshot.forEach((doc) => {
  console.log(doc.id, '=>', doc.data());
});
```

### Get agency account by agency ID:
```javascript
const agencyAccountDoc = await getDoc(doc(db, 'agencyAccounts', agencyId));
if (agencyAccountDoc.exists()) {
  const agencyAccount = agencyAccountDoc.data();
  console.log('Agency Account:', agencyAccount);
}
```

## 🚀 Using Agency Accounts in Your App

### Login Flow:
```javascript
// After user logs in
const userDoc = await getDoc(doc(db, 'users', user.uid));
const userData = userDoc.data();

if (userData.type === 'Agency' && userData.hasAgencyAccount) {
  // Load agency account
  const agencyAccountDoc = await getDoc(
    doc(db, 'agencyAccounts', userData.agencyAccountId)
  );
  const agencyAccount = agencyAccountDoc.data();
  
  // Redirect to agency dashboard with agency account data
  navigate('/agency/dashboard', { state: { agencyAccount } });
} else {
  // Regular user flow
  navigate('/dashboard');
}
```

### Agency Dashboard:
```javascript
const AgencyDashboard = () => {
  const [agencyAccount, setAgencyAccount] = useState(null);
  
  useEffect(() => {
    const fetchAgencyAccount = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      // Get user document
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();
      
      // Get agency account
      if (userData.hasAgencyAccount) {
        const agencyAccountDoc = await getDoc(
          doc(db, 'agencyAccounts', userData.agencyAccountId)
        );
        setAgencyAccount(agencyAccountDoc.data());
      }
    };
    
    fetchAgencyAccount();
  }, []);
  
  return (
    <div>
      <h1>Welcome, {agencyAccount?.agencyName}!</h1>
      <p>Owner: {agencyAccount?.ownerName}</p>
      <p>Status: {agencyAccount?.status}</p>
    </div>
  );
};
```

## 🔐 Firestore Security Rules

Add rules for the new `agencyAccounts` collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Agency Accounts - only the owner and admins can read/write
    match /agencyAccounts/{agencyAccountId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.type == 'Admin'
      );
      
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.type == 'Admin';
    }
  }
}
```

## ✅ Summary

When you approve an agency application:

1. ✅ **Agency document updated** (status → 'active')
2. ✅ **Agency account created** (new document in `agencyAccounts` collection)
3. ✅ **User document updated** (type → 'Agency', linked to agency account)
4. ✅ **Admin activity logged**

The user account is **transferred** to agency status while maintaining authentication, and a dedicated agency account is created for business operations! 🎉

---

**Last Updated:** October 23, 2025  
**Status:** ✅ Fully Implemented
