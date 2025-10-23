# Agency Account Transfer - Visual Guide

## 🎨 Visual Representation

### Before Approval:

```
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE COLLECTIONS                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📁 users                                                    │
│  └── user-xyz789                                            │
│      ├── fname: "John"                                      │
│      ├── lname: "Doe"                                       │
│      ├── email: "john@example.com"                          │
│      ├── type: "Traveler" 👤                                │
│      └── agencies: []                                       │
│                                                              │
│  📁 agencies                                                 │
│  └── agency-123                                             │
│      ├── name: "Sunset Travel Co."                          │
│      ├── status: "pending" ⏳                                │
│      ├── contactPerson:                                     │
│      │   └── userID: "user-xyz789"                          │
│      └── application:                                       │
│          └── isApproved: false ❌                            │
│                                                              │
│  📁 agencyAccounts                                           │
│  └── (empty)                                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Admin Clicks "Approve" 👨‍💼✅

```
        ┌─────────────────────────────────┐
        │   Admin Panel Action            │
        │   ✅ Approve Agency Application │
        └────────────┬────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────┐
        │   System Processing...          │
        │   🔄 Creating agency account    │
        │   🔄 Transferring user status   │
        │   🔄 Updating documents          │
        └─────────────────────────────────┘
```

### After Approval:

```
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE COLLECTIONS                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📁 users                                                    │
│  └── user-xyz789                                            │
│      ├── fname: "John"                                      │
│      ├── lname: "Doe"                                       │
│      ├── email: "john@example.com"                          │
│      ├── type: "Agency" 🏢 ✅ CHANGED                        │
│      ├── agencies: ["agency-123"] ✅ ADDED                   │
│      ├── hasAgencyAccount: true ✅ NEW                       │
│      └── agencyAccountId: "agency-123" ✅ NEW                │
│                                                              │
│  📁 agencies                                                 │
│  └── agency-123                                             │
│      ├── name: "Sunset Travel Co."                          │
│      ├── status: "active" ✅ CHANGED                         │
│      ├── contactPerson:                                     │
│      │   └── userID: "user-xyz789"                          │
│      └── application:                                       │
│          ├── isApproved: true ✅ CHANGED                     │
│          ├── reviewedOn: [timestamp] ✅ ADDED                │
│          └── reviewedBy: "admin@..." ✅ ADDED                │
│                                                              │
│  📁 agencyAccounts ✨ NEW DOCUMENT CREATED                   │
│  └── agency-123                                             │
│      ├── agencyId: "agency-123"                             │
│      ├── userId: "user-xyz789" 🔗 LINKED                     │
│      ├── ownerName: "John Doe"                              │
│      ├── ownerEmail: "john@example.com"                     │
│      ├── agencyName: "Sunset Travel Co."                    │
│      ├── registrationNumber: "REG-12345"                    │
│      ├── businessEmail: "business@sunsettravel.com"         │
│      ├── accountType: "Agency"                              │
│      ├── status: "active" ✅                                 │
│      ├── isApproved: true ✅                                 │
│      └── approvedOn: [timestamp]                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔗 Relationship Diagram

```
┌──────────────────────┐
│   User Account       │
│   (Authentication)   │
│                      │
│   user-xyz789        │
│   type: "Agency"     │
│   hasAgencyAccount   │
└──────────┬───────────┘
           │
           │ Links to
           │
           ▼
┌──────────────────────┐         ┌──────────────────────┐
│  Agency Application  │ Links   │   Agency Account     │
│  (Business Info)     │◄────────│   (Operations)       │
│                      │         │                      │
│   agency-123         │         │   agency-123         │
│   status: "active"   │         │   userId: user-xyz789│
│   contactPerson:     │         │   agencyId: agency-123│
│     userID           │         │   status: "active"   │
└──────────────────────┘         └──────────────────────┘
```

