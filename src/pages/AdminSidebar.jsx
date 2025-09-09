import React from 'react';
import { Link } from 'react-router-dom';
import newLogo from '/new-logo.png';

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen, adminName, activeSection, navigate, onLogout }) => {
  
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
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:w-64 z-20 flex flex-col`}
        style={{ position: 'fixed', height: '100vh', fontFamily: 'Poppins, sans-serif' }}
      >
        {/* Logo Section */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="flex items-center">      
            <img 
              src={newLogo} 
              alt="TaraG Logo" 
              className="w-10 h-10 rounded-lg mr-3"
            />
            <div>
              <div className="font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>TaraG</div>
              <div className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>Administrator Panel</div>
            </div>
          </div>
        </div>
        
        {/* Navigation - Now scrollable */}
        <nav className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-2">
            <Link
              to="/admin-dashboard"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeSection === 'home'
                  ? 'bg-cyan-100 text-cyan-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className={`material-icons mr-3 text-lg ${activeSection === 'home' ? 'text-cyan-800' : 'text-gray-600'}`}>
                dashboard
              </span>
              Dashboard
            </Link>
            
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                User Management
              </p>
            </div>
            
            <Link
              to="/admin-dashboard?section=travelers"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeSection === 'travelers'
                  ? 'bg-cyan-100 text-cyan-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className={`material-icons mr-3 text-lg ${activeSection === 'travelers' ? 'text-cyan-800' : 'text-gray-600'}`}>
                groups
              </span>
              Travelers
            </Link>
            
            <Link
              to="/admin-dashboard?section=tour-agencies"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeSection === 'tour-agencies'
                  ? 'bg-cyan-100 text-cyan-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => navigate('/admin-dashboard?section=tour-agencies')}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className={`material-icons mr-3 text-lg ${activeSection === 'tour-agencies' ? 'text-cyan-800' : 'text-gray-600'}`}>
                business
              </span>
              Agencies
            </Link>

            <Link
              to="/admin-dashboard?section=emergency"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeSection === 'emergency'
                  ? 'bg-cyan-100 text-cyan-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className={`material-icons mr-3 text-lg ${activeSection === 'emergency' ? 'text-cyan-800' : 'text-gray-600'}`}>
                emergency
              </span>
              Emergency
            </Link>

            <Link
              to="/admin-dashboard?section=revenue"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeSection === 'revenue'
                  ? 'bg-cyan-100 text-cyan-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className={`material-icons mr-3 text-lg ${activeSection === 'revenue' ? 'text-cyan-800' : 'text-gray-600'}`}>
                trending_up
              </span>
              Revenue
            </Link>
            
            <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Global Settings
              </p>
            </div>

            <Link
              to="/admin-dashboard?section=alerts"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeSection === 'alerts'
                  ? 'bg-cyan-100 text-cyan-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <span className={`material-icons mr-3 text-lg ${activeSection === 'alerts' ? 'text-cyan-800' : 'text-gray-600'}`}>
                campaign
              </span>
              Alerts
            </Link>
          </div>
        </nav>

        {/* Fixed Bottom Profile Section */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 mt-auto">
          <button
            onClick={() => navigate('/admin-dashboard?section=profile')}
            className="flex items-center mb-4 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center mr-3 text-white font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {adminName.charAt(0)}
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{adminName}</div>
              <div className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>Administrator</div>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-gray-500">
              <span className="material-icons text-white text-lg">
                logout
              </span>
            </div>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;