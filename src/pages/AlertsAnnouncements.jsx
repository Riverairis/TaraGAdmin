import React, { useState } from 'react';

const AlertsAnnouncements = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, title: 'System Maintenance', message: 'Scheduled maintenance on Jan 20, 2025 from 2:00 AM to 5:00 AM PST. Some services may be temporarily unavailable during this period.', type: 'info', status: 'Active', date: '2025-01-15', priority: 'medium' },
    { id: 2, title: 'Weather Alert', message: 'Typhoon warning for Visayas region. Expected landfall in 48 hours. All tours in affected areas are cancelled until further notice.', type: 'warning', status: 'Active', date: '2025-01-15', priority: 'high' },
    { id: 3, title: 'New Feature Release', message: 'New group chat feature now available for all users. Coordinate with your travel groups more efficiently with dedicated chat channels.', type: 'success', status: 'Sent', date: '2025-01-14', priority: 'low' }
  ]);

  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
    priority: 'medium'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSendAlert = () => {
    if (newAlert.title && newAlert.message) {
      const alert = {
        id: Date.now(),
        ...newAlert,
        status: 'Active',
        date: new Date().toISOString().split('T')[0]
      };
      setAlerts([alert, ...alerts]);
      setNewAlert({ title: '', message: '', type: 'info', targetAudience: 'all', priority: 'medium' });
      setIsModalOpen(false);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'info': return 'fas fa-info-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-exclamation-circle';
      default: return 'fas fa-bell';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-cyan-600 bg-cyan-100';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active': return 'fas fa-circle';
      case 'Sent': return 'fas fa-check-circle';
      default: return 'fas fa-clock';
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return { text: 'High', class: 'bg-red-100 text-red-800' };
      case 'medium': return { text: 'Medium', class: 'bg-yellow-100 text-yellow-800' };
      case 'low': return { text: 'Low', class: 'bg-blue-100 text-blue-800' };
      default: return { text: 'Medium', class: 'bg-gray-100 text-gray-800' };
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.type === filter;
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Alerts & Announcements</h1>
        <p className="text-gray-600 mt-2">Manage and send important notifications to users</p>
      </div>

      {/* Stats and Action Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-lg bg-cyan-50 p-3">
              <i className="fas fa-bell text-cyan-500 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">Total Alerts</h3>
              <p className="text-2xl font-semibold text-gray-900">{alerts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-lg bg-green-50 p-3">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">Active</h3>
              <p className="text-2xl font-semibold text-gray-900">{alerts.filter(a => a.status === 'Active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="rounded-lg bg-yellow-50 p-3">
              <i className="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">Warnings</h3>
              <p className="text-2xl font-semibold text-gray-900">{alerts.filter(a => a.type === 'warning').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-500 text-white px-4 py-3 rounded-xl hover:from-cyan-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <i className="fas fa-plus mr-2"></i>New Alert
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === 'all' ? 'bg-cyan-100 text-cyan-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('info')}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === 'info' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Info
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Warning
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === 'success' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Success
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Send New Alert</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alert Title *</label>
                    <input
                      type="text"
                      placeholder="Enter alert title"
                      value={newAlert.title}
                      onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
                    <select
                      value={newAlert.type}
                      onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    >
                      <option value="info">Information</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <select
                      value={newAlert.targetAudience}
                      onChange={(e) => setNewAlert({...newAlert, targetAudience: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    >
                      <option value="all">All Users</option>
                      <option value="travelers">Travelers Only</option>
                      <option value="guides">Tour Guides Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                    <select
                      value={newAlert.priority}
                      onChange={(e) => setNewAlert({...newAlert, priority: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    placeholder="Enter your alert message here..."
                    value={newAlert.message}
                    onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                    rows="4"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendAlert}
                    disabled={!newAlert.title || !newAlert.message}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>Send Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Alerts & Announcements</h2>
          <p className="text-sm text-gray-500">{filteredAlerts.length} {filteredAlerts.length === 1 ? 'alert' : 'alerts'}</p>
        </div>
        
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
              <i className="fas fa-bell-slash text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No alerts found</h3>
            <p className="text-gray-500">Try changing your search or filter parameters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map(alert => (
              <div key={alert.id} className="border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start mb-2">
                      <div className={`rounded-lg p-3 mr-4 ${getTypeColor(alert.type)}`}>
                        <i className={`${getTypeIcon(alert.type)} text-lg`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{alert.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                            alert.status === 'Active' ? 'bg-green-100 text-green-800' :
                            alert.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            <i className={`${getStatusIcon(alert.status)} mr-1 text-xs`}></i>
                            {alert.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-2 mb-4">{alert.message}</p>
                        
                        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                          <span className="inline-flex items-center">
                            <i className="fas fa-calendar-alt mr-2"></i>
                            {alert.date}
                          </span>
                          <span className="inline-flex items-center">
                            <i className="fas fa-users mr-2"></i>
                            {alert.targetAudience === 'all' ? 'All Users' : 
                              alert.targetAudience === 'travelers' ? 'Travelers Only' : 'Tour Guides Only'}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(alert.priority).class}`}>
                            {getPriorityBadge(alert.priority).text} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AlertsAnnouncements;