# Admin Logging - Quick Reference Card

## 🚀 Quick Start (3 Steps)

### 1️⃣ Import
```javascript
import { logAlertCreated } from '../utils/adminActivityLogger';
```

### 2️⃣ Log After Action
```javascript
await logAlertCreated(alertId, alertTitle);
```

### 3️⃣ View Logs
Profile → Security → View History

---

## 📚 All Available Functions

### Alerts
```javascript
logAlertCreated(alertId, title)
logAlertEdited(alertId, title)
logAlertDeleted(alertId, title)
```

### Emergencies
```javascript
logEmergencyDeleted(logId, emergencyType)
logEmergencyViewed(logId, emergencyType)
```

### Users
```javascript
logUserWarned(userId, userName, reason)
logUserBanned(userId, userName, reason)
logUserUnbanned(userId, userName)
logUserActivated(userId, userName)
logUserDeleted(userId, userName)
```

### Agencies
```javascript
logAgencyStatusChanged(agencyId, agencyName, newStatus)
logAgencyApplicationReviewed(applicationId, agencyName, action)
logAgencyApproval(agencyId, agencyName)
logAgencyRejection(agencyId, agencyName, reason)
```

### Revenue
```javascript
logTransactionAdded(transactionId, amount, agencyName)
logSubscriptionCreated(subscriptionId, planName, type)
logSubscriptionStatusChanged(subscriptionId, planName, newStatus)
logCommissionRateUpdated(newRate)
```

### System
```javascript
logPasswordChange()
logLogin()
logLogout()
```

### Generic
```javascript
logAdminActivity(action, description, targetType, targetID, metadata)
```

---

## 💡 Usage Examples

### Example 1: Delete Alert
```javascript
const handleDeleteAlert = async (alertId) => {
  const alert = alerts.find(a => a.id === alertId);
  await deleteAlertAPI(alertId);
  await logAlertDeleted(alertId, alert.title); // ← Add this
};
```

### Example 2: Ban User
```javascript
const handleBanUser = async (userId, reason) => {
  const user = users.find(u => u.id === userId);
  await banUserAPI(userId, reason);
  await logUserBanned(userId, user.name, reason); // ← Add this
};
```

### Example 3: Change Agency Status
```javascript
const handleStatusChange = async (agencyId, newStatus) => {
  const agency = agencies.find(a => a.id === agencyId);
  await updateStatusAPI(agencyId, newStatus);
  await logAgencyStatusChanged(agencyId, agency.name, newStatus); // ← Add this
};
```

---

## 📋 Integration Checklist

### For Each File:

- [ ] Add import at top
- [ ] Find action handler functions
- [ ] Get entity details before action
- [ ] Add logging call after successful action
- [ ] Test and verify logs appear

### Files to Update:

- [ ] AlertsAnnouncements.jsx
- [ ] EmergencyMonitoring.jsx
- [ ] UserList.jsx
- [ ] TourAgencyList.jsx
- [ ] RevenueManagement.jsx

---

## 🔍 Where to Find Things

| What | Where |
|------|-------|
| Logging functions | `admin/src/utils/adminActivityLogger.js` |
| View logs | Profile → Security → View History |
| Documentation | `ADMIN_LOGGING_GUIDE.md` |
| Code examples | `IMPLEMENTATION_EXAMPLES.md` |
| Architecture | `SYSTEM_ARCHITECTURE.md` |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Logs not appearing | Check localStorage has 'user' and 'accessToken' |
| Function not found | Check import statement and function name |
| Firebase error | Verify Firebase config in adminActivityLogger.js |
| Wrong admin's logs | Ensure adminId matches current user |

---

## 📊 Log Entry Structure

```javascript
{
  adminId: "admin_123",
  adminEmail: "admin@example.com",
  action: "Deleted Alert",
  description: "Deleted alert: Typhoon Warning",
  timestamp: Timestamp,
  targetType: "alert",
  targetID: "alert_456",
  metadata: { title: "Typhoon Warning" }
}
```

---

## ⚡ Best Practices

✅ **DO:**
- Log after successful actions
- Get entity details before action
- Use specific logging functions
- Test your implementation

❌ **DON'T:**
- Log before action completes
- Use hardcoded values
- Block UI with logging
- Forget to import functions

---

## 🎯 Common Patterns

### Pattern 1: Delete Action
```javascript
const entity = entities.find(e => e.id === id);
await deleteAPI(id);
await logEntityDeleted(id, entity.name);
```

### Pattern 2: Update Action
```javascript
const entity = entities.find(e => e.id === id);
await updateAPI(id, newData);
await logEntityUpdated(id, entity.name, newData);
```

### Pattern 3: Create Action
```javascript
const result = await createAPI(data);
await logEntityCreated(result.id, data.name);
```

---

## 📞 Need Help?

1. Check `ADMIN_LOGGING_GUIDE.md`
2. Review `IMPLEMENTATION_EXAMPLES.md`
3. Inspect `adminActivityLogger.js`
4. Look at ProfileSection.jsx

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Add logging to one file | 5-10 min |
| Test one file | 2-3 min |
| Complete all 5 files | 30-45 min |

---

**Print this page for quick reference while coding!**
