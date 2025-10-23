# Quick Test Guide - Agency Approval System

## 🧪 How to Test the Agency Approval Feature

### Step 1: Create Test Data in Firebase Console

#### 1.1 Create a Test User
Go to Firebase Console → Firestore → `users` collection → Add Document

```json
Document ID: test-user-001
{
  "fname": "John",
  "lname": "Doe",
  "email": "john@testagency.com",
  "type": "Traveler",
  "agencies": [],
  "status": "active",
  "createdOn": [Use Firebase Timestamp - Click "Add field" → Type: timestamp],
  "updatedAt": [Use Firebase Timestamp]
}
```

#### 1.2 Create a Test Agency Application
Go to Firebase Console → Firestore → `agencies` collection → Add Document

```json
Document ID: [Auto-generate or use "test-agency-001"]
{
  "name": "Test Travel Agency",
  "status": "pending",
  "description": "This is a test agency for approval testing",
  "type": "Sole Proprietor",
  "dateEstablished": "2020-01-01",
  "registrationNumber": "TEST-REG-12345",
  "address": ["123 Test Street", "Suite 100", "Manila", "1000", "Metro Manila", "Philippines"],
  "documents": [],
  "contactPerson": {
    "userID": "test-user-001",
    "position": "Owner",
    "businessContactNumber": "+63 912 345 6789",
    "businessEmail": "john@testagency.com",
    "governmentID": []
  },
  "application": {
    "isApproved": false,
    "message": "",
    "reviewedOn": null,
    "reviewedBy": null
  },
  "createdOn": [Use Firebase Timestamp],
  "updatedOn": [Use Firebase Timestamp]
}
```

### Step 2: Test in Admin Panel

1. **Open Admin Panel** and log in
2. **Go to Travel Agencies page**
3. **Click "Applications" tab**
4. **You should see** "Test Travel Agency" in the list
5. **Click on the application** to view details
6. **Click "Approve Application"** button
7. **You should see** success message: "Application approved successfully! User has been updated as an agency owner."

### Step 3: Verify Changes in Firebase

#### 3.1 Check Agency Document
Go to Firebase Console → `agencies` → Find your test agency

**Expected Changes:**
```json
{
  "status": "active",                    // ✅ Changed from "pending"
  "application": {
    "isApproved": true,                  // ✅ Changed from false
    "message": "Your application has been approved. Welcome to TaraLets!",
    "reviewedOn": [Timestamp],           // ✅ Now has a value
    "reviewedBy": "admin@example.com"    // ✅ Now has admin ID
  },
  "updatedOn": [New Timestamp]           // ✅ Updated
}
```

#### 3.2 Check User Document
Go to Firebase Console → `users` → Find "test-user-001"

**Expected Changes:**
```json
{
  "type": "Agency",                      // ✅ Changed from "Traveler"
  "agencies": ["test-agency-001"],       // ✅ Array now contains agency ID
  "updatedAt": [New Timestamp]           // ✅ Updated
}
```

#### 3.3 Check Admin Logs
Go to Firebase Console → `adminlogs` collection

**Expected New Entry:**
```json
{
  "action": "Application Reviewed",
  "description": "approve application for: Test Travel Agency",
  "targetType": "agency-application",
  "targetID": "test-agency-001",
  "adminId": "admin@example.com",
  "timestamp": [Timestamp]
}
```

### Step 4: Verify in Admin Panel

1. **Go back to Travel Agencies page**
2. **Click "Agencies" tab** (not Applications)
3. **You should now see** "Test Travel Agency" in the Agencies list
4. **Status should show** "active" (green badge)

## 🎯 What to Look For

### ✅ Success Indicators:
- Application appears in Applications tab with "pending" status
- After approval, success message appears
- Application disappears from Applications tab
- Agency appears in Agencies tab with "active" status
- User document updated in Firebase
- Agency document updated in Firebase
- Admin log created

### ❌ Potential Issues:

**Issue 1: "Firebase not initialized"**
- Solution: Check Firebase config in TourAgencyList.jsx

**Issue 2: "User document not found"**
- Solution: Make sure userID in agency's contactPerson matches an actual user document ID

**Issue 3: Application doesn't appear**
- Solution: Check that agency status is "pending" or "under_review"

**Issue 4: Permission denied**
- Solution: Update Firestore security rules to allow authenticated users to read/write

## 🔄 Testing Rejection

To test rejection:
1. Create another test agency with status "pending"
2. Click "Reject Application" instead of "Approve"
3. Verify:
   - Agency status changes to "rejected"
   - application.isApproved = false
   - User document is NOT updated (stays as "Traveler")

## 🧹 Cleanup After Testing

To clean up test data:
1. Go to Firebase Console
2. Delete test documents from:
   - `agencies` collection (test-agency-001)
   - `users` collection (test-user-001)
   - `adminlogs` collection (test entries)

## 📊 Quick Checklist

- [ ] Created test user in Firebase
- [ ] Created test agency application in Firebase
- [ ] Application appears in Applications tab
- [ ] Clicked "Approve" button
- [ ] Success message appeared
- [ ] Agency status changed to "active" in Firebase
- [ ] User type changed to "Agency" in Firebase
- [ ] Agency ID added to user's agencies array
- [ ] Admin log created
- [ ] Agency appears in Agencies tab

## 🎉 Success!

If all checkboxes are checked, the agency approval system is working correctly! 🚀

---

**Need Help?**
- Check browser console for errors
- Check Firebase Console → Firestore → Data
- Review `AGENCY_APPROVAL_FLOW.md` for detailed flow
- Review `FIREBASE_INDEX_FIX.md` for troubleshooting