## 📊 Data Flow on Approval

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Admin Approves Application                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Fetch Data                                         │
│  ┌──────────────┐    ┌──────────────┐                       │
│  │ Get Agency   │    │  Get User    │                       │
│  │ Document     │    │  Document    │                       │
│  └──────────────┘    └──────────────┘                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Update Agency Document                             │
│  ┌──────────────────────────────────────────┐               │
│  │  agencies/agency-123                     │               │
│  │  ├── status: "active"                    │               │
│  │  └── application.isApproved: true        │               │
│  └──────────────────────────────────────────┘               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 4: CREATE Agency Account ✨                           │
│  ┌──────────────────────────────────────────┐               │
│  │  agencyAccounts/agency-123               │               │
│  │  ├── Transfer user data                  │               │
│  │  ├── Add agency business data            │               │
│  │  ├── Set status: "active"                │               │
│  │  └── Link to user & agency               │               │
│  └──────────────────────────────────────────┘               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Update User Document                               │
│  ┌──────────────────────────────────────────┐               │
│  │  users/user-xyz789                       │               │
│  │  ├── type: "Agency"                      │               │
│  │  ├── agencies: ["agency-123"]            │               │
│  │  ├── hasAgencyAccount: true              │               │
│  │  └── agencyAccountId: "agency-123"       │               │
│  └──────────────────────────────────────────┘               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 6: Log Activity & Show Success                        │
│  ✅ Agency account created                                   │
│  ✅ User transferred to agency status                        │
│  ✅ Admin activity logged                                    │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 What Gets Created/Updated

### ✅ Created:
```
📄 NEW DOCUMENT
Collection: agencyAccounts
Document ID: agency-123
Contains: Complete agency operating account
```

### ✅ Updated:
```
📝 UPDATED DOCUMENT
Collection: agencies
Document ID: agency-123
Changes: status, application.isApproved, timestamps

📝 UPDATED DOCUMENT
Collection: users
Document ID: user-xyz789
Changes: type, agencies[], hasAgencyAccount, agencyAccountId
```

## 🔍 How to Find Agency Account

### Method 1: From User ID
```
User ID (user-xyz789)
    ↓
Get user document
    ↓
Check hasAgencyAccount === true
    ↓
Get agencyAccountId
    ↓
Fetch agencyAccounts/{agencyAccountId}
    ↓
Agency Account Data ✅
```

### Method 2: From Agency ID
```
Agency ID (agency-123)
    ↓
Fetch agencyAccounts/{agency-123}
    ↓
Agency Account Data ✅
```

### Method 3: From User Login
```
User logs in
    ↓
Get user document from auth.currentUser.uid
    ↓
Check user.type === 'Agency'
    ↓
Get user.agencyAccountId
    ↓
Fetch agency account
    ↓
Load agency dashboard ✅
```

## 📱 User Experience Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. User registers as agency                                │
│     Status: Traveler 👤                                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Application submitted                                   │
│     Status: Pending ⏳                                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Admin approves ✅                                        │
│     ┌──────────────────────────────────┐                    │
│     │  System creates:                 │                    │
│     │  • Agency account                │                    │
│     │  • Transfers user to agency      │                    │
│     └──────────────────────────────────┘                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  4. User logs in                                            │
│     Status: Agency 🏢                                        │
│     Has: Agency Account ✅                                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Redirected to agency dashboard                          │
│     Can: Manage tours, bookings, etc.                       │
└─────────────────────────────────────────────────────────────┘
```

## 🎉 Summary

**Before:** User is a Traveler 👤  
**After:** User is an Agency 🏢 with dedicated agency account

**Collections Involved:**
- ✅ `users` - Updated (type changed, links added)
- ✅ `agencies` - Updated (status changed, approved)
- ✅ `agencyAccounts` - Created (new operating account)

**Result:** Complete account transfer with separate agency operations! 🚀

---

**Last Updated:** October 23, 2025
