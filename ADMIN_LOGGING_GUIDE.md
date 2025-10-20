# Admin Logging System Guide

## Overview

The admin logging system automatically tracks all admin actions performed in the TaraAdmin panel. All actions are logged to:
1. **Backend API** (`http://localhost:5000/api/admin-activity/log`)
2. **Firebase Firestore** (`adminlogs` collection)

## Firebase Collection Structure

### Collection Name: `adminlogs`

Each log entry contains:
- `adminId` - The admin's user ID
- `adminEmail` - The admin's email address
- `action` - Short description of the action (e.g., "Created Alert", "Banned User")
- `description` - Detailed description of what happened
- `timestamp` - Server timestamp when the action occurred
- `targetType` - Type of target entity (e.g., "alert", "user", "agency", "emergency")
- `targetID` - ID of the target entity
- `metadata` - Additional contextual information (JSON object)

## How to Use

### 1. Import the Logger

```javascript
import { 
  logAlertCreated, 
  logUserBanned, 
  logAgencyStatusChanged,
  // ... other specific functions
} from '../utils/adminActivityLogger';
```

### 2. Call Logging Functions

Call the appropriate logging function after performing an admin action:

#### Example: Alert Management
```javascript
// After creating an alert
await logAlertCreated(alertId, alertTitle);

// After editing an alert
await logAlertEdited(alertId, alertTitle);

// After deleting an alert
await logAlertDeleted(alertId, alertTitle);
```

#### Example: User Moderation
```javascript
// After warning a user
await logUserWarned(userId, userName, reason);

// After banning a user
await logUserBanned(userId, userName, reason);

// After unbanning a user
await logUserUnbanned(userId, userName);

// After deleting a user
await logUserDeleted(userId, userName);
```

#### Example: Agency Management
```javascript
// After changing agency status
await logAgencyStatusChanged(agencyId, agencyName, newStatus);

// After reviewing an application
await logAgencyApplicationReviewed(applicationId, agencyName, 'approved');
```

#### Example: Emergency Monitoring
```javascript
// After deleting an emergency log
await logEmergencyDeleted(logId, emergencyType);

// After viewing emergency details
await logEmergencyViewed(logId, emergencyType);
```

## Available Logging Functions

### Alert & Announcement Actions
- `logAlertCreated(alertId, title)`
- `logAlertEdited(alertId, title)`
- `logAlertDeleted(alertId, title)`

### Emergency Monitoring Actions
- `logEmergencyDeleted(logId, emergencyType)`
- `logEmergencyViewed(logId, emergencyType)`

### User Moderation Actions
- `logUserWarned(userId, userName, reason)`
- `logUserBanned(userId, userName, reason)`
- `logUserUnbanned(userId, userName)`
- `logUserActivated(userId, userName)`
- `logUserDeleted(userId, userName)`

### Tour Agency Actions
- `logAgencyStatusChanged(agencyId, agencyName, newStatus)`
- `logAgencyApplicationReviewed(applicationId, agencyName, action)`
- `logAgencyApproval(agencyId, agencyName)`
- `logAgencyRejection(agencyId, agencyName, reason)`

### Revenue Management Actions
- `logTransactionAdded(transactionId, amount, agencyName)`
- `logSubscriptionCreated(subscriptionId, planName, type)`
- `logSubscriptionStatusChanged(subscriptionId, planName, newStatus)`
- `logCommissionRateUpdated(newRate)`

### System Actions
- `logPasswordChange()`
- `logLogin()`
- `logLogout()`

### Generic Logging
For custom actions not covered by specific functions:
```javascript
import { logAdminActivity } from '../utils/adminActivityLogger';

await logAdminActivity(
  'Custom Action',           // action
  'Description of action',   // description
  'targetType',              // targetType (optional)
  'targetId',                // targetID (optional)
  { key: 'value' }          // metadata (optional)
);
```

## Integration Examples

