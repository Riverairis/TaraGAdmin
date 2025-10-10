import React, { useState, useEffect } from 'react';

const IntegratedAlertsSystem = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  
  // Alerts & Announcements State
  const [alerts, setAlerts] = useState([
    
  ]);

  const initialNewAlert = {
    title: '',
    description: '',
    severity: 'medium',
    startOn: new Date().toISOString().slice(0, 16),
    endOn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    locations: [],
    target: 'everyone'
  };
  const [newAlert, setNewAlert] = useState(initialNewAlert);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New filter states
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [targetFilter, setTargetFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Emergency Monitoring State
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Validation / Notification modal state (replaces window.alert / confirm)
  const [validationModal, setValidationModal] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info', // 'info' | 'success' | 'error' | 'confirm'
    onConfirm: null,
  });

  const showValidation = ({ title = '', message = '', type = 'info', onConfirm = null }) => {
    setValidationModal({ open: true, title, message, type, onConfirm });
  };
  const closeValidation = () => setValidationModal({ open: false, title: '', message: '', type: 'info', onConfirm: null });

  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // API base (configurable via Vite env var VITE_API_BASE). If empty, fall back to relative '/api' path.
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? String(import.meta.env.VITE_API_BASE).replace(/\/$/, '')
    : '';

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const url = API_BASE ? `${API_BASE}/alerts` : '/api/alerts';
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) {
        console.error('Failed to fetch alerts', res.status);
        setLoading(false);
        return;
      }
      const data = await res.json();

      // Map backend alert shape to UI-friendly fields used in this component
      const mapped = (Array.isArray(data) ? data : []).map(a => {
        const start = a.startOn ? new Date(a.startOn) : null;
        const end = a.endOn ? new Date(a.endOn) : null;
        const now = new Date();
        const status = start && end && start <= now && end >= now ? 'Active' : 'Sent';
        return {
          id: a.id || a._id || Date.now(),
          title: a.title || 'Untitled',
          message: a.description || '',
          type: a.severity || 'info',
          status,
          date: start ? start.toISOString().split('T')[0] : '',
          priority: a.severity || 'medium',
          targetAudience: a.target === 'everyone' ? 'all' : a.target === 'traveler' ? 'travelers' : 'guides',
          locations: a.locations || [],
          startOn: a.startOn,
          endOn: a.endOn,
          raw: a,
        };
      });

      setAlerts(mapped);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAlert = async () => {
    if (!newAlert.title || !newAlert.description || newAlert.locations.length === 0) {
      // show validation modal instead of alert()
      showValidation({
        title: 'Validation Error',
        message: 'Please provide a title, description and select at least one location before sending.',
        type: 'error'
      });
      return;
    }
    try {
       const alertData = {
         title: newAlert.title,
         description: newAlert.description,
         severity: newAlert.severity,
         startOn: new Date(newAlert.startOn).toISOString(),
         endOn: new Date(newAlert.endOn).toISOString(),
         locations: newAlert.locations,
         target: newAlert.target,
       };

        const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || sessionStorage.getItem('accessToken') || 'demo-token';
        const baseUrl = API_BASE ? `${API_BASE}/alerts` : '/api/alerts';

        // Shared safe JSON parse helper
        const parseJsonSafely = async (res) => {
          try {
            if (res.status === 204) return null;
            const text = await res.text();
            if (!text) return null;
            return JSON.parse(text);
          } catch (err) {
            return null;
          }
        };

        if (isEditing && editingId) {
          const url = `${baseUrl}/${editingId}`;
          const res = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(alertData),
          });
          if (!res.ok) throw new Error(`Update failed: ${res.status}`);
          await parseJsonSafely(res);

          // Update local UI list
          setAlerts(prev => prev.map(a => a.id === editingId ? ({
            ...a,
            title: alertData.title,
            message: alertData.description,
            type: alertData.severity,
            priority: alertData.severity,
            locations: alertData.locations,
            startOn: alertData.startOn,
            endOn: alertData.endOn,
          }) : a));

          setIsEditing(false);
          setEditingId(null);
          setIsModalOpen(false);
          setNewAlert(initialNewAlert);
          showValidation({ title: 'Updated', message: 'Alert updated successfully', type: 'success' });
          return;
        }

        // Create new alert (POST)
        const res = await fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(alertData),
        });
        if (!res.ok) {
          const err = await parseJsonSafely(res);
          throw new Error((err && (err.message || err.error)) || `HTTP ${res.status}`);
        }
        const result = await parseJsonSafely(res);
        const newId = (result && result.id) || Date.now();

        const created = {
          id: newId,
          title: alertData.title,
          message: alertData.description,
          type: alertData.severity,
          status: 'Active',
          date: new Date().toISOString().split('T')[0],
          priority: alertData.severity,
          targetAudience: alertData.target === 'everyone' ? 'all' : alertData.target === 'traveler' ? 'travelers' : 'guides',
          locations: alertData.locations,
          startOn: alertData.startOn,
          endOn: alertData.endOn,
        };

        setAlerts(prev => [created, ...prev]);
        setNewAlert(initialNewAlert);
        setIsModalOpen(false);
        showValidation({ title: 'Created', message: 'Alert created successfully!', type: 'success' });
      } catch (error) {
        console.error('Error sending alert:', error);
        showValidation({ title: 'Error', message: `Failed to send alert: ${error.message}. Check console for details.`, type: 'error' });
      }
  };

  // Populate modal for editing an existing alert
  const handleEditAlert = (alert) => {
    setIsEditing(true);
    setEditingId(alert.id);
    setIsModalOpen(true);
    setNewAlert({
      title: alert.title || '',
      description: alert.message || alert.description || '',
      severity: alert.priority || alert.type || 'medium',
      startOn: alert.startOn ? new Date(alert.startOn).toISOString().slice(0,16) : new Date().toISOString().slice(0,16),
      endOn: alert.endOn ? new Date(alert.endOn).toISOString().slice(0,16) : new Date(Date.now()+24*60*60*1000).toISOString().slice(0,16),
      locations: alert.locations || [],
      target: alert.raw && alert.raw.target ? alert.raw.target : (alert.targetAudience === 'all' ? 'everyone' : (alert.targetAudience === 'travelers' ? 'traveler' : 'tourGuide')),
    });
  };

  const handleDeleteAlert = async (alertId) => {
    // show confirm modal; onConfirm performs deletion
    showValidation({
      title: 'Delete Alert',
      message: 'Are you sure you want to delete this alert?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || sessionStorage.getItem('accessToken') || 'demo-token';
          const baseUrl = API_BASE ? `${API_BASE}/alerts` : '/api/alerts';
          const res = await fetch(`${baseUrl}/${alertId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
          if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
          setAlerts(prev => prev.filter(a => a.id !== alertId));
          // show a success modal after deletion; keep confirmation modal open until user closes it
          setValidationModal({ open: true, title: 'Deleted', message: 'Alert deleted successfully', type: 'success', onConfirm: null });
        } catch (err) {
          console.error('Delete error', err);
          setValidationModal({ open: true, title: 'Error', message: 'Failed to delete alert', type: 'error', onConfirm: null });
        }
      }
    });
  };

  // Helper to close modal and reset editing state
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setNewAlert(initialNewAlert);
  };

  const handleNotifyServices = (alertId) => {
    console.log(`Notifying services for alert ${alertId}`);
    setActiveAlerts(alerts => 
      alerts.map(alert => 
        alert.id === alertId 
          ? {...alert, servicesNotified: true, notifiedAt: new Date().toISOString()} 
          : alert
      )
    );
    showValidation({ title: 'Notified', message: `Emergency services notified for alert ${alertId}`, type: 'success' });
  };
 
  const handleResolveAlert = (alertId) => {
    console.log(`Resolving alert ${alertId}`);
    const resolvedAlert = activeAlerts.find(alert => alert.id === alertId);
    if (resolvedAlert) {
      setAlertHistory(prev => [
        {...resolvedAlert, status: "resolved", resolvedAt: new Date().toISOString()},
        ...prev
      ]);
      setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
    }
    showValidation({ title: 'Resolved', message: `Alert ${alertId} marked as resolved`, type: 'success' });
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setShowModal(true);
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

  const SeverityBadge = ({ severity }) => {
    let bgColor, textColor;
    switch(severity) {
      case "High":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      case "Medium":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        break;
      case "Low":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
    }
    
    return (
      <span className={`${bgColor} ${textColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
        {severity}
      </span>
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setLocationFilter('');
    setDateFilter('');
    setSeverityFilter('all');
    setTargetFilter('all');
    setSearchTerm('');
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || 
                           alert.locations.some(loc => 
                             loc.toLowerCase().includes(locationFilter.toLowerCase())
                           );
    
    const matchesDate = !dateFilter || alert.date === dateFilter;
    
    const matchesSeverity = severityFilter === 'all' || alert.priority === severityFilter;
    
    const matchesTarget = targetFilter === 'all' || alert.targetAudience === targetFilter;

    return matchesSearch && matchesLocation && matchesDate && matchesSeverity && matchesTarget;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-white">
        <h1 className="text-xl font-bold text-gray-900">Alerts & Emergency Management</h1>
        <p className="text-sm text-gray-500">Manage announcements and monitor emergency situations</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex px-6">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'alerts'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <i className="fas fa-bullhorn mr-2"></i>
            Alerts
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors relative ${
              activeTab === 'emergency'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Emergency Monitoring
            {activeTab === 'emergency' && activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeAlerts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* alerts Tab Content */}
      {activeTab === 'alerts' && (
        <div className="p-6">
          {/* Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              {/* Search Bar with Filter Icon */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                />
                
                {/* Filter Icon Button */}
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className={`h-full px-3 border-l border-gray-300 rounded-r-xl transition-colors ${
                      showFilterDropdown ? 'bg-cyan-50 text-cyan-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <i className="fas fa-filter"></i>
                  </button>
                </div>

                {/* Filter Dropdown */}
                {showFilterDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-10 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">Filter Alerts</h3>
                      <button
                        onClick={clearFilters}
                        className="text-sm text-cyan-600 hover:text-cyan-700"
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Location Filter */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          placeholder="Filter by location..."
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      </div>

                      {/* Date Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      </div>

                      {/* Severity Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Severity
                        </label>
                        <select
                          value={severityFilter}
                          onChange={(e) => setSeverityFilter(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                          <option value="all">All Severities</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>

                      {/* Target Audience Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Audience
                        </label>
                        <select
                          value={targetFilter}
                          onChange={(e) => setTargetFilter(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                          <option value="all">All Audiences</option>
                          <option value="all">Everyone</option>
                          <option value="travelers">Travelers Only</option>
                          <option value="guides">Tour Guides Only</option>
                        </select>
                      </div>
                    </div>

                    {/* Active Filters Display */}
                    {(locationFilter || dateFilter || severityFilter !== 'all' || targetFilter !== 'all') && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Active Filters:</p>
                        <div className="flex flex-wrap gap-1">
                          {locationFilter && (
                            <span className="inline-flex items-center px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                              Location: {locationFilter}
                              <button
                                onClick={() => setLocationFilter('')}
                                className="ml-1 text-cyan-600 hover:text-cyan-800"
                              >
                                ×
                              </button>
                            </span>
                          )}
                          {dateFilter && (
                            <span className="inline-flex items-center px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                              Date: {dateFilter}
                              <button
                                onClick={() => setDateFilter('')}
                                className="ml-1 text-cyan-600 hover:text-cyan-800"
                              >
                                ×
                              </button>
                            </span>
                          )}
                          {severityFilter !== 'all' && (
                            <span className="inline-flex items-center px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                              Severity: {severityFilter}
                              <button
                                onClick={() => setSeverityFilter('all')}
                                className="ml-1 text-cyan-600 hover:text-cyan-800"
                              >
                                ×
                              </button>
                            </span>
                          )}
                          {targetFilter !== 'all' && (
                            <span className="inline-flex items-center px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                              Target: {targetFilter === 'all' ? 'Everyone' : targetFilter === 'travelers' ? 'Travelers' : 'Guides'}
                              <button
                                onClick={() => setTargetFilter('all')}
                                className="ml-1 text-cyan-600 hover:text-cyan-800"
                              >
                                ×
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-cyan-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg flex items-center"
              >
                <i className="fas fa-plus mr-2"></i>New Alert
              </button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Alerts & Announcements</h2>
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
              <div className="divide-y divide-gray-200">
                {filteredAlerts.map(alert => (
                  <div key={alert.id} className="p-6 hover:bg-gray-50 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start">
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
                          <button
                            aria-label={`Edit alert ${alert.title}`}
                            onClick={(e) => { e.stopPropagation(); handleEditAlert(alert); }}
                            className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            aria-label={`Delete alert ${alert.title}`}
                            onClick={(e) => { e.stopPropagation(); handleDeleteAlert(alert.id); }}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
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
        </div>
      )}

      {/* Rest of the component remains the same */}
      {/* Emergency Monitoring Tab Content */}
      {activeTab === 'emergency' && (
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">Loading alerts...</div>
          ) : (
            <>
              {/* Active Alerts Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Active Emergency Alerts</h2>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {activeAlerts.length} Active
                  </span>
                </div>
                
                {activeAlerts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeAlerts.map(alert => (
                      <div key={alert.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-red-800">Emergency Alert #{alert.id}</h3>
                          <SeverityBadge severity={alert.severity} />
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-red-600 font-medium">User: </span>
                            {alert.userName}
                          </div>
                          <div>
                            <span className="text-red-600 font-medium">Type: </span>
                            {alert.type}
                          </div>
                          <div>
                            <span className="text-red-600 font-medium">Location: </span>
                            {alert.location}
                          </div>
                          <div>
                            <span className="text-red-600 font-medium">Time: </span>
                            {new Date(alert.timestamp).toLocaleString()}
                          </div>
                          {alert.servicesNotified && (
                            <div className="text-green-600">
                              <span className="font-medium">Services Notified: </span>
                              {new Date(alert.notifiedAt).toLocaleTimeString()}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex space-x-2">
                          <button 
                            className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 flex items-center"
                            onClick={() => handleNotifyServices(alert.id)}
                            disabled={alert.servicesNotified}
                          >
                            <span className="fas fa-bell mr-1"></span>
                            {alert.servicesNotified ? "Notified" : "Notify Services"}
                          </button>
                          <button 
                            className="bg-white text-red-600 border border-red-300 px-3 py-1 rounded-md text-sm hover:bg-red-50 flex items-center"
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            <span className="fas fa-check-circle mr-1"></span>
                            Mark Resolved
                          </button>
                          <button 
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-200 flex items-center"
                            onClick={() => handleViewDetails(alert)}
                          >
                            <span className="fas fa-info-circle mr-1"></span>
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <span className="fas fa-check-circle text-green-500 text-4xl mb-3"></span>
                    <p className="text-green-800 font-medium">No active emergency alerts</p>
                    <p className="text-green-600 text-sm mt-1">All users are safe</p>
                  </div>
                )}
              </div>

              {/* Alert History Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Alert History</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {alertHistory.map(alert => (
                        <tr key={alert.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{alert.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{alert.userName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{alert.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{alert.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(alert.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              alert.status === 'resolved' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {alert.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              onClick={() => handleViewDetails(alert)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {alertHistory.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg mt-4">
                    <span className="fas fa-history text-gray-400 text-3xl mb-3"></span>
                    <p className="text-gray-500">No alert history found</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* New Alert Modal */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Alert' : 'Send New Alert'}</h2>
          <button 
            onClick={() => closeModal()}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
              <select
                value={newAlert.severity}
                onChange={(e) => setNewAlert({...newAlert, severity: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="datetime-local"
                value={newAlert.startOn}
                onChange={(e) => setNewAlert({...newAlert, startOn: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                type="datetime-local"
                value={newAlert.endOn}
                onChange={(e) => setNewAlert({...newAlert, endOn: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <select
                value={newAlert.target}
                onChange={(e) => setNewAlert({...newAlert, target: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              >
                <option value="everyone">Everyone</option>
                <option value="traveler">Travelers Only</option>
                <option value="tourGuide">Tour Guides Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Locations *
                <span className="text-xs text-gray-500 ml-1">(Select from common locations or add custom)</span>
              </label>
              
              {/* Quick location buttons */}
              <div className="flex flex-wrap gap-2 mb-3">
                {['Manila', 'Cebu', 'Davao', 'Boracay', 'Palawan', 'Baguio', 'Cebu City', 'Quezon City', 'global', 'Philippines'].map(location => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => {
                      if (!newAlert.locations.includes(location)) {
                        setNewAlert({
                          ...newAlert,
                          locations: [...newAlert.locations, location]
                        });
                      }
                    }}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      newAlert.locations.includes(location)
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {location} +
                  </button>
                ))}
              </div>
              
              {/* Custom location input */}
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Type custom location and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      e.preventDefault();
                      const customLocation = e.target.value.trim();
                      if (!newAlert.locations.includes(customLocation)) {
                        setNewAlert({
                          ...newAlert,
                          locations: [...newAlert.locations, customLocation]
                        });
                      }
                      e.target.value = '';
                    }
                  }}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                />
              </div>
              
              {/* Selected locations display */}
              {newAlert.locations.length > 0 ? (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Selected locations ({newAlert.locations.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {newAlert.locations.map((location, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-cyan-100 text-cyan-800 text-sm rounded-full border border-cyan-200"
                      >
                        <i className="fas fa-map-marker-alt mr-1 text-xs"></i>
                        {location}
                        <button
                          type="button"
                          onClick={() => {
                            setNewAlert({
                              ...newAlert,
                              locations: newAlert.locations.filter((_, i) => i !== index)
                            });
                          }}
                          className="ml-2 text-cyan-600 hover:text-cyan-800 text-xs"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-700">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    Please select at least one location
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              placeholder="Enter your alert description here..."
              value={newAlert.description}
              onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
              rows="4"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => closeModal()}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSendAlert}
              disabled={!newAlert.title || !newAlert.description || newAlert.locations.length === 0}
              className="bg-gradient-to-r from-cyan-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
            >
              <i className="fas fa-paper-plane mr-2"></i>{isEditing ? 'Update Alert' : 'Send Alert'}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      {/* Alert Details Modal */}
      {showModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Alert Details</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alert ID</label>
                  <p className="text-gray-900">#{selectedAlert.id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                  <p className="text-gray-900">{selectedAlert.userName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <p className="text-gray-900">{selectedAlert.type}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900">{selectedAlert.location}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                  <p className="text-gray-900">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <p className="text-gray-900">{selectedAlert.status}</p>
                </div>
                
                {selectedAlert.servicesNotified && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Services Notified At</label>
                    <p className="text-gray-900">{new Date(selectedAlert.notifiedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Validation / Confirm Modal (used for validation messages and confirmations) */}
      {validationModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{validationModal.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{validationModal.message}</p>
              </div>
              <button onClick={closeValidation} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg"><i className="fas fa-times"></i></button>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              {validationModal.type === 'confirm' ? (
                <>
                  <button onClick={closeValidation} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Cancel</button>
                  <button onClick={() => { validationModal.onConfirm && validationModal.onConfirm(); }} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Confirm</button>
                </>
              ) : (
                <button onClick={closeValidation} className={`px-4 py-2 rounded-lg ${validationModal.type === 'success' ? 'bg-green-600 text-white' : validationModal.type === 'error' ? 'bg-red-600 text-white' : 'bg-cyan-600 text-white'}`}>
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegratedAlertsSystem;