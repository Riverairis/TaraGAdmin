import React from 'react';
import { Link } from 'react-router-dom';
import newLogo from '/new-logo.png';

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen, adminName = 'Admin', activeSection, navigate, onLogout }) => {
  

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

  return (
    <>
      {/* Google Fonts - Poppins */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      {/* Material Icons */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      <aside
        className={`fixed inset-y-0 left-0 w-64 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:w-64 z-20 flex flex-col bg-white text-black dark:bg-gray-900 dark:text-gray-100`}
        style={{ position: 'fixed', height: '100vh', fontFamily: 'Poppins, sans-serif' }}
      >
        {/* Logo Section */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={newLogo}
                alt="TaraG Logo"
                className="w-10 h-10 rounded-lg mr-3"
              />
              <div>
                <div className="text-black dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>TaraG</div>
                <div className="text-xs text-black dark:text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>Administrator Panel</div>
              </div>
            </div>

            
          </div>
        </div>

        {/* Navigation - Now scrollable */}
        <nav className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-2">
            <Link
              to="/admin-dashboard"
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                activeSection === 'home'
                  ? 'bg-cyan-100 text-black dark:bg-cyan-900/30 dark:text-white'
                  : 'text-black hover:bg-gray-100 hover:text-black dark:text-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className={`material-icons mr-3 text-lg`}>
                dashboard
              </span>
              Dashboard
            </Link>

            <Link
              to="/admin-dashboard?section=travelers"
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                activeSection === 'travelers'
                  ? 'bg-cyan-100 text-black dark:bg-cyan-900/30 dark:text-white'
                  : 'text-black hover:bg-gray-100 hover:text-black dark:text-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className={`material-icons mr-3 text-lg`}>
                groups
              </span>
              Travelers
            </Link>

            <Link
              to="/admin-dashboard?section=tour-agencies"
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                activeSection === 'tour-agencies'
                  ? 'bg-cyan-100 text-black dark:bg-cyan-900/30 dark:text-white'
                  : 'text-black hover:bg-gray-100 hover:text-black dark:text-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => navigate('/admin-dashboard?section=tour-agencies')}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className={`material-icons mr-3 text-lg`}>
                business
              </span>
              Agencies
            </Link>

            <Link
              to="/admin-dashboard?section=emergency"
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                activeSection === 'emergency'
                  ? 'bg-cyan-100 text-black dark:bg-cyan-900/30 dark:text-white'
                  : 'text-black hover:bg-gray-100 hover:text-black dark:text-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className={`material-icons mr-3 text-lg`}>
                emergency
              </span>
              Emergency
            </Link>

            <Link
              to="/admin-dashboard?section=revenue"
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                activeSection === 'revenue'
                  ? 'bg-cyan-100 text-black dark:bg-cyan-900/30 dark:text-white'
                  : 'text-black hover:bg-gray-100 hover:text-black dark:text-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className={`material-icons mr-3 text-lg`}>
                trending_up
              </span>
              Revenue
            </Link>

            <Link
              to="/admin-dashboard?section=alerts"
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                activeSection === 'alerts'
                  ? 'bg-cyan-100 text-black dark:bg-cyan-900/30 dark:text-white'
                  : 'text-black hover:bg-gray-100 hover:text-black dark:text-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className={`material-icons mr-3 text-lg`}>
                campaign
              </span>
              Alerts
            </Link>
          </div>
        </nav>

        {/* Fixed Bottom Profile Section */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/admin-dashboard?section=profile')}
              className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-1"
            >
              <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center mr-3 text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {adminName.charAt(0)}
              </div>
              <div className="flex-1 text-left">
                <div className="text-black dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{adminName}</div>
                <div className="text-xs text-black dark:text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>Administrator</div>
              </div>
            </button>

            {/* Logout button beside profile */}
            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-black hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Logout"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className="material-icons text-lg">
                logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;