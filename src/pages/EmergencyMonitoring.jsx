import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmergencyMonitoring = () => {
  const [safetyLogs, setSafetyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    emergencyType: '',
    startDate: '',
    endDate: '',
    isResolved: '',
    isPending: '',
    search: ''
  });
  
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchSafetyLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await axios.get(
        `http://localhost:5000/api/safety/get-filtered-logs?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSafetyLogs(response.data);
    } catch (err) {
      console.error('Error fetching safety logs:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch safety logs');
    } finally {
      setLoading(false);
    }
  };

  const deleteSafetyLog = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this safety log?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(
        'http://localhost:5000/api/safety/delete-log',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: { logID: logId }
        }
      );
      
      await fetchSafetyLogs();
    } catch (err) {
      console.error('Error deleting safety log:', err);
      setError(err.response?.data?.message || 'Failed to delete safety log');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusBadge = (log) => {
    const isResolved = log.endedOn !== null && log.endedOn !== undefined;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isResolved 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}>
        {isResolved ? 'Resolved' : 'Active'}
      </span>
    );
  };

  const getEmergencyTypeBadge = (type) => {
    const colors = {
      'medical': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'accident': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'security': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'weather': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'other': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[type.toLowerCase()] || colors.other
      }`}>
        {type}
      </span>
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      emergencyType: '',
      startDate: '',
      endDate: '',
      isResolved: '',
      isPending: '',
      search: ''
    });
  };

  useEffect(() => {
    fetchSafetyLogs();
  }, [filters]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Emergency Monitoring</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage safety logs and emergency situations</p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search safety logs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors text-gray-700 dark:text-gray-300"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Refresh */}
            <button
              onClick={fetchSafetyLogs}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-medium transition-colors"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Emergency Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Emergency Type
                  </label>
                  <select
                    value={filters.emergencyType}
                    onChange={(e) => handleFilterChange('emergencyType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Types</option>
                    <option value="medical">Medical</option>
                    <option value="accident">Accident</option>
                    <option value="security">Security</option>
                    <option value="weather">Weather</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.isResolved}
                    onChange={(e) => handleFilterChange('isResolved', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Status</option>
                    <option value="true">Resolved</option>
                    <option value="false">Active</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
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

        {/* Safety Logs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading safety logs...</p>
            </div>
          ) : safetyLogs.length === 0 ? (
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
                  {safetyLogs.map((log) => (
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
                            View
                          </button>
                          <button
                            onClick={() => deleteSafetyLog(log.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            Delete
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Safety Log Details
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* User Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">User Information</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                      <p className="text-gray-900 dark:text-white"><strong>Name:</strong> {selectedLog.userData?.fname} {selectedLog.userData?.mname} {selectedLog.userData?.lname}</p>
                      <p className="text-gray-900 dark:text-white"><strong>Username:</strong> {selectedLog.userData?.username}</p>
                      <p className="text-gray-900 dark:text-white"><strong>Email:</strong> {selectedLog.userData?.email}</p>
                      <p className="text-gray-900 dark:text-white"><strong>Contact:</strong> {selectedLog.userData?.contactNumber}</p>
                      <p className="text-gray-900 dark:text-white"><strong>Type:</strong> {selectedLog.userData?.type}</p>
                    </div>
                  </div>

                  {/* Emergency Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Emergency Details</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                      <p className="text-gray-900 dark:text-white"><strong>Type:</strong> {selectedLog.emergencyType}</p>
                      <p className="text-gray-900 dark:text-white"><strong>Message:</strong> {selectedLog.message || 'No message provided'}</p>
                      <p className="text-gray-900 dark:text-white"><strong>Started:</strong> {formatDate(selectedLog.startedOn)}</p>
                      <p className="text-gray-900 dark:text-white"><strong>Ended:</strong> {selectedLog.endedOn ? formatDate(selectedLog.endedOn) : 'Still active'}</p>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Location Information</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                      <p className="text-gray-900 dark:text-white"><strong>Location Name:</strong> {selectedLog.userLocation?.locationName}</p>
                      <p className="text-gray-900 dark:text-white"><strong>Coordinates:</strong> {selectedLog.userLocation?.latitude}, {selectedLog.userLocation?.longitude}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyMonitoring;