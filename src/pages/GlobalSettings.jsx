import React, { useState, StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function RootApp() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return <App />;
}

const GlobalSettings = () => {
  const [settings, setSettings] = useState({
    destinations: ['Cebu', 'Bohol', 'Palawan', 'Boracay', 'Siargao'],
    categories: ['Adventure', 'Cultural', 'Beach', 'Mountain', 'Historical', 'Food Tour'],
    permissions: {
      userRegistration: true,
      guideApplications: true,
      publicRoutes: true,
      emergencyAlerts: true
    },
    systemMaintenance: false,
    maxGroupSize: 20,
    emergencyContactNumber: '+63-900-123-4567'
  });

  const [newDestination, setNewDestination] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const addDestination = () => {
    if (newDestination && !settings.destinations.includes(newDestination)) {
      setSettings({
        ...settings,
        destinations: [...settings.destinations, newDestination]
      });
      setNewDestination('');
    }
  };

  const addCategory = () => {
    if (newCategory && !settings.categories.includes(newCategory)) {
      setSettings({
        ...settings,
        categories: [...settings.categories, newCategory]
      });
      setNewCategory('');
    }
  };

  const removeDestination = (destination) => {
    setSettings({
      ...settings,
      destinations: settings.destinations.filter(d => d !== destination)
    });
  };

  const removeCategory = (category) => {
    setSettings({
      ...settings,
      categories: settings.categories.filter(c => c !== category)
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Global Settings</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Destinations</h3>
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="Add new destination"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <button
                onClick={addDestination}
                className="bg-cyan-600 text-white px-4 py-2 rounded-r-lg hover:bg-cyan-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.destinations.map(destination => (
                <span
                  key={destination}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {destination}
                  <button
                    onClick={() => removeDestination(destination)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="Add new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <button
                onClick={addCategory}
                className="bg-cyan-600 text-white px-4 py-2 rounded-r-lg hover:bg-cyan-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.categories.map(category => (
                <span
                  key={category}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {category}
                  <button
                    onClick={() => removeCategory(category)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings.permissions).map(([key, value]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setSettings({
                    ...settings,
                    permissions: { ...settings.permissions, [key]: e.target.checked }
                  })}
                  className="mr-3 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Group Size</label>
              <input
                type="number"
                value={settings.maxGroupSize}
                onChange={(e) => setSettings({...settings, maxGroupSize: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
              <input
                type="text"
                value={settings.emergencyContactNumber}
                onChange={(e) => setSettings({...settings, emergencyContactNumber: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.systemMaintenance}
                onChange={(e) => setSettings({...settings, systemMaintenance: e.target.checked})}
                className="mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">Enable System Maintenance Mode</span>
            </label>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors font-medium">
            <i className="fas fa-save mr-2"></i>Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default {
  darkMode: 'class',
  content: ['./src/**/*.{jsx,js}', './index.html'],
  theme: {
    extend: {
      colors: {
        cyan: {
          DEFAULT: '#0065F8',
        }
      }
    },
  },
  plugins: [],
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)