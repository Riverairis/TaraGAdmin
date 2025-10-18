// Admin Activity Logger Utility
// This utility can be used throughout the admin panel to log admin actions

const API_BASE_URL = 'http://localhost:5000/api';

export const logAdminActivity = async (action, description, targetType = null, targetID = null, metadata = null) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    await fetch(`${API_BASE_URL}/admin-activity/log`, {
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
