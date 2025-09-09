import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TourAgencyList = () => {
  const [activeTab, setActiveTab] = useState('agencies');
  const [agencies, setAgencies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showAgencyModal, setShowAgencyModal] = useState(false);

  useEffect(() => {
    if (activeTab === 'agencies') {
      fetchAgencies();
    } else if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab]);

  const fetchAgencies = async () => {
    try {
      const exampleAgencies = [
        {
          id: 1,
          name: "Island Paradise Tours",
          contact: "Maria Santos",
          email: "maria@islandparadise.com",
          phone: "+63 912 345 6789",
          address: "123 Beach Road, Boracay, Philippines",
          status: "active",
          accreditation: "DOT-ACCR-2023-001",
          joinDate: "2023-05-15",
          toursCount: 24,
          rating: 4.8,
          description: "Specializing in island hopping tours and water activities in the beautiful islands of the Philippines.",
          services: ["Island Hopping", "Snorkeling", "Scuba Diving", "Sunset Cruises"],
          socialMedia: {
            facebook: "https://facebook.com/islandparadise",
            instagram: "https://instagram.com/islandparadise"
          }
        },
        {
          id: 2,
          name: "Mountain Trek Adventures",
          contact: "Carlos Reyes",
          email: "carlos@mountaintrek.com",
          phone: "+63 917 890 1234",
          address: "456 Mountain View, Baguio City, Philippines",
          status: "active",
          accreditation: "DOT-ACCR-2023-045",
          joinDate: "2023-07-22",
          toursCount: 18,
          rating: 4.9,
          description: "Expert guides for mountain climbing, hiking, and adventure tours across the Philippine mountains.",
          services: ["Mountain Climbing", "Hiking", "Camping", "Nature Walks"],
          socialMedia: {
            facebook: "https://facebook.com/mountaintrek",
            instagram: "https://instagram.com/mountaintrek"
          }
        },
        {
          id: 3,
          name: "Heritage Cultural Tours",
          contact: "Anna Lopez",
          email: "anna@heritagetours.com",
          phone: "+63 918 765 4321",
          address: "789 Heritage Street, Vigan City, Philippines",
          status: "pending",
          accreditation: "DOT-ACCR-2023-078",
          joinDate: "2023-10-05",
          toursCount: 12,
          rating: 4.7,
          description: "Immerse in Philippine culture and history with our expert-guided heritage tours.",
          services: ["Cultural Tours", "Historical Sites", "Museum Tours", "Local Experiences"],
          socialMedia: {
            facebook: "https://facebook.com/heritagetours",
            instagram: "https://instagram.com/heritagetours"
          }
        }
      ];

      setAgencies(exampleAgencies);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const exampleApplications = [
        {
          id: 1,
          agencyName: "Sunset Travel Co.",
          contactPerson: "Roberto Garcia",
          email: "roberto@sunsettravel.com",
          phone: "+63 920 123 4567",
          address: "321 Sunset Boulevard, Puerto Princesa, Palawan",
          appliedDate: "2024-01-10",
          status: "pending",
          accreditationFile: "sunset_travel_dot_cert.pdf",
          businessPermit: "sunset_business_permit.pdf",
          description: "We offer sunset watching tours and romantic getaways in the beautiful islands of Palawan."
        },
        {
          id: 2,
          agencyName: "Wilderness Explorers",
          contactPerson: "Sofia Mendoza",
          email: "sofia@wilderness.com",
          phone: "+63 921 987 6543",
          address: "654 Adventure Road, Davao City, Philippines",
          appliedDate: "2024-01-08",
          status: "under_review",
          accreditationFile: "wilderness_documents.zip",
          businessPermit: "wilderness_permit.pdf",
          description: "Specializing in wildlife tours and jungle adventures in Mindanao's pristine forests."
        },
      ];

      setApplications(exampleApplications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const handleViewAgency = (agency) => {
    setSelectedAgency(agency);
    setShowAgencyModal(true);
  };

  const handleStatusChange = async (agencyId, newStatus) => {
    try {
      console.log(`Changing status of agency ${agencyId} to ${newStatus}`);
      // API call to update agency status
      // await axios.patch(`http://localhost:8080/api/agencies/${agencyId}/status`, { status: newStatus });
      alert(`Agency status updated to ${newStatus}`);
      fetchAgencies(); // Refresh the list
    } catch (error) {
      console.error('Error updating agency status:', error);
      alert('Error updating agency status.');
    }
  };

  const handleApplicationReview = async (applicationId, action) => {
    try {
      console.log(`${action} application ${applicationId}`);
      // API call to review application
      // await axios.post(`http://localhost:8080/api/agency-applications/${applicationId}/review`, { action });
      alert(`Application ${action === 'approve' ? 'approved' : 'rejected'}`);
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      alert(`Error ${action}ing application.`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tour Agencies</h1>
            <p className="text-sm text-gray-500">Manage partner tour agencies and applications</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 font-medium text-sm border-b-2 transition-all ${
              activeTab === 'agencies'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('agencies')}
          >
            Agencies
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm border-b-2 transition-all ${
              activeTab === 'applications'
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('applications')}
          >
            Applications
          </button>
        </div>

        {/* Agencies Tab */}
        {activeTab === 'agencies' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Partner Agencies</h2>
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search agencies..."
                  className="block w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencies.map(agency => (
                <div key={agency.id} className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all overflow-hidden cursor-pointer" onClick={() => handleViewAgency(agency)}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{agency.name}</h3>
                        <p className="text-sm text-gray-500">{agency.contact}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        agency.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : agency.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {agency.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {agency.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {agency.accreditation}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Joined {new Date(agency.joinDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {agency.toursCount} tours
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Rating: {agency.rating}/5
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {agency.status !== 'active' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(agency.id, 'active');
                          }}
                          className="flex-1 px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
                        >
                          Activate
                        </button>
                      )}
                      {agency.status !== 'suspended' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(agency.id, 'suspended');
                          }}
                          className="flex-1 px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewAgency(agency);
                        }}
                        className="px-3 py-2 bg-cyan-100 text-cyan-600 text-sm font-medium rounded-lg hover:bg-cyan-200 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {agencies.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg mt-4">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="mt-4 text-gray-500">No agencies found</p>
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Agency Applications</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map(application => (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.agencyName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{application.contactPerson}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{application.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : application.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : application.status === 'under_review'
                            ? 'bg-cyan-100 text-cyan-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {application.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {application.status === 'pending' || application.status === 'under_review' ? (
                          <>
                            <button 
                              onClick={() => handleApplicationReview(application.id, 'approve')}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleApplicationReview(application.id, 'reject')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button className="text-cyan-600 hover:text-cyan-700">View</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {applications.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg mt-4">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 text-gray-500">No applications found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Agency Details Modal */}
      {showAgencyModal && selectedAgency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Agency Details</h3>
              <button 
                onClick={() => setShowAgencyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedAgency.name}</h4>
                  <div className="flex items-center mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedAgency.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedAgency.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedAgency.status}
                    </span>
                    <div className="flex items-center ml-4 text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {selectedAgency.rating}/5
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{selectedAgency.description}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">Quick Actions</h5>
                  <div className="space-y-2">
                    {selectedAgency.status !== 'active' && (
                      <button
                        onClick={() => handleStatusChange(selectedAgency.id, 'active')}
                        className="w-full px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
                      >
                        Activate Agency
                      </button>
                    )}
                    {selectedAgency.status !== 'suspended' && (
                      <button
                        onClick={() => handleStatusChange(selectedAgency.id, 'suspended')}
                        className="w-full px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Suspend Agency
                      </button>
                    )}
                    <button className="w-full px-3 py-2 bg-blue-100 text-cyan-600 text-sm font-medium rounded-lg hover:bg-cyan-200 transition-colors">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {selectedAgency.contact}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {selectedAgency.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {selectedAgency.phone}
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedAgency.address}
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Business Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Accreditation: {selectedAgency.accreditation}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Joined: {new Date(selectedAgency.joinDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedAgency.toursCount} tours created
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 mb-3">Services Offered</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedAgency.services.map((service, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 mb-3">Social Media</h5>
                <div className="flex space-x-4">
                  {selectedAgency.socialMedia.facebook && (
                    <a href={selectedAgency.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                  {selectedAgency.socialMedia.instagram && (
                    <a href={selectedAgency.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowAgencyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourAgencyList;