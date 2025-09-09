// ProfileSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSection = ({ adminName, onLogout }) => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="flex space-x-6 mb-8">
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-4 py-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(item => (
                  <div key={item} className="h-32 bg-gray-200 rounded-xl"></div>
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
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Error Loading Profile</h3>
                <p className="text-red-700 mt-2">{error}</p>
                <button
                  onClick={fetchAdminProfile}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
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
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section - Removed the gradient header */}
        
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          {/* Profile Content */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="w-24 h-24 bg-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                  {adminData?.fname?.charAt(0) || 'A'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {adminData?.fname} {adminData?.mname && `${adminData.mname} `}{adminData?.lname}
                  </h2>
                  <p className="text-gray-600 mt-1">{adminData?.email}</p>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800 capitalize">
                      {adminData?.type}
                    </span>
                    <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 capitalize">
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
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Edit Profile
                    </button>
                    
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSaveChanges}
                      className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-t border-gray-200">
            <nav className="flex space-x-8 px-8">
              {['overview', 'security'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-cyan-500 text-cyan-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fname"
                        value={editForm.fname}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-900">{adminData?.fname}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lname"
                        value={editForm.lname}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-900">{adminData?.lname}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={editForm.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-900">{adminData?.username}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="contactNumber"
                        value={editForm.contactNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-900">{adminData?.contactNumber || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={editForm.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-700">{adminData?.bio || 'No bio provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Enable
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Login History</h4>
                      <p className="text-sm text-gray-600 mt-1">View your recent account activity</p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      View History
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-600 mt-1">Update your password regularly to keep your account secure</p>
                    </div>
                    <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Account Info Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-4">
               
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-sm text-gray-900">
                    {adminData?.createdOn ? new Date(adminData.createdOn).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="text-sm text-gray-900">Today at 10:30 AM</p>
                </div>
              </div>
            </div>
            
            {/* System Status Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-3 w-3 bg-emerald-500 rounded-full"></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">All Systems Operational</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Last checked: 5 minutes ago</p>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;