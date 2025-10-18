// ProfileSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logPasswordChange } from '../utils/adminActivityLogger';

const ProfileSection = ({ adminName, onLogout }) => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark';
    } catch {
      return false;
    }
  });
  const [showLoginHistory, setShowLoginHistory] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loginHistory, setLoginHistory] = useState([]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  useEffect(() => {
    if (adminData) {
      setEditForm({
        fname: adminData.fname || '',
        mname: adminData.mname || '',
        lname: adminData.lname || '',
        username: adminData.username || '',
        email: adminData.email || '',
        contactNumber: adminData.contactNumber || '',
        bio: adminData.bio || ''
      });
    }
  }, [adminData]);

  const fetchAdminProfile = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!accessToken || !user.email) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/fetch-user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ email: user.email })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin profile');
      }

      const data = await response.json();
      setAdminData(data.user);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Sync local isDark with document class and storage when it changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch {}
    } else {
      root.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch {}
    }
    // notify other parts of the app (main.jsx listens)
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { isDark } }));
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    if (onLogout) {
      onLogout();
    }

    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    // Implement save functionality here
    console.log('Saving changes:', editForm);
    // After successful save:
    setIsEditing(false);
    fetchAdminProfile(); // Refresh data
  };

  const fetchLoginHistory = async () => {
    setIsLoadingHistory(true);
    setHistoryError('');
    try {
      const accessToken = localStorage.getItem('accessToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!accessToken || !user.email) {
        setHistoryError('Authentication required');
        return;
      }

      // Fetch admin activity logs
      console.log('Fetching from:', 'http://localhost:5000/api/admin-activity/my-activities');
      console.log('Access token:', accessToken ? 'Present' : 'Missing');
      
      const response = await fetch('http://localhost:5000/api/admin-activity/my-activities', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData);
        
        // If it's a 404 or 500, the endpoint might not exist yet
        if (response.status === 404 || response.status === 500) {
          console.log('Endpoint not found or server error, using mock data');
          // Use mock data for now
          const mockActivities = [
            {
              id: 'mock-1',
              action: 'User Management',
              description: 'Banned user for violating community guidelines',
              timestamp: { seconds: Date.now() / 1000 },
              type: 'moderation',
              targetType: 'user',
              targetID: 'user123'
            },
            {
              id: 'mock-2',
              action: 'Tour Management',
              description: 'Approved new tour submission',
              timestamp: { seconds: (Date.now() - 300000) / 1000 },
              type: 'approval',
              targetType: 'tour',
              targetID: 'tour456'
            },
            {
              id: 'mock-3',
              action: 'Content Management',
              description: 'Deleted inappropriate content',
              timestamp: { seconds: (Date.now() - 600000) / 1000 },
              type: 'deletion',
              targetType: 'content',
              targetID: 'content789'
            }
          ];
          setLoginHistory(mockActivities);
          return;
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch activity history`);
      }

      const data = await response.json();
      console.log('Activity logs response:', data);
      
      // Transform admin activities into activity history
      const activities = (data.activities || []).map(activity => {
        console.log('Processing activity:', activity);
        return {
          id: activity.id,
          action: activity.action,
          description: activity.description,
          timestamp: activity.timestamp,
          type: activity.targetType || 'system',
          targetType: activity.targetType,
          targetID: activity.targetID,
          metadata: activity.metadata
        };
      });

      console.log('Transformed activities:', activities);
      setLoginHistory(activities);
    } catch (error) {
      console.error('Error fetching login history:', error);
      setHistoryError(error.message || 'Failed to load activity history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    setIsChangingPassword(true);
    setPasswordError('');

    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setPasswordError('Authentication required');
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }

      // Reset form and close modal
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePassword(false);
      setPasswordError('');
      
      // Log successful password change
      await logPasswordChange();
      
      // Show success message (you could add a toast notification here)
      alert('Password changed successfully!');
      
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const openLoginHistory = () => {
    setShowLoginHistory(true);
    fetchLoginHistory();
  };

  const openChangePassword = () => {
    setShowChangePassword(true);
    setPasswordError('');
  };

  // Function to log admin activities
  const logAdminActivity = async (action, description, targetType = null, targetID = null, metadata = null) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      await fetch('http://localhost:5000/api/admin-activity/log', {
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

  if (loading) {
    
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
              <div className="flex space-x-6 mb-8">
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-4 py-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(item => (
                  <div key={item} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
   
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Error Loading Profile</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{error}</p>
                <button
                  onClick={fetchAdminProfile}
                  className="mt-4 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl text-sm font-medium hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-md hover:shadow-lg"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Main Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Profile Header with subtle gradient */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-28 h-28 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-6 shadow-lg">
                    {adminData?.fname?.charAt(0) || 'A'}
                  </div>
                  <div className="absolute bottom-2 right-4 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {adminData?.fname} {adminData?.mname && `${adminData.mname} `}{adminData?.lname}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {adminData?.email}
                  </p>
                  <div className="flex items-center mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 capitalize shadow-sm dark:from-cyan-900/40 dark:to-cyan-900/60 dark:text-cyan-200">
                      {adminData?.type}
                    </span>
                    <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 capitalize shadow-sm dark:from-emerald-900/40 dark:to-emerald-900/60 dark:text-emerald-200">
                      {adminData?.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4 md:mt-0">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveChanges}
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl font-medium hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-md hover:shadow-lg flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <nav className="flex space-x-8 px-8">
              {['overview', 'security', 'preferences'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-5 px-1 text-sm font-medium border-b-2 transition-all ${activeTab === tab
                    ? 'border-cyan-500 text-cyan-600 font-semibold'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'First Name', name: 'fname', value: adminData?.fname },
                    { label: 'Middle Name', name: 'mname', value: adminData?.mname },
                    { label: 'Last Name', name: 'lname', value: adminData?.lname },
                    { label: 'Username', name: 'username', value: adminData?.username },
                    { label: 'Email', name: 'email', value: adminData?.email, disabled: true },
                    { label: 'Contact Number', name: 'contactNumber', value: adminData?.contactNumber || 'Not provided' },
                  ].map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
                      {isEditing && !field.disabled ? (
                        <input
                          type="text"
                          name={field.name}
                          value={editForm[field.name]}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <p className={`px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl ${field.value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                          {field.value || 'Not provided'}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={editForm.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-200 min-h-[60px]">
                        {adminData?.bio || 'No bio provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Security Settings
                </h3>
                <div className="space-y-6">
                  {[
                    
                    {
                      title: 'Login History',
                      description: 'View your recent account activity',
                      buttonText: 'View History',
                      icon: (
                        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      )
                    },
                    {
                      title: 'Change Password',
                      description: 'Update your password regularly to keep your account secure',
                      buttonText: 'Change Password',
                      buttonStyle: 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white hover:from-cyan-700 hover:to-cyan-800',
                      icon: (
                        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      )
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm mr-4">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                        </div>
                      </div>
                      <button 
                        onClick={item.title === 'Login History' ? openLoginHistory : item.title === 'Change Password' ? openChangePassword : undefined}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md ${item.buttonStyle || 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        {item.buttonText}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Preferences
                </h3>
                <div className="space-y-6">
                  {/* Theme (Dark/Light) Toggle */}
                  <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Appearance</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Switch between light and dark theme</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                      className="p-3 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    >
                      <span className="material-icons text-xl text-gray-700 dark:text-gray-200">
                        {isDark ? 'light_mode' : 'dark_mode'}
                      </span>
                    </button>
                  </div>

                  <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Notification Preferences</h4>
                    <div className="space-y-3">
                      {['Email Notifications', 'Push Notifications', 'SMS Alerts', 'Security Alerts'].map((pref) => (
                        <div key={pref} className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-200">{pref}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-200 after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Language & Region</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                        <select className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Zone</label>
                        <select className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                          <option>UTC-05:00 Eastern Time</option>
                          <option>UTC-06:00 Central Time</option>
                          <option>UTC-07:00 Mountain Time</option>
                          <option>UTC-08:00 Pacific Time</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Account Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Account Information
              </h3>
              <div className="space-y-4">
              
               
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {adminData?.createdOn ? new Date(adminData.createdOn).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last Login</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Today at 10:30 AM</p>
                </div>
              </div>
            </div>
            
            {/* System Status Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                  <div className="flex-shrink-0 h-3 w-3 bg-emerald-500 rounded-full"></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">All Systems Operational</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last checked: 5 minutes ago</p>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>
      </div>

      {/* Login History Modal */}
      {showLoginHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Activity History</h3>
              <button
                onClick={() => setShowLoginHistory(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-300">Loading activity history...</span>
                </div>
              ) : historyError ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 dark:text-red-400 mb-4">{historyError}</p>
                  <button
                    onClick={fetchLoginHistory}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg text-sm font-medium hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-md hover:shadow-lg"
                  >
                    Try Again
                  </button>
                </div>
              ) : loginHistory.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">No activity history found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {loginHistory.map((activity) => (
                    <div key={activity.id} className="flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{activity.action}</h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.timestamp && activity.timestamp.seconds 
                              ? new Date(activity.timestamp.seconds * 1000).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : activity.timestamp && activity.timestamp.toDate
                              ? activity.timestamp.toDate().toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Unknown date'
                            }
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          {activity.targetType && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Target: {activity.targetType}
                            </span>
                          )}
                          {activity.targetID && activity.targetID !== 'system' && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {activity.targetID}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Change Password</h3>
              <button
                onClick={() => setShowChangePassword(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Enter new password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Confirm new password"
                  />
                </div>

                {passwordError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowChangePassword(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl font-medium hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Changing...
                      </div>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;