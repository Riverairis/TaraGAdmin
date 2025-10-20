// Admin Activity Logger Utility
// This utility can be used throughout the admin panel to log admin actions

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const API_BASE_URL = 'http://localhost:5000/api';

// Initialize Firebase
let firebaseDB = null;
try {
  const firebaseConfig = {
    apiKey: "AIzaSyCn20TvjC98ePXmOEQiJySSq2QN2p0QuRg",
    authDomain: "taralets-3adb8.firebaseapp.com",
    projectId: "taralets-3adb8",
    storageBucket: "taralets-3adb8.firebasestorage.app",
    messagingSenderId: "353174524186",
    appId: "1:353174524186:web:45cf6ee4f8878bc0df9ca3"
  };

  if (firebaseConfig && firebaseConfig.projectId) {
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
    firebaseDB = getFirestore();
  }
} catch (err) {
  console.warn('Firebase initialization failed in adminActivityLogger:', err);
}

export const logAdminActivity = async (action, description, targetType = null, targetID = null, metadata = null) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const adminId = user.id || user._id || user.uid || user.email;
    
    if (!accessToken) return;

    // Try to log to backend API (optional - suppress errors if endpoint doesn't exist)
    try {
      const response = await fetch(`${API_BASE_URL}/admin-activity/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          action,
          description,
          targetType,
          targetID,
          metadata
        })
      });
      
      // Silently ignore 404 errors (endpoint not implemented yet)
      if (!response.ok && response.status !== 404) {
        console.warn('Backend API logging failed:', response.status);
      }
    } catch (apiErr) {
      // Silently ignore backend API errors - Firebase is primary logging system
    }

    // Log to Firebase adminlogs collection (primary logging system)
    if (firebaseDB && adminId) {
      try {
        const logsRef = collection(firebaseDB, 'adminlogs');
        await addDoc(logsRef, {
          adminId: adminId,
          adminEmail: user.email || null,
          action: action,
          description: description || '',
          targetType: targetType || null,
          targetID: targetID || null,
          metadata: metadata || null,
          timestamp: serverTimestamp()
        });
      } catch (fbErr) {
        console.error('Failed to log to Firebase adminlogs:', fbErr);
      }
    }
  } catch (error) {
    console.error('Failed to log admin activity:', error);
  }
};

// Predefined activity logging functions for common admin actions
export const logUserAction = async (action, userId, description, metadata = null) => {
  await logAdminActivity(`User ${action}`, description, 'user', userId, metadata);
};

export const logTourAction = async (action, tourId, description, metadata = null) => {
  await logAdminActivity(`Tour ${action}`, description, 'tour', tourId, metadata);
};

export const logContentAction = async (action, contentId, description, metadata = null) => {
  await logAdminActivity(`Content ${action}`, description, 'content', contentId, metadata);
};

export const logSystemAction = async (action, description, metadata = null) => {
  await logAdminActivity(`System ${action}`, description, 'system', 'system', metadata);
};

export const logAgencyAction = async (action, agencyId, description, metadata = null) => {
  await logAdminActivity(`Agency ${action}`, description, 'agency', agencyId, metadata);
};

// Specific action loggers
export const logUserBan = async (userId, reason) => {
  await logUserAction('Banned', `Banned user for: ${reason}`, userId, { reason });
};

export const logUserUnban = async (userId) => {
  await logUserAction('Unbanned', 'Unbanned user', userId);
};

export const logUserWarning = async (userId, reason) => {
  await logUserAction('Warned', `Warned user for: ${reason}`, userId, { reason });
};

export const logTourApproval = async (tourId, tourName) => {
  await logTourAction('Approved', `Approved tour: ${tourName}`, tourId, { tourName });
};

export const logTourRejection = async (tourId, tourName, reason) => {
  await logTourAction('Rejected', `Rejected tour: ${tourName} - ${reason}`, tourId, { tourName, reason });
};

export const logContentDeletion = async (contentId, contentType) => {
  await logContentAction('Deleted', `Deleted ${contentType}`, contentId, { contentType });
};

export const logPasswordChange = async () => {
  await logSystemAction('Password Changed', 'Admin changed their password');
};

export const logLogin = async () => {
  await logSystemAction('Login', 'Admin logged into the system');
};

export const logLogout = async () => {
  await logSystemAction('Logout', 'Admin logged out of the system');
};

export const logAgencyApproval = async (agencyId, agencyName) => {
  await logAgencyAction('Approved', `Approved agency: ${agencyName}`, agencyId, { agencyName });
};

export const logAgencyRejection = async (agencyId, agencyName, reason) => {
  await logAgencyAction('Rejected', `Rejected agency: ${agencyName} - ${reason}`, agencyId, { agencyName, reason });
};

// Alert & Announcement Actions
export const logAlertCreated = async (alertId, title) => {
  await logAdminActivity('Created Alert', `Created alert: ${title}`, 'alert', alertId, { title });
};

export const logAlertEdited = async (alertId, title) => {
  await logAdminActivity('Edited Alert', `Edited alert: ${title}`, 'alert', alertId, { title });
};

export const logAlertDeleted = async (alertId, title) => {
  await logAdminActivity('Deleted Alert', `Deleted alert: ${title}`, 'alert', alertId, { title });
};

// Emergency Monitoring Actions
export const logEmergencyDeleted = async (logId, emergencyType) => {
  await logAdminActivity('Deleted Emergency', `Deleted emergency log: ${emergencyType}`, 'emergency', logId, { emergencyType });
};

export const logEmergencyViewed = async (logId, emergencyType) => {
  await logAdminActivity('Viewed Emergency', `Viewed emergency details: ${emergencyType}`, 'emergency', logId, { emergencyType });
};

// User Moderation Actions (Enhanced)
export const logUserDeleted = async (userId, userName) => {
  await logUserAction('Deleted', `Deleted user: ${userName}`, userId, { userName });
};

export const logUserWarned = async (userId, userName, reason) => {
  await logUserAction('Warned', `Warned user ${userName} for: ${reason}`, userId, { userName, reason });
};

export const logUserBanned = async (userId, userName, reason) => {
  await logUserAction('Banned', `Banned user ${userName} for: ${reason}`, userId, { userName, reason });
};

export const logUserUnbanned = async (userId, userName) => {
  await logUserAction('Unbanned', `Unbanned user: ${userName}`, userId, { userName });
};

export const logUserActivated = async (userId, userName) => {
  await logUserAction('Activated', `Activated user: ${userName}`, userId, { userName });
};

// Tour Agency Actions (Enhanced)
export const logAgencyStatusChanged = async (agencyId, agencyName, newStatus) => {
  await logAgencyAction('Status Changed', `Changed agency ${agencyName} status to: ${newStatus}`, agencyId, { agencyName, newStatus });
};

export const logAgencyApplicationReviewed = async (applicationId, agencyName, action) => {
  await logAdminActivity('Application Reviewed', `${action} application for: ${agencyName}`, 'agency-application', applicationId, { agencyName, action });
};

// Revenue Management Actions
export const logTransactionAdded = async (transactionId, amount, agencyName) => {
  await logAdminActivity('Transaction Added', `Added transaction of ₱${amount} for ${agencyName}`, 'transaction', transactionId, { amount, agencyName });
};

export const logSubscriptionCreated = async (subscriptionId, planName, type) => {
  await logAdminActivity('Subscription Created', `Created ${type} subscription plan: ${planName}`, 'subscription', subscriptionId, { planName, type });
};

export const logSubscriptionStatusChanged = async (subscriptionId, planName, newStatus) => {
  await logAdminActivity('Subscription Status Changed', `Changed subscription ${planName} status to: ${newStatus}`, 'subscription', subscriptionId, { planName, newStatus });
};

export const logCommissionRateUpdated = async (newRate) => {
  await logSystemAction('Commission Rate Updated', `Updated commission rate to ${newRate}%`, { newRate });
};
