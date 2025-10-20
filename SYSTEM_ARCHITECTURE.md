# Admin Logging System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN PANEL UI                            │
│  (AlertsAnnouncements, UserList, TourAgencyList, etc.)         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Admin performs action
                            │ (delete, ban, create, etc.)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   adminActivityLogger.js                         │
│                  (Logging Utility Module)                        │
│                                                                  │
│  logAdminActivity(action, description, targetType, targetID)    │
└───────────────┬─────────────────────────┬───────────────────────┘
                │                         │
                │                         │
    ┌───────────▼──────────┐   ┌─────────▼──────────┐
    │   Backend API        │   │  Firebase Firestore │
    │   (Node.js/Express)  │   │   (adminlogs)       │
    │                      │   │                     │
    │  POST /api/admin-    │   │  addDoc()           │
    │  activity/log        │   │  serverTimestamp()  │
    └──────────────────────┘   └─────────┬───────────┘
                                          │
                                          │ Real-time listener
                                          │
                            ┌─────────────▼─────────────┐
                            │   ProfileSection.jsx      │
                            │   (View History Modal)    │
                            │                           │
                            │   - Fetches logs          │
                            │   - Filters by adminId    │
                            │   - Displays in real-time │
                            └───────────────────────────┘
```

## Data Flow

### 1. Action Performed
```javascript
// Admin clicks "Delete Alert" button
handleDeleteAlert(alertId)
```

### 2. Action Executed
```javascript
// Alert is deleted from database
await fetch(`${API_BASE}/alerts/${alertId}`, { method: 'DELETE' })
```

### 3. Action Logged
```javascript
// Log is created in both systems
await logAlertDeleted(alertId, alertTitle)
  ├─> Backend API: POST /api/admin-activity/log
  └─> Firebase: addDoc(collection(db, 'adminlogs'), {...})
```

### 4. Log Stored
```
Backend Database          Firebase Firestore
     (MongoDB)                (adminlogs)
         │                         │
         ├─ Log Entry             ├─ Log Document
         │  - adminId             │  - adminId
         │  - action              │  - action
         │  - timestamp           │  - timestamp
         │  - ...                 │  - ...
```

### 5. Log Retrieved & Displayed
```javascript
// ProfileSection.jsx listens for changes
onSnapshot(collection(db, 'adminlogs'), (snapshot) => {
  // Filter logs for current admin
  const myLogs = snapshot.docs.filter(doc => 
    doc.data().adminId === currentAdminId
  )
  // Display in View History modal
  setLoginHistory(myLogs)
})
```

## Component Integration Map

```
admin/src/
│
├── utils/
│   └── adminActivityLogger.js ⭐ (MODIFIED - Added Firebase)
│       ├── Firebase initialization
│       ├── logAdminActivity() - Core function
│       ├── logAlertCreated()
│       ├── logAlertEdited()
│       ├── logAlertDeleted()
│       ├── logUserBanned()
│       ├── logUserWarned()
│       ├── logUserDeleted()
│       ├── logAgencyStatusChanged()
│       └── ... (20+ functions)
│
└── pages/
    ├── ProfileSection.jsx ✅ (ALREADY CONFIGURED)
    │   ├── Firebase initialized
    │   ├── Real-time listener active
    │   └── View History modal displays logs
    │
    ├── AlertsAnnouncements.jsx 🔧 (NEEDS INTEGRATION)
    │   └── Add: logAlertCreated, logAlertEdited, logAlertDeleted
    │
    ├── EmergencyMonitoring.jsx 🔧 (NEEDS INTEGRATION)
    │   └── Add: logEmergencyDeleted
    │
    ├── UserList.jsx 🔧 (NEEDS INTEGRATION)
    │   └── Add: logUserWarned, logUserBanned, logUserDeleted
    │
    ├── TourAgencyList.jsx 🔧 (NEEDS INTEGRATION)
    │   └── Add: logAgencyStatusChanged, logAgencyApplicationReviewed
    │
    └── RevenueManagement.jsx 🔧 (NEEDS INTEGRATION)
        └── Add: logTransactionAdded, logSubscriptionCreated
```

## Firebase Collection Schema

```
Firestore Database
│
└── adminlogs (Collection)
    │
    ├── [Auto-generated Document ID]
    │   ├── adminId: string
    │   ├── adminEmail: string
    │   ├── action: string
    │   ├── description: string
    │   ├── timestamp: Timestamp
    │   ├── targetType: string
    │   ├── targetID: string
    │   └── metadata: object
    │
    ├── [Auto-generated Document ID]
    │   ├── adminId: string
    │   ├── ...
    │
    └── ... (more log entries)
```

## Logging Function Categories

```
adminActivityLogger.js
│
├── Core Function
│   └── logAdminActivity(action, description, targetType, targetID, metadata)
│
├── Alert Actions
│   ├── logAlertCreated(alertId, title)
│   ├── logAlertEdited(alertId, title)
│   └── logAlertDeleted(alertId, title)
│
├── Emergency Actions
│   ├── logEmergencyDeleted(logId, emergencyType)
│   └── logEmergencyViewed(logId, emergencyType)
│
├── User Actions
│   ├── logUserWarned(userId, userName, reason)
│   ├── logUserBanned(userId, userName, reason)
│   ├── logUserUnbanned(userId, userName)
│   ├── logUserActivated(userId, userName)
│   └── logUserDeleted(userId, userName)
│
├── Agency Actions
│   ├── logAgencyStatusChanged(agencyId, agencyName, newStatus)
│   ├── logAgencyApplicationReviewed(applicationId, agencyName, action)
│   ├── logAgencyApproval(agencyId, agencyName)
│   └── logAgencyRejection(agencyId, agencyName, reason)
│
├── Revenue Actions
│   ├── logTransactionAdded(transactionId, amount, agencyName)
│   ├── logSubscriptionCreated(subscriptionId, planName, type)
│   ├── logSubscriptionStatusChanged(subscriptionId, planName, newStatus)
│   └── logCommissionRateUpdated(newRate)
│
└── System Actions
    ├── logPasswordChange()
    ├── logLogin()
    └── logLogout()
```

## Integration Pattern

### Standard Integration Pattern
```javascript
// 1. Import the logger
import { logSpecificAction } from '../utils/adminActivityLogger';

// 2. In your action handler
const handleAction = async (entityId) => {
  try {
    // Get entity details BEFORE action
    const entity = entities.find(e => e.id === entityId);
    
    // Perform the action
    await performAction(entityId);
    
    // Log AFTER successful action
    await logSpecificAction(entityId, entity.name);
    
    // Update UI
    showSuccessMessage();
  } catch (error) {
    handleError(error);
  }
};
```

## Security & Authentication Flow

```
┌─────────────────┐
│  Admin Login    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  localStorage.setItem()     │
│  - accessToken              │
│  - user (with id & email)   │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  adminActivityLogger.js     │
│  Reads from localStorage:   │
│  - accessToken (for API)    │
│  - user.id (for Firebase)   │
│  - user.email (for Firebase)│
└────────┬────────────────────┘
         │
         ├─────────────────┬──────────────────┐
         ▼                 ▼                  ▼
    ┌─────────┐      ┌──────────┐      ┌──────────┐
    │ Backend │      │ Firebase │      │ Profile  │
    │   API   │      │ Firestore│      │ Section  │
    └─────────┘      └──────────┘      └──────────┘
```

## Error Handling Flow

```
Action Performed
      │
      ▼
Try to Log to Backend API
      │
      ├─ Success ✅ → Continue
      │
      └─ Failure ❌ → Log error to console
                      Continue (don't block)
      │
      ▼
Try to Log to Firebase
      │
      ├─ Success ✅ → Continue
      │
      └─ Failure ❌ → Log error to console
                      Continue (don't block)
      │
      ▼
Main Action Completes
(User sees success message)
```

## Real-Time Sync Flow

```
Admin A performs action
         │
         ▼
Log written to Firebase
         │
         ▼
Firebase triggers onSnapshot
         │
         ├──────────────────┬──────────────────┐
         ▼                  ▼                  ▼
    Admin A's          Admin B's          Admin C's
    Profile            Profile            Profile
    (sees own logs)    (sees own logs)    (sees own logs)
```

## Summary

- **Single Source**: All logging goes through `adminActivityLogger.js`
- **Dual Storage**: Logs saved to both Backend API and Firebase
- **Real-Time**: ProfileSection listens for changes via Firebase
- **Filtered**: Each admin sees only their own logs
- **Non-Blocking**: Logging failures don't affect main functionality
- **Comprehensive**: 20+ specialized logging functions available

---

**Legend:**
- ⭐ Modified/Enhanced
- ✅ Already configured
- 🔧 Needs integration
- ❌ Error state
- ✅ Success state
