import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmergencyMonitoring = () => {
  const [safetyLogs, setSafetyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states matching alerts design
  const [searchTerm, setSearchTerm] = useState('');
  const [emergencyTypeFilter, setEmergencyTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Validation modal state
  const [validationModal, setValidationModal] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
  });

  const showValidation = ({ title = '', message = '', type = 'info', onConfirm = null }) => {
    setValidationModal({ open: true, title, message, type, onConfirm });
  };

  const closeValidation = () => setValidationModal({ open: false, title: '', message: '', type: 'info', onConfirm: null });

  // API base configuration
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    ? String(import.meta.env.VITE_API_BASE).replace(/\/$/, '')
    : '';

  const fetchSafetyLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || sessionStorage.getItem('accessToken') || 'demo-token';
      
      const queryParams = new URLSearchParams();
      
      // Apply filters
      if (searchTerm) queryParams.append('search', searchTerm);
      if (emergencyTypeFilter !== 'all') queryParams.append('emergencyType', emergencyTypeFilter);
      if (statusFilter !== 'all') queryParams.append('isResolved', statusFilter === 'resolved');
      if (dateFilter) queryParams.append('startDate', dateFilter);

      const baseUrl = API_BASE ? `${API_BASE}/safety/get-filtered-logs` : '/api/safety/get-filtered-logs';
      const url = `${baseUrl}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setSafetyLogs(data);
    } catch (err) {
      console.error('Error fetching safety logs:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch safety logs');
      showValidation({
        title: 'Error',
        message: 'Failed to fetch safety logs. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSafetyLog = async (logId) => {
    showValidation({
      title: 'Delete Safety Log',
      message: 'Are you sure you want to delete this safety log?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || sessionStorage.getItem('accessToken') || 'demo-token';
          const baseUrl = API_BASE ? `${API_BASE}/safety/delete-log` : '/api/safety/delete-log';

          const response = await fetch(baseUrl, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ logID: logId })
          });

          if (!response.ok) {
            throw new Error(`Delete failed: ${response.status}`);
          }

          await fetchSafetyLogs();
          showValidation({
            title: 'Success',
            message: 'Safety log deleted successfully',
            type: 'success'
          });
        } catch (err) {
          console.error('Error deleting safety log:', err);
          showValidation({
            title: 'Error',
            message: 'Failed to delete safety log',
            type: 'error'
          });
        }
      }
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (log) => {
    const isResolved = log.endedOn !== null && log.endedOn !== undefined;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${
        isResolved 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}>
        <i className={`fas ${isResolved ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-1 text-xs`}></i>
        {isResolved ? 'Resolved' : 'Active'}
      </span>
    );
  };

  const getEmergencyTypeBadge = (type) => {
    const typeConfig = {
      'medical': { 
        class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: 'fa-heartbeat'
      },
      'accident': { 
        class: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        icon: 'fa-car-crash'
      },
      'security': { 
        class: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        icon: 'fa-shield-alt'
      },
      'weather': { 
        class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        icon: 'fa-cloud-showers-heavy'
      },
      'other': { 
        class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        icon: 'fa-exclamation-triangle'
      }
    };
    
    const config = typeConfig[type?.toLowerCase()] || typeConfig.other;
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${config.class}`}>
        <i className={`fas ${config.icon} mr-1 text-xs`}></i>
        {type || 'Other'}
      </span>
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setEmergencyTypeFilter('all');
    setStatusFilter('all');
    setDateFilter('');
  };

  const activeFiltersCount = [
    searchTerm,
    emergencyTypeFilter !== 'all',
    statusFilter !== 'all',
    dateFilter
  ].filter(Boolean).length;

  useEffect(() => {
    fetchSafetyLogs();
  }, []);

  const filteredLogs = safetyLogs.filter(log => {
    const matchesSearch = !searchTerm || 
      (log.userData?.fname + ' ' + log.userData?.lname).toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userData?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.emergencyType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userLocation?.locationName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = emergencyTypeFilter === 'all' || log.emergencyType?.toLowerCase() === emergencyTypeFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && !log.endedOn) ||
      (statusFilter === 'resolved' && log.endedOn);

    const matchesDate = !dateFilter || 
      (log.startedOn && new Date(log.startedOn).toISOString().split('T')[0] === dateFilter);

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Emergency Monitoring</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage safety logs and emergency situations</p>
        </div>

        {/* Search and Filter - shifted above and simplified (refresh removed) */}
        <div className="px-4 pt-2 -mt-2 mb-6">
          <div className="flex items-center gap-3 justify-end">
            <div className="relative w-full lg:w-1/3 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400 text-sm"></i>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, type, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${
                      showFilterDropdown || activeFiltersCount > 0
                        ? 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300 border border-red-200 dark:border-red-700'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    aria-label="Filter safety logs"
                  >
                    <i className="fas fa-filter text-sm"></i>
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20 p-4 max-h-[80vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Filter Safety Logs</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={clearFilters}
                            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                          >
                            Clear All
                          </button>
                          <button
                            onClick={() => setShowFilterDropdown(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                            aria-label="Close filters"
                          >
                            <i className="fas fa-times text-sm"></i>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                            Emergency Type
                          </label>
                          <select
                            value={emergencyTypeFilter}
                            onChange={(e) => setEmergencyTypeFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="all">All Types</option>
                            <option value="medical">Medical</option>
                            <option value="accident">Accident</option>
                            <option value="security">Security</option>
                            <option value="weather">Weather</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                            Status
                          </label>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                            Date
                          </label>
                          <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      {activeFiltersCount > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Active Filters:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {searchTerm && (
                              <span className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full border border-red-200 dark:border-red-700">
                                Search: {searchTerm}
                                <button
                                  onClick={() => setSearchTerm('')}
                                  className="ml-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-xs"
                                >
                                  ×
                                </button>
                              </span>
                            )}
                            {emergencyTypeFilter !== 'all' && (
                              <span className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full border border-red-200 dark:border-red-700">
                                Type: {emergencyTypeFilter}
                                <button
                                  onClick={() => setEmergencyTypeFilter('all')}
                                  className="ml-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-xs"
                                >
                                  ×
                                </button>
                              </span>
                            )}
                            {statusFilter !== 'all' && (
                              <span className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full border border-red-200 dark:border-red-700">
                                Status: {statusFilter}
                                <button
                                  onClick={() => setStatusFilter('all')}
                                  className="ml-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-xs"
                                >
                                  ×
                                </button>
                              </span>
                            )}
                            {dateFilter && (
                              <span className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full border border-red-200 dark:border-red-700">
                                Date: {dateFilter}
                                <button
                                  onClick={() => setDateFilter('')}
                                  className="ml-1.5 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-xs"
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
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Safety Logs Table - Keeping Emergency file table structure */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading safety logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No safety logs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Emergency Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {log.userData?.fname} {log.userData?.lname}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {log.userData?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getEmergencyTypeBadge(log.emergencyType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {log.userLocation?.locationName || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {log.userLocation?.latitude}, {log.userLocation?.longitude}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(log.startedOn)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(log)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedLog(log);
                              setShowModal(true);
                            }}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            <i className="fas fa-eye text-sm"></i>
                            <span className="sr-only">View</span>
                          </button>
                          <button
                            onClick={() => deleteSafetyLog(log.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            <i className="fas fa-trash text-sm"></i>
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showModal && selectedLog && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="mt-3">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Safety Log Details</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {getEmergencyTypeBadge(selectedLog.emergencyType)}
                      {getStatusBadge(selectedLog)}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Close details"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Quick Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">User</p>
                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                        {selectedLog.userData?.fname} {selectedLog.userData?.mname} {selectedLog.userData?.lname}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedLog.userData?.email}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Timeline</p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white"><span className="font-medium">Started:</span> {formatDate(selectedLog.startedOn)}</p>
                      <p className="text-sm text-gray-900 dark:text-white"><span className="font-medium">Ended:</span> {selectedLog.endedOn ? formatDate(selectedLog.endedOn) : 'Still active'}</p>
                    </div>
                  </div>

                  {/* Detailed Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <i className="fas fa-user-shield text-gray-500"></i>
                        User Information
                      </h4>
                      <div className="text-sm space-y-1 text-gray-900 dark:text-white">
                        <p><span className="text-gray-600 dark:text-gray-300">Username:</span> {selectedLog.userData?.username}</p>
                        <p><span className="text-gray-600 dark:text-gray-300">Contact:</span> {selectedLog.userData?.contactNumber}</p>
                        <p><span className="text-gray-600 dark:text-gray-300">Type:</span> {selectedLog.userData?.type}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <i className="fas fa-map-marker-alt text-gray-500"></i>
                        Location
                      </h4>
                      <div className="text-sm space-y-1 text-gray-900 dark:text-white">
                        <p><span className="text-gray-600 dark:text-gray-300">Location Name:</span> {selectedLog.userLocation?.locationName}</p>
                        <p><span className="text-gray-600 dark:text-gray-300">Coordinates:</span> {selectedLog.userLocation?.latitude}, {selectedLog.userLocation?.longitude}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg md:col-span-2">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <i className="fas fa-info-circle text-gray-500"></i>
                        Emergency Details
                      </h4>
                      <div className="text-sm space-y-2 text-gray-900 dark:text-white">
                        <p><span className="text-gray-600 dark:text-gray-300">Type:</span> {selectedLog.emergencyType}</p>
                        <p><span className="text-gray-600 dark:text-gray-300">Message:</span> {selectedLog.message || 'No message provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    <i className="fas fa-times"></i>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Validation Modal */}
      {validationModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{validationModal.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{validationModal.message}</p>
              </div>
              <button onClick={closeValidation} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              {validationModal.type === 'confirm' ? (
                <>
                  <button onClick={closeValidation} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    Cancel
                  </button>
                  <button 
                    onClick={() => { 
                      validationModal.onConfirm && validationModal.onConfirm(); 
                      closeValidation();
                    }} 
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button onClick={closeValidation} className={`px-4 py-2 rounded-lg ${
                  validationModal.type === 'success' ? 'bg-green-600 text-white' : 
                  validationModal.type === 'error' ? 'bg-red-600 text-white' : 
                  'bg-red-600 text-white'
                }`}>
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

export default EmergencyMonitoring;