### AlertsAnnouncements.jsx
```javascript
import { logAlertCreated, logAlertEdited, logAlertDeleted } from '../utils/adminActivityLogger';

const handleSendAlert = async () => {
  // ... create alert logic
  if (isEditing) {
    await logAlertEdited(editingId, newAlert.title);
  } else {
    await logAlertCreated(newId, newAlert.title);
  }
};

const handleDeleteAlert = async (alertId) => {
  const alert = alerts.find(a => a.id === alertId);
  // ... delete logic
  await logAlertDeleted(alertId, alert.title);
};
```

### EmergencyMonitoring.jsx
```javascript
import { logEmergencyDeleted } from '../utils/adminActivityLogger';

const deleteSafetyLog = async (logId) => {
  const log = safetyLogs.find(l => l.id === logId);
  // ... delete logic
  await logEmergencyDeleted(logId, log.emergencyType);
};
```

### UserList.jsx
```javascript
import { 
  logUserWarned, 
  logUserBanned, 
  logUserDeleted, 
  logUserActivated 
} from '../utils/adminActivityLogger';

const handleBanUser = async (userId) => {
  const user = users.find(u => u.id === userId);
  // ... ban logic
  await logUserBanned(userId, user.name, banReason);
};

const handleDeleteUser = async (userId) => {
  const user = users.find(u => u.id === userId);
  // ... delete logic
  await logUserDeleted(userId, user.name);
};
```

### TourAgencyList.jsx
```javascript
import { 
  logAgencyStatusChanged, 
  logAgencyApplicationReviewed 
} from '../utils/adminActivityLogger';

const handleStatusChange = async (agencyId, newStatus) => {
  const agency = agencies.find(a => a.id === agencyId);
  // ... status change logic
  await logAgencyStatusChanged(agencyId, agency.name, newStatus);
};

const handleApplicationReview = async (applicationId, action) => {
  const application = applications.find(a => a.id === applicationId);
  // ... review logic
  await logAgencyApplicationReviewed(applicationId, application.agencyName, action);
};
```

### RevenueManagement.jsx
```javascript
import { 
  logTransactionAdded, 
  logSubscriptionCreated, 
  logCommissionRateUpdated 
} from '../utils/adminActivityLogger';

const handleAddTransaction = () => {
  // ... add transaction logic
  await logTransactionAdded(newId, transaction.amount, transaction.agencyName);
};

const handleUpdateCommissionRate = async () => {
  // ... update logic
  await logCommissionRateUpdated(commissionRate);
};
```

## Viewing Logs in ProfileSection

Admins can view their activity history in the **Profile Section**:
1. Navigate to Profile
2. Click on the **Security** tab
3. Click **View History** button
4. All logged actions will be displayed in real-time

The logs are fetched from Firebase and displayed with:
- Action name
- Description
- Timestamp
- Target type and ID
- Additional metadata

## Firebase Setup

The Firebase configuration is already set up in the utility file. The collection `adminlogs` will be automatically created when the first log is written.

### Required Firebase Rules (if not already set)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /adminlogs/{logId} {
      // Allow authenticated admins to read and write
      allow read, write: if request.auth != null;
    }
  }
}
```

## Best Practices

1. **Always log after successful actions** - Don't log before the action completes
2. **Provide meaningful descriptions** - Include relevant details like names, IDs, reasons
3. **Use specific functions** - Prefer specific logging functions over generic ones
4. **Handle errors gracefully** - Logging failures shouldn't break the main functionality
5. **Include context** - Use the metadata parameter for additional context

## Troubleshooting

### Logs not appearing in Firebase
- Check Firebase configuration in `adminActivityLogger.js`
- Verify Firebase rules allow write access
- Check browser console for Firebase errors
- Ensure admin is logged in (localStorage has 'user' and 'accessToken')

### Logs not appearing in Profile
- Ensure the admin's ID matches the `adminId` field in logs
- Check that Firebase is properly initialized in ProfileSection.jsx
- Verify the real-time listener is active when viewing history

## Notes

- Logging is non-blocking and won't affect user experience
- Failed logs are caught and logged to console
- Both backend and Firebase logs are independent (one can fail without affecting the other)
- The system automatically handles admin identification from localStorage
