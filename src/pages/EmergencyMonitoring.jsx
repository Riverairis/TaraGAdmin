import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmergencyMonitoring = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      // Example data - replace with actual API calls
      const exampleActiveAlerts = [
        {
          id: 1,
          userName: "Maria Santos",
          location: "Mount Pulag, Benguet",
          timestamp: "2024-01-15T08:30:00Z",
          severity: "High",
          type: "Medical Emergency",
          description: "User reported difficulty breathing at high altitude",
          contact: "+63 912 345 6789"
        },
        {
          id: 2,
          userName: "Juan Dela Cruz",
          location: "Taal Volcano, Batangas",
          timestamp: "2024-01-15T09:15:00Z",
          severity: "Medium",
          type: "Lost Tourist",
          description: "User separated from group during hike",
          contact: "+63 917 123 4567"
        }
      ];

      const exampleAlertHistory = [
        {
          id: 3,
          userName: "Anna Reyes",
          location: "Chocolate Hills, Bohol",
          timestamp: "2024-01-14T14:20:00Z",
          type: "Injury",
          status: "resolved",
          description: "Sprained ankle during hike",
          resolvedBy: "Admin Rodriguez",
          resolutionNotes: "Arranged transport to local clinic"
        },
        {
          id: 4,
          userName: "Carlos Garcia",
          location: "Mayon Volcano, Albay",
          timestamp: "2024-01-13T11:45:00Z",
          type: "Weather Emergency",
          status: "resolved",
          description: "Sudden heavy rainfall and lightning",
          resolvedBy: "Admin Lee",
          resolutionNotes: "Evacuated group to safe location"
        },
        {
          id: 5,
          userName: "Liza Mendoza",
          location: "Puerto Princesa Underground River",
          timestamp: "2024-01-12T16:30:00Z",
          type: "Equipment Failure",
          status: "pending",
          description: "Boat engine malfunction during tour",
          resolvedBy: "",
          resolutionNotes: ""
        }
      ];

      setActiveAlerts(exampleActiveAlerts);
      setAlertHistory(exampleAlertHistory);
      
      // Actual API calls (commented out for example)
      /*
      const [activeResponse, historyResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/alerts/active'),
        axios.get('http://localhost:8080/api/alerts/history')
      ]);
      
      setActiveAlerts(activeResponse.data);
      setAlertHistory(historyResponse.data);
      */
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyServices = (alertId) => {
    console.log(`Notifying services for alert ${alertId}`);
    // In a real application, this would trigger notifications to emergency services
    alert(`Emergency services notified for alert ${alertId}`);
    
    // Update UI to show notification was sent
    setActiveAlerts(alerts => 
      alerts.map(alert => 
        alert.id === alertId 
          ? {...alert, servicesNotified: true, notifiedAt: new Date().toISOString()} 
          : alert
      )
    );
  };

  const handleResolveAlert = (alertId) => {
    console.log(`Resolving alert ${alertId}`);
    // In a real application, this would update the alert status in the database
    const resolvedAlert = activeAlerts.find(alert => alert.id === alertId);
    if (resolvedAlert) {
      setAlertHistory(prev => [
        {...resolvedAlert, status: "resolved", resolvedAt: new Date().toISOString()},
        ...prev
      ]);
      setActiveAlerts(activeAlerts.filter(alert => alert.id !== alertId));
    }
    alert(`Alert ${alertId} marked as resolved`);
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setShowModal(true);
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading alerts...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-white">
        <h1 className="text-xl font-bold text-gray-900">Emergency Monitoring System</h1>
        <p className="text-sm text-gray-500">Monitor and respond to emergency alerts from users in real-time</p>
      </div>

      

      <div className="p-6">
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
      </div>

      {/* Alert Detail Modal */}
      {showModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Alert Details #{selectedAlert.id}</h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setShowModal(false)}
                >
                  <span className="fas fa-times"></span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">User Name</p>
                  <p className="mt-1">{selectedAlert.userName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Emergency Type</p>
                  <p className="mt-1">{selectedAlert.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="mt-1">{selectedAlert.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Severity</p>
                  <p className="mt-1"><SeverityBadge severity={selectedAlert.severity} /></p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Timestamp</p>
                  <p className="mt-1">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedAlert.status === 'resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedAlert.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedAlert.status || 'active'}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1 bg-gray-50 p-3 rounded-md">{selectedAlert.description || "No additional details provided"}</p>
              </div>
              {selectedAlert.contact && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Information</p>
                  <p className="mt-1">{selectedAlert.contact}</p>
                </div>
              )}
              {selectedAlert.resolvedBy && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Resolved By</p>
                  <p className="mt-1">{selectedAlert.resolvedBy}</p>
                </div>
              )}
              {selectedAlert.resolutionNotes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Resolution Notes</p>
                  <p className="mt-1 bg-green-50 p-3 rounded-md">{selectedAlert.resolutionNotes}</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                className="bg-cyan-600 text-white px-4 py-2 rounded-md text-sm hover:bg-cyan-700"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyMonitoring;