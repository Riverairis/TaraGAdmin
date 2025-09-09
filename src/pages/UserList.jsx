// UserList.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

// Add custom CSS for the dropdown menu
const dropdownStyle = `
  .action-dropdown {
    max-height: 300px;
    overflow-y: auto;
    z-index: 100;
  }
  
  @media (max-height: 600px) {
    .action-dropdown {
      max-height: 200px;
    }
  }
`;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [warnings, setWarnings] = useState({});
  const [actionMenu, setActionMenu] = useState(null);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProfileData, setUserProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  
  // Create a ref for the action menu
  const actionMenuRef = useRef(null);

  // Inject custom CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = dropdownStyle;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add effect to handle clicks outside the action menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        // Check if the click is on the three dots button
        const isActionButton = event.target.closest('button[class*="p-2 rounded-lg"]');
        if (!isActionButton) {
          setActionMenu(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Fetch travelers from backend
        const response = await axios.get('http://localhost:5000/api/user/type/traveler', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        // Process and secure the data
        const formattedUsers = response.data.map(user => ({
          id: user.id || user.userID,
          name: `${user.fname || ''} ${user.mname || ''} ${user.lname || ''}`.trim() || 'N/A',
          username: user.username || 'N/A',
          email: user.email || 'N/A',
          status: user.status || 'active', // Add status field
          // Store minimal data for security
          _secure: {
            actualEmail: user.email
          }
        }));
        
        setUsers(formattedUsers);
        
        // Initialize warnings from backend if available
        const initialWarnings = {};
        formattedUsers.forEach(user => {
          initialWarnings[user.id] = user.warningCount || 0;
        });
        setWarnings(initialWarnings);
        setUsingDemoData(false);
      } catch (error) {
        console.error('Error fetching travelers:', error);
        setUsers([]);
        setUsingDemoData(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to mask phone number
  const maskPhone = (phone) => {
    if (!phone) return 'N/A';
    if (phone.length <= 4) return '*'.repeat(phone.length);
    return '*'.repeat(phone.length - 4) + phone.slice(-4);
  };

  const fetchUserProfile = async (userId) => {
  try {
    // Use the correct token name - accessToken instead of authToken
    const token = localStorage.getItem('accessToken'); // FIXED: Changed from authToken to accessToken
    
    if (!token) {
      alert('Please login again. Session expired.');
      return;
    }

    const response = await axios.get(`http://localhost:5000/api/user/secure-profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Process the secure data for display
    const userData = response.data.user;
    const securedProfile = {
      likes: userData.likes || [],
      trips: userData.trips || [],
      loginHistory: userData.loginHistory || [],
      // Mask phone numbers in emergency contacts
      emergencyContacts: (userData.emergencyContacts || []).map(contact => ({
        name: contact.name || 'N/A',
        relationship: contact.relationship || 'N/A',
        phone: maskPhone(contact.phone)
      })),
      activityLogs: userData.activityLogs || []
    };
    
    setUserProfileData(securedProfile);
    setSelectedUser(userId);
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
  }
};

  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileData(null);
    setActiveTab('profile');
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddWarning = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://localhost:5000/api/user/${userId}/warning`, {
        action: 'add'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setWarnings(prev => ({
        ...prev,
        [userId]: (prev[userId] || 0) + 1
      }));
    } catch (error) {
      console.error('Error adding warning:', error);
      alert('Failed to add warning');
    }
    setActionMenu(null);
  };

  const handleRemoveWarning = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://localhost:5000/api/user/${userId}/warning`, {
        action: 'remove'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setWarnings(prev => ({
        ...prev,
        [userId]: Math.max(0, (prev[userId] || 0) - 1)
      }));
    } catch (error) {
      console.error('Error removing warning:', error);
      alert('Failed to remove warning');
    }
    setActionMenu(null);
  };

  const handleSuspendUser = async (userId) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.post(`http://localhost:5000/api/user/${userId}/status`, {
          status: 'suspended'
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Update the user status in the local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? {...user, status: 'suspended'} : user
        ));
        alert('User suspended successfully');
      } catch (error) {
        console.error('Error suspending user:', error);
        alert('Failed to suspend user');
      }
    }
    setActionMenu(null);
  };

  const handleBanUser = async (userId) => {
    if (window.confirm('Are you sure you want to ban this user? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.post(`http://localhost:5000/api/user/${userId}/status`, {
          status: 'banned'
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Update the user status in the local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? {...user, status: 'banned'} : user
        ));
        alert('User banned successfully');
      } catch (error) {
        console.error('Error banning user:', error);
        alert('Failed to ban user');
      }
    }
    setActionMenu(null);
  };

  const handleActivateUser = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://localhost:5000/api/user/${userId}/status`, {
        status: 'active'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update the user status in the local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? {...user, status: 'active'} : user
      ));
      alert('User activated successfully');
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Failed to activate user');
    }
    setActionMenu(null);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`http://localhost:5000/api/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsers(prev => prev.filter(user => user.id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
    setActionMenu(null);
  };

  const toggleActionMenu = (userId, event) => {
    if (actionMenu === userId) {
      setActionMenu(null);
    } else {
      setActionMenu(userId);
      // Calculate position to prevent menu from being cut off
      const rect = event.target.getBoundingClientRect();
      const menuHeight = 280; // Approximate height of the menu
      const windowHeight = window.innerHeight;
      
      let topPosition = rect.bottom + window.scrollY;
      
      // If menu would go off screen, position it above the button
      if (rect.bottom + menuHeight > windowHeight) {
        topPosition = rect.top + window.scrollY - menuHeight;
      }
      
      setMenuPosition({
        top: topPosition,
        left: rect.right + window.scrollX - 224 // 224 is menu width
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header and search bar */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
           
            <div>
              <h1 className="text-xl font-bold text-gray-900">Travelers</h1>
              <p className="text-sm text-gray-500">Manage all travelers</p>
            </div>
          </div>
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Search by name, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      {selectedUser && userProfileData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  User Profile: {users.find(u => u.id === selectedUser)?.name}
                </h2>
                <button 
                  onClick={closeUserProfile}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              {/* Tab Navigation */}
              <div className="mt-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`py-2 px-1 text-sm font-medium ${
                      activeTab === 'profile'
                        ? 'border-b-2 border-cyan-500 text-cyan-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className="fas fa-user mr-2"></i>
                    Profile Details
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`py-2 px-1 text-sm font-medium ${
                      activeTab === 'activity'
                        ? 'border-b-2 border-cyan-500 text-cyan-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className="fas fa-history mr-2"></i>
                    Activity Logs
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Likes/Interests */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="fas fa-heart text-red-500 mr-2"></i>
                    Interests & Likes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfileData.likes && userProfileData.likes.length > 0 ? (
                      userProfileData.likes.map((like, index) => (
                        <span key={index} className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">
                          {like}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No interests listed</p>
                    )}
                  </div>
                </div>
                
                {/* Trips */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="fas fa-route text-blue-500 mr-2"></i>
                    Recent Trips
                  </h3>
                  <div className="space-y-3">
                    {userProfileData.trips && userProfileData.trips.length > 0 ? (
                      userProfileData.trips.map((trip, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-gray-200">
                          <div className="font-medium text-gray-900">{trip.destination}</div>
                          <div className="text-sm text-gray-600">
                            {trip.date} • {trip.duration}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No trips recorded</p>
                    )}
                  </div>
                </div>
                
                {/* Login History */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="fas fa-history text-purple-500 mr-2"></i>
                    Recent Login History
                  </h3>
                  <div className="space-y-3">
                    {userProfileData.loginHistory && userProfileData.loginHistory.length > 0 ? (
                      userProfileData.loginHistory.map((login, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-gray-200">
                          <div className="font-medium text-gray-900">
                            {login.date} at {login.time}
                          </div>
                          <div className="text-sm text-gray-600">{login.device}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No login history available</p>
                    )}
                  </div>
                </div>
                
                {/* Emergency Contacts */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="fas fa-address-book text-green-500 mr-2"></i>
                    Emergency Contacts
                  </h3>
                  <div className="space-y-3">
                    {userProfileData.emergencyContacts && userProfileData.emergencyContacts.length > 0 ? (
                      userProfileData.emergencyContacts.map((contact, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-gray-200">
                          <div className="font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-600">
                            {contact.relationship} • {contact.phone}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No emergency contacts listed</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Activity Logs Tab Content */}
            {activeTab === 'activity' && (
              <div className="p-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="fas fa-clipboard-list text-cyan-500 mr-2"></i>
                    User Activity Logs
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userProfileData.activityLogs && userProfileData.activityLogs.length > 0 ? (
                          userProfileData.activityLogs.map((log, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  log.type === 'Login Attempt' 
                                    ? 'bg-blue-100 text-blue-800'
                                    : log.type === 'Password Change'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {log.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.time}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                              No activity logs found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
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

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {warnings[user.id] || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.status === 'suspended' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <i className="fas fa-pause-circle mr-1"></i>
                          Suspended
                        </span>
                      ) : user.status === 'banned' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <i className="fas fa-ban mr-1"></i>
                          Banned
                        </span>
                      ) : warnings[user.id] > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <i className="fas fa-exclamation-triangle mr-1"></i>
                          Warning
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <i className="fas fa-check-circle mr-1"></i>
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="relative">
                        <button 
                          onClick={(e) => toggleActionMenu(user.id, e)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                        
                        {actionMenu === user.id && (
                          <div 
                            ref={actionMenuRef}
                            className="fixed action-dropdown bg-white rounded-md shadow-lg py-1 border border-gray-200 w-56"
                            style={{
                              top: `${menuPosition.top}px`,
                              left: `${menuPosition.left}px`
                            }}
                          >
                            <button
                              onClick={() => fetchUserProfile(user.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-100"
                            >
                              <i className="fas fa-user mr-2"></i>
                              View Profile
                            </button>
                            <button
                              onClick={() => handleAddWarning(user.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-100"
                            >
                              <i className="fas fa-exclamation-triangle mr-2"></i>
                              Add Warning
                            </button>
                            <button
                              onClick={() => handleRemoveWarning(user.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                            >
                              <i className="fas fa-check-circle mr-2"></i>
                              Remove Warning
                            </button>
                            {user.status === 'active' ? (
                              <>
                                <button
                                  onClick={() => handleSuspendUser(user.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-orange-700 hover:bg-orange-100"
                                >
                                  <i className="fas fa-pause-circle mr-2"></i>
                                  Suspend User
                                </button>
                                <button
                                  onClick={() => handleBanUser(user.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                                >
                                  <i className="fas fa-ban mr-2"></i>
                                  Ban User
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleActivateUser(user.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                              >
                                <i className="fas fa-check-circle mr-2"></i>
                                Activate User
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                            >
                              <i className="fas fa-trash mr-2"></i>
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No travelers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;