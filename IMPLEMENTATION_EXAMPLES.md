# Admin Logging Implementation Examples

This document provides copy-paste ready code examples for integrating admin logging into your existing files.

## 1. AlertsAnnouncements.jsx

### Add Import at the Top
```javascript
import { logAlertCreated, logAlertEdited, logAlertDeleted } from '../utils/adminActivityLogger';
```

### Update handleSendAlert Function
Find the `handleSendAlert` function and add logging after successful operations:

```javascript
const handleSendAlert = async () => {
  // ... existing validation code ...
  
  try {
    // ... existing alert creation/update code ...
    
    if (isEditing && editingId) {
      // ... existing update code ...
      
      // ADD THIS: Log the edit action
      await logAlertEdited(editingId, alertData.title);
      
    } else {
      // ... existing create code ...
      
      // ADD THIS: Log the create action
      await logAlertCreated(newId, alertData.title);
    }
    
    // ... rest of the code ...
  } catch (error) {
    // ... existing error handling ...
  }
};
```

### Update handleDeleteAlert Function
```javascript
const handleDeleteAlert = async (alertId) => {
  showValidation({
    title: 'Delete Alert',
    message: 'Are you sure you want to delete this alert?',
    type: 'confirm',
    onConfirm: async () => {
      try {
        // Find the alert before deleting to get its title
        const alert = alerts.find(a => a.id === alertId);
        
        // ... existing delete code ...
        
        // ADD THIS: Log the delete action
        await logAlertDeleted(alertId, alert?.title || 'Unknown Alert');
        
        // ... rest of the code ...
      } catch (err) {
        // ... existing error handling ...
      }
    }
  });
};
```

---

## 2. EmergencyMonitoring.jsx

### Add Import at the Top
```javascript
import { logEmergencyDeleted } from '../utils/adminActivityLogger';
```

### Update deleteSafetyLog Function
```javascript
const deleteSafetyLog = async (logId) => {
  showValidation({
    title: 'Delete Safety Log',
    message: 'Are you sure you want to delete this safety log?',
    type: 'confirm',
    onConfirm: async () => {
      try {
        // Find the log before deleting
        const log = safetyLogs.find(l => l.id === logId);
        
        // ... existing delete code ...
        
        await fetchSafetyLogs();
        
        // ADD THIS: Log the delete action
        await logEmergencyDeleted(logId, log?.emergencyType || 'Unknown');
        
        showValidation({
          title: 'Success',
          message: 'Safety log deleted successfully',
          type: 'success'
        });
      } catch (err) {
        // ... existing error handling ...
      }
    }
  });
};
```

---

## 3. UserList.jsx

### Add Import at the Top
```javascript
import { 
  logUserWarned, 
  logUserBanned, 
  logUserDeleted, 
  logUserActivated 
} from '../utils/adminActivityLogger';
```

### Update submitWarn Function
```javascript
const submitWarn = async () => {
  // ... existing validation code ...
  
  try {
    setWarnSubmitting(true);
    
    // ... existing warn code ...
    
    // Find the user to get their name
    const user = users.find(u => u.id === warnUserId);
    
    // ADD THIS: Log the warning action
    await logUserWarned(warnUserId, user?.name || 'Unknown User', reasonValue);
    
    setWarnings(prev => ({ ...prev, [warnUserId]: (prev[warnUserId] || 0) + 1 }));
    // ... rest of the code ...
  } catch (err) {
    // ... existing error handling ...
  } finally {
    setWarnSubmitting(false);
  }
};
```

### Update submitBan Function
```javascript
const submitBan = async () => {
  // ... existing validation code ...
  
  try {
    setBanSubmitting(true);
    
    // ... existing ban code ...
    
    // Find the user to get their name
    const user = users.find(u => u.id === banUserId);
    
    // ADD THIS: Log the ban action
    await logUserBanned(banUserId, user?.name || 'Unknown User', reasonValue);
    
    const newLogId = createResp?.data?.logId;
    // ... rest of the code ...
  } catch (err) {
    // ... existing error handling ...
  } finally {
    setBanSubmitting(false);
  }
};
```

