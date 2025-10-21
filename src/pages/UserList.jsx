import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { logUserWarned, logUserBanned, logUserUnbanned, logUserActivated, logUserDeleted } from '../utils/adminActivityLogger';

const dropdownStyle = `
  .action-dropdown {
    max-height: 300px;
    overflow-y: auto;
    z-index: 100;
    position: fixed;
  }

  @media (max-height: 600px) {
    .action-dropdown {
      max-height: 200px;
    }
  }
`;

const WARNING_REASONS = [
  'Spam',
  'Harassment or Bullying',
  'Inappropriate Content',
  'Hate Speech',
  'Scamming or Fraud',
  'Impersonation',
  'NSFW Content',
  'Off-platform Solicitation',
  'Threats or Violence',
  'Other'
];

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [warnings, setWarnings] = useState({});
  const [actionMenu, setActionMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProfileData, setUserProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Ban modal state
  const [showBanModal, setShowBanModal] = useState(false);
  const [banUserId, setBanUserId] = useState(null);
  const [banSubmitting, setBanSubmitting] = useState(false);
  const [banForm, setBanForm] = useState({ duration: '3650', reasonOption: 'Scamming or Fraud', reason: '', message: '' });
  const [banErrors, setBanErrors] = useState({});

  // Warn modal state
  const [showWarnModal, setShowWarnModal] = useState(false);
  const [warnUserId, setWarnUserId] = useState(null);
  const [warnSubmitting, setWarnSubmitting] = useState(false);
  const [warnForm, setWarnForm] = useState({ duration: '7', reasonOption: 'Spam', reason: '', message: '' });
  const [warnErrors, setWarnErrors] = useState({});

  // Validation modal state
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationAction, setValidationAction] = useState(null);
  const [validationUserId, setValidationUserId] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');

  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const actionMenuRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = dropdownStyle;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        const isActionButton = event.target.closest('button[class*="p-2 rounded-lg"]');
        if (!isActionButton) setActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:5000/api/user/filtered-users', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : undefined,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        const rawUsers = Array.isArray(response.data?.users) ? response.data.users : Array.isArray(response.data) ? response.data : [];
        const travelersOnly = rawUsers.filter(u => (u.type || '').toLowerCase() === 'traveler');

        const formattedUsers = travelersOnly.map(user => ({
          id: user.id || user.userID,
          name: `${user.fname || ''} ${user.mname || ''} ${user.lname || ''}`.trim() || 'N/A',
          username: user.username || 'N/A',
          email: user.email || 'N/A',
          status: user.status || 'active',
          moderationLogID: user.moderationLogID,
          warningCount: user.warningCount || 0,
          _secure: { actualEmail: user.email }
        }));

        setUsers(formattedUsers);

        // initialize warnings
        const initialWarnings = {};
        formattedUsers.forEach(u => {
          initialWarnings[u.id] = u.warningCount || 0;
        });
        setWarnings(initialWarnings);
      } catch (error) {
        console.error('Error fetching travelers:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // helper to mask phone numbers
  const maskPhone = (phone) => {
    if (!phone) return 'N/A';
    if (phone.length <= 4) return '*'.repeat(phone.length);
    return '*'.repeat(phone.length - 4) + phone.slice(-4);
  };

  // fetch secure user profile
  const fetchUserProfile = async (userId) => {
    try {
      setIsProfileLoading(true);
      setSelectedUser(userId);
      setUserProfileData(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Please login again. Session expired.');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/user/secure-profile/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const userData = response.data.user;
      const securedProfile = {
        likes: userData.likes || [],
        trips: userData.trips || [],
        loginHistory: userData.loginHistory || [],
        emergencyContacts: (userData.emergencyContacts || []).map(contact => ({
          name: contact.name || 'N/A',
          relationship: contact.relationship || 'N/A',
          phone: maskPhone(contact.phone)
        })),
        activityLogs: userData.activityLogs || []
      };

      setUserProfileData(securedProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        alert('Failed to load user profile. Please try again.');
      }
    } finally {
      setIsProfileLoading(false);
    }
  };

  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileData(null);
    setActiveTab('profile');
  };

  // Validation modal handler
  const showValidation = (userId, action, message) => {
    setValidationUserId(userId);
    setValidationAction(() => action);
    setValidationMessage(message);
    setShowValidationModal(true);
    setActionMenu(null);
  };

  const executeValidationAction = async () => {
    if (validationAction) {
      await validationAction(validationUserId);
    }
    setShowValidationModal(false);
    setValidationAction(null);
    setValidationUserId(null);
    setValidationMessage('');
  };

  // Action handlers with validation modals
  const handleAddWarning = async (userId) => {
    showValidation(userId, 
      async (id) => {
        setWarnUserId(id);
        setWarnForm({ duration: '7', reasonOption: 'Spam', reason: '', message: '' });
        setWarnErrors({});
        setShowWarnModal(true);
      },
      'Are you sure you want to add a warning to this user?'
    );
  };

  const handleRemoveWarning = async (userId) => {
    showValidation(userId, 
      async (id) => {
        try {
          const token = localStorage.getItem('accessToken');
          const admin = localStorage.getItem('user');
          const adminID = admin ? (JSON.parse(admin)?.id || JSON.parse(admin)?._id) : null;
          const target = users.find(u => u.id === id);
          const logID = target?.moderationLogID;
          if (!token || !adminID || !logID) { alert('Missing session or logID.'); return; }

          await axios.put('http://localhost:5000/api/moderation/unwarn', {
            logID,
            adminID
          }, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          setWarnings(prev => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) - 1)
          }));
          setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active', moderationLogID: undefined } : u));
          alert('Warning removed.');
        } catch (error) {
          console.error('Error removing warning:', error);
          alert('Failed to remove warning');
        }
      },
      'Are you sure you want to remove a warning from this user?'
    );
  };

  const handleSuspendUser = async (userId) => {
    showValidation(userId, 
      async (id) => {
        try {
          await handleAddWarning(id);
          setUsers(prev => prev.map(user => user.id === id ? { ...user, status: 'warned' } : user));
        } catch (error) {
          console.error('Error suspending user:', error);
          alert('Failed to suspend user');
        }
      },
      'Issue a warning instead of suspend? This backend supports warning/ban.'
    );
  };

  const handleBanUser = async (userId) => {
    showValidation(userId, 
      async (id) => {
        setBanUserId(id);
        setBanForm({ duration: '3650', reasonOption: 'Scamming or Fraud', reason: '', message: '' });
        setBanErrors({});
        setShowBanModal(true);
      },
      'Are you sure you want to ban this user?'
    );
  };

  const handleActivateUser = async (userId) => {
    const target = users.find(u => u.id === userId);
    const isBan = (target?.status || '').toLowerCase() === 'banned';
    
    showValidation(userId, 
      async (id) => {
        try {
          const token = localStorage.getItem('accessToken');
          const admin = localStorage.getItem('user');
          const adminID = admin ? (JSON.parse(admin)?.id || JSON.parse(admin)?._id) : null;
          const targetUser = users.find(u => u.id === id);
          const logID = targetUser?.moderationLogID;
          if (!token || !adminID || !logID) { alert('Missing session or logID.'); return; }

          const url = isBan ? 'http://localhost:5000/api/moderation/unban' : 'http://localhost:5000/api/moderation/unwarn';
          await axios.put(url, { logID, adminID }, { headers: { 'Authorization': `Bearer ${token}` } });

          setUsers(prev => prev.map(user =>
            user.id === id ? { ...user, status: 'active', moderationLogID: undefined } : user
          ));
          
          // Log the activation action
          if (isBan) {
            await logUserUnbanned(id, targetUser?.username || targetUser?.name || 'Unknown User');
          } else {
            await logUserActivated(id, targetUser?.username || targetUser?.name || 'Unknown User');
          }
          
          alert(isBan ? 'User unbanned successfully' : 'User unwarned successfully');
        } catch (error) {
          console.error('Error activating user:', error);
          alert('Failed to activate user');
        }
      },
      `Are you sure you want to ${isBan ? 'unban' : 'activate'} this user?`
    );
  };

  const handleDeleteUser = async (userId) => {
    showValidation(userId, 
      async (id) => {
        try {
          const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
          const user = users.find(u => u.id === id);
          
          await axios.delete(`http://localhost:5000/api/user/${id}`, {
            headers: { 'Authorization': token ? `Bearer ${token}` : undefined }
          });
          setUsers(prev => prev.filter(user => user.id !== id));
          
          // Log the delete action
          await logUserDeleted(id, user?.username || user?.name || 'Unknown User');
          
          alert('User deleted successfully');
        } catch (error) {
          console.error('Error deleting user:', error);
          alert('Failed to delete user');
        }
      },
      'Are you sure you want to delete this user? This action cannot be undone.'
    );
  };

  const toggleActionMenu = (userId, event) => {
    if (actionMenu === userId) {
      setActionMenu(null);
    } else {
      setActionMenu(userId);
      
      // Calculate position to prevent overflow
      if (event) {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        let top = buttonRect.bottom + window.scrollY;
        const left = buttonRect.left + window.scrollX;
        
        // Check if dropdown would overflow bottom of viewport
        const dropdownHeight = 300; // Approximate max height
        if (top + dropdownHeight > viewportHeight + window.scrollY) {
          // Position above the button instead
          top = buttonRect.top + window.scrollY - dropdownHeight;
        }
        
        setMenuPosition({ top, left });
      }
    }
  };

  const handleActionClick = (e, userId) => {
    e.stopPropagation();
    toggleActionMenu(userId, e);
  };

  // Filtered list based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      </div>
    );
  }

  // SUBMIT handlers for warn and ban modals
  const submitWarn = async () => {
    const errs = {};
    const duration = parseInt(warnForm.duration, 10);
    if (!duration || duration < 1) errs.duration = 'Provide a valid duration (days).';
    const reasonValue = warnForm.reasonOption === 'Other' ? warnForm.reason.trim() : warnForm.reasonOption;
    if (!reasonValue) errs.reason = 'Reason is required.';
    if (!warnForm.message.trim()) errs.message = 'Message is required.';
    setWarnErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setWarnSubmitting(true);
      const token = localStorage.getItem('accessToken');
      const admin = localStorage.getItem('user');
      const adminID = admin ? (JSON.parse(admin)?.id || JSON.parse(admin)?._id) : null;
      if (!token || !adminID) { alert('Missing admin session. Please login again.'); setWarnSubmitting(false); return; }

      const createResp = await axios.post('http://localhost:5000/api/moderation/create-log', {
        userID: warnUserId,
        adminID,
        type: 'warning',
        duration,
        reason: reasonValue,
        message: warnForm.message.trim()
      }, { headers: { 'Authorization': `Bearer ${token}` } });

      setWarnings(prev => ({ ...prev, [warnUserId]: (prev[warnUserId] || 0) + 1 }));
      const newLogId = createResp?.data?.logId;
      setUsers(prev => prev.map(u => u.id === warnUserId ? { ...u, status: 'warned', moderationLogID: newLogId } : u));
      
      // Log the warn action
      const warnedUser = users.find(u => u.id === warnUserId);
      await logUserWarned(warnUserId, warnedUser?.username || warnedUser?.name || 'Unknown User', reasonValue);
      
      setShowWarnModal(false);
    } catch (err) {
      console.error('Error adding warning:', err);
      alert('Failed to add warning');
    } finally {
      setWarnSubmitting(false);
    }
  };

  const submitBan = async () => {
    const errs = {};
    const duration = parseInt(banForm.duration, 10);
    if (!duration || duration < 1) errs.duration = 'Provide a valid duration (days).';
    const reasonValue = banForm.reasonOption === 'Other' ? banForm.reason.trim() : banForm.reasonOption;
    if (!reasonValue) errs.reason = 'Reason is required.';
    if (!banForm.message.trim()) errs.message = 'Message is required.';
    setBanErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setBanSubmitting(true);
      const token = localStorage.getItem('accessToken');
      const admin = localStorage.getItem('user');
      const adminID = admin ? (JSON.parse(admin)?.id || JSON.parse(admin)?._id) : null;
      if (!token || !adminID) { alert('Missing admin session. Please login again.'); setBanSubmitting(false); return; }

      const createResp = await axios.post('http://localhost:5000/api/moderation/create-log', {
        userID: banUserId,
        adminID,
        type: 'ban',
        duration,
        reason: reasonValue,
        message: banForm.message.trim()
      }, { headers: { 'Authorization': `Bearer ${token}` } });

      const newLogId = createResp?.data?.logId;
      setUsers(prev => prev.map(user => user.id === banUserId ? { ...user, status: 'banned', moderationLogID: newLogId } : user));
      
      // Log the ban action
      const bannedUser = users.find(u => u.id === banUserId);
      await logUserBanned(banUserId, bannedUser?.username || bannedUser?.name || 'Unknown User', reasonValue);
      
      setShowBanModal(false);
    } catch (err) {
      console.error('Error banning user:', err);
      alert('Failed to ban user');
    } finally {
      setBanSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Travelers</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all travelers</p>
        </div>

        {/* Search */}
        <div className="px-4 pt-2 -mt-2 mb-6">
          <div className="flex items-center gap-3 justify-end">
            <div className="relative w-full lg:w-1/3 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400 text-sm"></i>
              </div>
              <input
                type="text"
                placeholder="Search by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Warnings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                            (warnings[user.id] || 0) >= 3
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : (warnings[user.id] || 0) >= 2
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {warnings[user.id] || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : user.status === 'banned'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={(e) => handleActionClick(e, user.id)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                          >
                            <i className="fas fa-ellipsis-v"></i>
                          </button>

                          {actionMenu === user.id && (
                            <div 
                              ref={actionMenuRef} 
                              className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 action-dropdown z-50"
                              style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`
                              }}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => { fetchUserProfile(user.id); setActionMenu(null); }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <i className="fas fa-eye mr-2"></i>
                                  View Profile
                                </button>

                                <button
                                  onClick={() => { handleAddWarning(user.id); }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                                >
                                  <i className="fas fa-exclamation-triangle mr-2"></i>
                                  Add Warning
                                </button>

                                <button
                                  onClick={() => { handleRemoveWarning(user.id); }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                                >
                                  <i className="fas fa-check-circle mr-2"></i>
                                  Remove Warning
                                </button>

                                <button
                                  onClick={() => { handleBanUser(user.id); }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <i className="fas fa-ban mr-2"></i>
                                  Ban User
                                </button>

                                <button
                                  onClick={() => { handleActivateUser(user.id); }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                                >
                                  <i className="fas fa-user-check mr-2"></i>
                                  Activate / Unban
                                </button>

                                <button
                                  onClick={() => { handleDeleteUser(user.id); }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <i className="fas fa-trash mr-2"></i>
                                  Delete User
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* VALIDATION MODAL */}
        {showValidationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Action</h2>
                  <button 
                    onClick={() => setShowValidationModal(false)} 
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300">{validationMessage}</p>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-2xl flex justify-end gap-3">
                <button 
                  onClick={() => setShowValidationModal(false)} 
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={executeValidationAction}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WARN Modal */}
        {showWarnModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Warning</h2>
                  <button onClick={() => setShowWarnModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill out the details to proceed with the warning.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (days)</label>
                  <input
                    type="number"
                    min="1"
                    value={warnForm.duration}
                    onChange={(e) => setWarnForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {warnErrors.duration && <p className="text-xs text-red-600 mt-1">{warnErrors.duration}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                  <select
                    value={warnForm.reasonOption}
                    onChange={(e) => setWarnForm(prev => ({ ...prev, reasonOption: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {WARNING_REASONS.map(r => (<option key={r} value={r}>{r}</option>))}
                  </select>
                  {warnForm.reasonOption === 'Other' && (
                    <input
                      type="text"
                      placeholder="Custom reason"
                      value={warnForm.reason}
                      onChange={(e) => setWarnForm(prev => ({ ...prev, reason: e.target.value }))}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  )}
                  {warnErrors.reason && <p className="text-xs text-red-600 mt-1">{warnErrors.reason}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea
                    rows="3"
                    value={warnForm.message}
                    onChange={(e) => setWarnForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {warnErrors.message && <p className="text-xs text-red-600 mt-1">{warnErrors.message}</p>}
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-2xl flex justify-end gap-3">
                <button onClick={() => setShowWarnModal(false)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200">Cancel</button>
                <button
                  disabled={warnSubmitting}
                  onClick={submitWarn}
                  className={`px-4 py-2 rounded-lg text-white ${warnSubmitting ? 'bg-yellow-400' : 'bg-yellow-600 hover:bg-yellow-700'}`}
                >
                  {warnSubmitting ? 'Saving...' : 'Confirm Warning'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BAN Modal */}
        {showBanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ban User</h2>
                  <button onClick={() => setShowBanModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill out the details to proceed with the ban.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (days)</label>
                  <input
                    type="number"
                    min="1"
                    value={banForm.duration}
                    onChange={(e) => setBanForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {banErrors.duration && <p className="text-xs text-red-600 mt-1">{banErrors.duration}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                  <select
                    value={banForm.reasonOption}
                    onChange={(e) => setBanForm(prev => ({ ...prev, reasonOption: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {WARNING_REASONS.map(r => (<option key={r} value={r}>{r}</option>))}
                  </select>
                  {banForm.reasonOption === 'Other' && (
                    <input
                      type="text"
                      placeholder="Custom reason"
                      value={banForm.reason}
                      onChange={(e) => setBanForm(prev => ({ ...prev, reason: e.target.value }))}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  )}
                  {banErrors.reason && <p className="text-xs text-red-600 mt-1">{banErrors.reason}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea
                    rows="3"
                    value={banForm.message}
                    onChange={(e) => setBanForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {banErrors.message && <p className="text-xs text-red-600 mt-1">{banErrors.message}</p>}
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-2xl flex justify-end gap-3">
                <button onClick={() => setShowBanModal(false)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200">Cancel</button>
                <button
                  disabled={banSubmitting}
                  onClick={submitBan}
                  className={`px-4 py-2 rounded-lg text-white ${banSubmitting ? 'bg-cyan-400' : 'bg-cyan-600 hover:bg-cyan-700'}`}
                >
                  {banSubmitting ? 'Banning...' : 'Confirm Ban'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* USER PROFILE Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    User Profile: {users.find(u => u.id === selectedUser)?.name}
                  </h2>
                  <button
                    onClick={closeUserProfile}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>

                {/* Tabs */}
                <div className="mt-4 border-b border-gray-200 dark:border-gray-700">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`py-2 px-1 text-sm font-medium ${
                        activeTab === 'profile'
                          ? 'border-b-2 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <i className="fas fa-user mr-2"></i>
                      Profile Details
                    </button>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className={`py-2 px-1 text-sm font-medium ${
                        activeTab === 'activity'
                          ? 'border-b-2 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <i className="fas fa-history mr-2"></i>
                      Activity Logs
                    </button>
                  </nav>
                </div>
              </div>

              {isProfileLoading || !userProfileData ? (
                <div className="p-6">
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">Loading profile...</span>
                  </div>
                </div>
              ) : (
                <>
                  {activeTab === 'profile' && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <i className="fas fa-heart text-red-500 mr-2"></i>
                          Interests & Likes
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {userProfileData.likes && userProfileData.likes.length > 0 ? (
                            userProfileData.likes.map((like, index) => (
                              <span key={index} className="bg-white dark:bg-gray-600 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-500">
                                {like}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">No interests listed</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <i className="fas fa-route text-blue-500 mr-2"></i>
                          Recent Trips
                        </h3>
                        <div className="space-y-3">
                          {userProfileData.trips && userProfileData.trips.length > 0 ? (
                            userProfileData.trips.map((trip, index) => (
                              <div key={index} className="bg-white dark:bg-gray-600 p-3 rounded border border-gray-200 dark:border-gray-500">
                                <div className="font-medium text-gray-900 dark:text-white">{trip.destination}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {trip.date} • {trip.duration}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">No trips recorded</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <i className="fas fa-history text-purple-500 mr-2"></i>
                          Recent Login History
                        </h3>
                        <div className="space-y-3">
                          {userProfileData.loginHistory && userProfileData.loginHistory.length > 0 ? (
                            userProfileData.loginHistory.map((login, index) => (
                              <div key={index} className="bg-white dark:bg-gray-600 p-3 rounded border border-gray-200 dark:border-gray-500">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {login.date} at {login.time}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{login.device}</div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">No login history available</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <i className="fas fa-address-book text-green-500 mr-2"></i>
                          Emergency Contacts
                        </h3>
                        <div className="space-y-3">
                          {userProfileData.emergencyContacts && userProfileData.emergencyContacts.length > 0 ? (
                            userProfileData.emergencyContacts.map((contact, index) => (
                              <div key={index} className="bg-white dark:bg-gray-600 p-3 rounded border border-gray-200 dark:border-gray-500">
                                <div className="font-medium text-gray-900 dark:text-white">{contact.name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {contact.relationship} • {contact.phone}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">No emergency contacts listed</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="p-6">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <i className="fas fa-clipboard-list text-cyan-500 mr-2"></i>
                          User Activity Logs
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                            <thead className="bg-gray-100 dark:bg-gray-600">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                              {userProfileData.activityLogs && userProfileData.activityLogs.length > 0 ? (
                                userProfileData.activityLogs.map((log, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        log.type === 'Login Attempt'
                                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                          : log.type === 'Password Change'
                                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                      }`}>{log.type}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{log.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{log.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{log.time}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No activity logs found</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-2xl">
                <button
                  onClick={closeUserProfile}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;