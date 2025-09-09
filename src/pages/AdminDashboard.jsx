import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserList from './UserList.jsx';
import TourAgencyList from './TourAgencyList.jsx';
import AlertsAnnouncements from './AlertsAnnouncements.jsx';
import GlobalSettings from './GlobalSettings.jsx';
import AdminSidebar from './AdminSidebar.jsx';
import EmergencyMonitoring from './EmergencyMonitoring.jsx';
import AnalyticsDashboard from './AnalyticsDashboard.jsx';
import RevenueManagement from './RevenueManagement.jsx';
import ProfileSections from './ProfileSection.jsx';

// Profile section component to display inline
const ProfileSection = ({ adminName }) => {
  const navigate = useNavigate();

   const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

     // Call the logout callback if provided
    if (onLogout) {
      onLogout();
    }

     navigate('/login');
  };

  
};

const AdminDashboard = ({ onLogout }) => {
  const [adminName, setAdminName] = useState('Admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeSection = searchParams.get('section') || 'home';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        
        if (!accessToken || !user) {
          navigate('/login');
          return;
        }
        
        // Verify the token is still valid by fetching user profile
        const userData = JSON.parse(user);
        const response = await fetch('http://localhost:5000/api/auth/fetch-user-profile', { // FIXED: Added full URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ email: userData.email })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        // Update user data if needed
        const updatedUserData = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUserData.user));
        setAdminName(updatedUserData.user.fname || 'Admin');
        
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Component */}
     <AdminSidebar 
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
  adminName={adminName}
  activeSection={activeSection}
  navigate={navigate}
  onLogout={onLogout} // Make sure this is passed correctly
/>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-cyan-600 text-white rounded-lg shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Main Content - Now scrollable independently */}
      <main className="flex-1 md:ml-64 overflow-auto" style={{ height: '100vh' }}>
        {activeSection === 'home' && (
          <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
                  <div className="mb-6 md:mb-0">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Hello, {adminName}!</h1>
                    <p className="text-cyan-100 text-lg">Welcome to the TaraG Administrator Panel</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-1/4 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-white/20 to-transparent rounded-full translate-y-1/4 -translate-x-1/4"></div>
              </div>

              {/* Quick Stats Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 ">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                      <p className="text-3xl font-bold text-gray-900">1,247</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+12%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 ">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium">Active Tours</h3>
                      <p className="text-3xl font-bold text-gray-900">89</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+8%</span>
                    <span className="text-gray-500 ml-1">from last week</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 ">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium">Partner Agencies</h3>
                      <p className="text-3xl font-bold text-gray-900">65</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-medium">58 active</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium">Monthly Revenue</h3>
                      <p className="text-3xl font-bold text-gray-900">₱2.4M</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+15%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
              </div>

              {/* Analytics Section */}
              <AnalyticsDashboard />
            </div>
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeSection === 'travelers' && <UserList />}
            {activeSection === 'tour-agencies' && <TourAgencyList />}
            {activeSection === 'alerts' && <AlertsAnnouncements />}
            {activeSection === 'settings' && <GlobalSettings />}
            {activeSection === 'emergency' && <EmergencyMonitoring />}
            {activeSection === 'revenue' && <RevenueManagement />}
           {activeSection === 'profile' && (
  <ProfileSections adminName={adminName} onLogout={onLogout} />
)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;