### Update handleDeleteUser Function
```javascript
const handleDeleteUser = async (userId) => {
  if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    try {
      // Find the user before deleting
      const user = users.find(u => u.id === userId);
      
      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:5000/api/user/${userId}`, {
        headers: { 'Authorization': token ? `Bearer ${token}` : undefined }
      });
      
      // ADD THIS: Log the delete action
      await logUserDeleted(userId, user?.name || 'Unknown User');
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      // ... existing error handling ...
    }
  }
  setActionMenu(null);
};
```

### Update handleActivateUser Function
```javascript
const handleActivateUser = async (userId) => {
  try {
    // Find the user
    const target = users.find(u => u.id === userId);
    
    // ... existing activation code ...
    
    // ADD THIS: Log the activation action
    await logUserActivated(userId, target?.name || 'Unknown User');
    
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status: 'active', moderationLogID: undefined } : user
    ));
    alert(isBan ? 'User unbanned successfully' : 'User unwarned successfully');
  } catch (error) {
    // ... existing error handling ...
  }
  setActionMenu(null);
};
```

---

## 4. TourAgencyList.jsx

### Add Import at the Top
```javascript
import { 
  logAgencyStatusChanged, 
  logAgencyApplicationReviewed 
} from '../utils/adminActivityLogger';
```

### Update handleStatusChange Function
```javascript
const handleStatusChange = async (agencyId, newStatus) => {
  try {
    console.log(`Changing status of agency ${agencyId} to ${newStatus}`);
    
    // Find the agency
    const agency = agencies.find(a => a.id === agencyId);
    
    // ... existing status change code ...
    
    // ADD THIS: Log the status change
    await logAgencyStatusChanged(agencyId, agency?.name || 'Unknown Agency', newStatus);
    
    showValidation({
      title: 'Status Updated',
      message: `Agency status updated to ${newStatus}`,
      type: 'success'
    });
    fetchAgencies();
  } catch (error) {
    // ... existing error handling ...
  }
};
```

### Update handleApplicationReview Function
```javascript
const handleApplicationReview = async (applicationId, action) => {
  try {
    console.log(`${action} application ${applicationId}`);
    
    // Find the application
    const application = applications.find(a => a.id === applicationId);
    
    // ... existing review code ...
    
    // ADD THIS: Log the review action
    await logAgencyApplicationReviewed(
      applicationId, 
      application?.agencyName || 'Unknown Agency', 
      action
    );
    
    showValidation({
      title: 'Application Updated',
      message: `Application ${action === 'approve' ? 'approved' : 'rejected'}`,
      type: 'success'
    });
    fetchApplications();
    setShowApplicationModal(false);
  } catch (error) {
    // ... existing error handling ...
  }
};
```

---

## 5. RevenueManagement.jsx

### Add Import at the Top
```javascript
import { 
  logTransactionAdded, 
  logSubscriptionCreated, 
  logSubscriptionStatusChanged,
  logCommissionRateUpdated 
} from '../utils/adminActivityLogger';
```

### Update handleAddTransaction Function
```javascript
const handleAddTransaction = async () => {
  const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
  const transaction = {
    ...newTransaction,
    id: newId,
    transactionId: `TXN-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    type: "manual"
  };
  
  setTransactions([...transactions, transaction]);
  
  // ADD THIS: Log the transaction
  await logTransactionAdded(
    transaction.transactionId, 
    transaction.amount, 
    transaction.agencyName
  );
  
  setShowTransactionModal(false);
  // ... rest of the code ...
};
```

### Update handleAddSubscription Function
```javascript
const handleAddSubscription = async () => {
  const newId = getAllSubscriptions().length > 0 ? Math.max(...getAllSubscriptions().map(s => s.id)) + 1 : 1;
  const subscription = {
    ...newSubscription,
    id: newId,
    subscribers: 0
  };
  
  if (newSubscription.type === 'user') {
    setUserSubscriptions([...userSubscriptions, subscription]);
  } else {
    setAgencySubscriptions([...agencySubscriptions, subscription]);
  }
  
  // ADD THIS: Log the subscription creation
  await logSubscriptionCreated(newId, subscription.name, subscription.type);
  
  setShowSubscriptionModal(false);
  // ... rest of the code ...
};
```

### Update handleUpdateSubscriptionStatus Function
```javascript
const handleUpdateSubscriptionStatus = async (id, type, status) => {
  // Find the subscription
  const subscription = type === 'user' 
    ? userSubscriptions.find(s => s.id === id)
    : agencySubscriptions.find(s => s.id === id);
  
  if (type === 'user') {
    setUserSubscriptions(userSubscriptions.map(plan => 
      plan.id === id ? {...plan, status} : plan
    ));
  } else {
    setAgencySubscriptions(agencySubscriptions.map(plan => 
      plan.id === id ? {...plan, status} : plan
    ));
  }
  
  // ADD THIS: Log the status change
  await logSubscriptionStatusChanged(id, subscription?.name || 'Unknown Plan', status);
};
```

### Update handleUpdateCommissionRate Function
```javascript
const handleUpdateCommissionRate = async () => {
  try {
    console.log('Updating commission rate to:', commissionRate);
    
    // ADD THIS: Log the commission rate update
    await logCommissionRateUpdated(commissionRate);
    
    showValidation({
      title: 'Success',
      message: `Commission rate updated to ${commissionRate}%`,
      type: 'success'
    });
    setShowRateModal(false);
    fetchAgencyCommissions();
  } catch (error) {
    // ... existing error handling ...
  }
};
```

---

## Quick Integration Checklist

For each file you want to add logging to:

1. ✅ Add import statement at the top
2. ✅ Find the action handler functions
3. ✅ Get the entity details (name, ID, etc.) before the action
4. ✅ Add the logging call after successful action
5. ✅ Pass relevant parameters (ID, name, reason, etc.)
6. ✅ Test the action to ensure logs appear in Firebase

## Testing Your Implementation

1. **Perform an action** (e.g., delete an alert, ban a user)
2. **Go to Profile Section** → Security tab → View History
3. **Verify the log appears** with correct details
4. **Check Firebase Console** to see the log in the `adminlogs` collection

## Common Mistakes to Avoid

❌ **Don't log before the action completes**
```javascript
// WRONG
await logUserDeleted(userId, userName);
await deleteUser(userId); // What if this fails?
```

✅ **Log after successful action**
```javascript
// CORRECT
await deleteUser(userId);
await logUserDeleted(userId, userName);
```

❌ **Don't use hardcoded values**
```javascript
// WRONG
await logAlertDeleted(alertId, 'Some Alert');
```

✅ **Get actual values from data**
```javascript
// CORRECT
const alert = alerts.find(a => a.id === alertId);
await logAlertDeleted(alertId, alert?.title || 'Unknown Alert');
```

❌ **Don't block UI with logging errors**
```javascript
// WRONG - will throw error if logging fails
await logUserBanned(userId, userName, reason);
```

✅ **Logging is already wrapped in try-catch**
```javascript
// CORRECT - errors are caught internally
await logUserBanned(userId, userName, reason); // Won't throw
```

## Need Help?

- Check `ADMIN_LOGGING_GUIDE.md` for detailed documentation
- Review `adminActivityLogger.js` for available functions
- Look at ProfileSection.jsx to see how logs are displayed
