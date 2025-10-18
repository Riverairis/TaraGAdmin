# Admin Activity Logging System

This system tracks all admin actions in the system and stores them in Firebase under the `adminlogs` collection.

## Firebase Collection Structure

**Collection Name:** `adminlogs`

**Document Structure:**
```javascript
{
  id: "unique-activity-id",
  adminID: "admin-user-id",
  action: "User Banned",
  description: "Banned user for violating community guidelines",
  targetType: "user", // user, tour, agency, content, system
  targetID: "user123",
  metadata: {
    reason: "Spam posting",
    previousStatus: "active"
  },
  timestamp: FirebaseTimestamp,
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}
```

## Usage in Frontend

### Import the utility
```javascript
import { 
  logUserAction, 
  logTourAction, 
  logContentAction, 
  logSystemAction,
  logUserBan,
  logTourApproval,
  logPasswordChange,
  logLogin,
  logLogout
} from '../utils/adminActivityLogger';
```

### Common Admin Actions

#### User Management
```javascript
// Ban a user
await logUserBan(userId, "Spam posting");

// Unban a user
await logUserAction('Unbanned', 'Unbanned user', userId);

// Warn a user
await logUserAction('Warned', 'Warned user for inappropriate content', userId);
```

#### Tour Management
```javascript
// Approve a tour
await logTourApproval(tourId, tourName);

// Reject a tour
await logTourRejection(tourId, tourName, "Poor quality images");

// Edit tour
await logTourAction('Edited', 'Updated tour details', tourId);
```

#### Content Management
```javascript
// Delete content
await logContentDeletion(contentId, "post");

// Edit content
await logContentAction('Edited', 'Modified content', contentId);
```

#### System Actions
```javascript
// Password change
await logPasswordChange();

// Login
await logLogin();

// Logout
await logLogout();
```

#### Agency Management
```javascript
// Approve agency
await logAgencyApproval(agencyId, agencyName);

// Reject agency
await logAgencyRejection(agencyId, agencyName, "Incomplete documentation");
```

## Backend API Endpoints

### Get Admin Activities
```
GET /api/admin-activity/my-activities?limit=50
Authorization: Bearer <token>
```

### Get All Admin Activities (Super Admin)
```
GET /api/admin-activity/all-activities?limit=100
Authorization: Bearer <token>
```

### Log New Activity
```
POST /api/admin-activity/log
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "User Banned",
  "description": "Banned user for spam",
  "targetType": "user",
  "targetID": "user123",
  "metadata": {
    "reason": "Spam posting"
  }
}
```

## Activity Types

### Target Types
- `user` - User management actions
- `tour` - Tour management actions
- `agency` - Agency management actions
- `content` - Content management actions
- `system` - System-level actions

### Common Actions
- `Banned` - User banned
- `Unbanned` - User unbanned
- `Warned` - User warned
- `Approved` - Tour/agency approved
- `Rejected` - Tour/agency rejected
- `Deleted` - Content deleted
- `Edited` - Content edited
- `Password Changed` - Password changed
- `Login` - Admin logged in
- `Logout` - Admin logged out

## Integration Examples

### In User Management Component
```javascript
import { logUserBan, logUserUnban } from '../utils/adminActivityLogger';

const handleBanUser = async (userId, reason) => {
  // Your ban logic here
  await banUser(userId, reason);
  
  // Log the action
  await logUserBan(userId, reason);
};
```

### In Tour Management Component
```javascript
import { logTourApproval, logTourRejection } from '../utils/adminActivityLogger';

const handleApproveTour = async (tourId, tourName) => {
  // Your approval logic here
  await approveTour(tourId);
  
  // Log the action
  await logTourApproval(tourId, tourName);
};
```

## Viewing Admin Activities

The admin activities are displayed in the Profile Section under "Login History" which shows:
- All admin actions with timestamps
- Target information (what was affected)
- Action descriptions
- Chronological order (newest first)

## Best Practices

1. **Always log significant actions** - Any action that affects users, content, or system state
2. **Include relevant metadata** - Add context like reasons, previous states, etc.
3. **Use descriptive descriptions** - Make it clear what happened
4. **Don't log profile views** - Only log actual admin actions
5. **Log both successful and failed actions** - Track all attempts

## Security Notes

- All activities are stored with admin ID for accountability
- IP addresses and user agents are logged for security
- Activities cannot be deleted (audit trail)
- Only authenticated admins can view their own activities
- Super admins can view all activities
