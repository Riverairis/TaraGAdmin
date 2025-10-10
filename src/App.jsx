// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Profile from './pages/ProfileSection.jsx';
import Login from './pages/Login.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        
        if (accessToken && user) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Function to update authentication state (to be passed to Login component)
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Function to handle logout (to be passed to components)
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div>
        
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
              <Login onLoginSuccess={handleLoginSuccess} /> : 
              <Navigate to="/admin-dashboard" />} 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              isAuthenticated ? 
              <AdminDashboard onLogout={handleLogout} /> : 
              <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={
              isAuthenticated ? 
              <Profile onLogout={handleLogout} /> : 
              <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Navigate to="/admin-dashboard" /> : 
              <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;