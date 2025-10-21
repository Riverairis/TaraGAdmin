import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { logAgencyStatusChanged, logAgencyApplicationReviewed } from '../utils/adminActivityLogger';

const TourAgencyList = () => {
  const [activeTab, setActiveTab] = useState('agencies');
  const [agencies, setAgencies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Filter states matching alerts design
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

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
          name: "Paradise Agency",
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
          name: "Vansol Travel & Tours",
          contact: "Carlos Reyes",
          email: "carlos@travelandtours.com",
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
          name: "Heritage Agency",
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
          taxIdNumber: "123-456-789-000",
          description: "We offer sunset watching tours and romantic getaways in the beautiful islands of Palawan.",
          services: ["Sunset Tours", "Romantic Getaways", "Island Hopping"],
          yearsInBusiness: 3,
          employeeCount: 12,
          annualRevenue: "₱5,000,000",
          documents: [
            { name: "DOT Accreditation Certificate", file: "sunset_travel_dot_cert.pdf", uploaded: "2024-01-08" },
            { name: "Business Permit", file: "sunset_business_permit.pdf", uploaded: "2024-01-08" },
            { name: "Mayor's Permit", file: "sunset_mayors_permit.pdf", uploaded: "2024-01-08" },
            { name: "BIR Registration", file: "sunset_bir_registration.pdf", uploaded: "2024-01-08" }
          ]
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
          taxIdNumber: "987-654-321-000",
          description: "Specializing in wildlife tours and jungle adventures in Mindanao's pristine forests.",
          services: ["Wildlife Tours", "Jungle Adventures", "Eco-Tourism"],
          yearsInBusiness: 5,
          employeeCount: 8,
          annualRevenue: "₱3,500,000",
          documents: [
            { name: "DOT Accreditation Certificate", file: "wilderness_dot_cert.pdf", uploaded: "2024-01-05" },
            { name: "Business Permit", file: "wilderness_business_permit.pdf", uploaded: "2024-01-05" },
            { name: "Environmental Compliance Certificate", file: "wilderness_ecc.pdf", uploaded: "2024-01-05" },
            { name: "Insurance Certificate", file: "wilderness_insurance.pdf", uploaded: "2024-01-05" }
          ]
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

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const handleStatusChange = async (agencyId, newStatus) => {
    try {
      console.log(`Changing status of agency ${agencyId} to ${newStatus}`);
      // API call to update agency status
      // await axios.patch(`http://localhost:8080/api/agencies/${agencyId}/status`, { status: newStatus });
      
      // Log the status change
      const agency = agencies.find(a => a.id === agencyId);
      await logAgencyStatusChanged(agencyId, agency?.name || 'Unknown Agency', newStatus);
      
      showValidation({
        title: 'Status Updated',
        message: `Agency status updated to ${newStatus}`,
        type: 'success'
      });
      fetchAgencies(); // Refresh the list
    } catch (error) {
      console.error('Error updating agency status:', error);
      showValidation({
        title: 'Error',
        message: 'Error updating agency status.',
        type: 'error'
      });
    }
  };

  const handleApplicationReview = async (applicationId, action) => {
    try {
      console.log(`${action} application ${applicationId}`);
      // API call to review application
      // await axios.post(`http://localhost:8080/api/agency-applications/${applicationId}/review`, { action });
      
      // Log the application review
      const application = applications.find(a => a.id === applicationId);
      await logAgencyApplicationReviewed(applicationId, application?.agencyName || 'Unknown Agency', action);
      
      showValidation({
        title: 'Application Updated',
        message: `Application ${action === 'approve' ? 'approved' : 'rejected'}`,
        type: 'success'
      });
      fetchApplications(); // Refresh the list
      setShowApplicationModal(false); // Close modal after action
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      showValidation({
        title: 'Error',
        message: `Error ${action}ing application.`,
        type: 'error'
      });
    }
  };

  const handleDownloadDocument = (fileName) => {
    // Simulate document download
    console.log(`Downloading document: ${fileName}`);
    showValidation({
      title: 'Download Started',
      message: `Downloading ${fileName}...`,
      type: 'info'
    });
    // In a real application, this would trigger an actual file download
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('');
  };

  const activeFiltersCount = [
    searchTerm,
    statusFilter !== 'all',
    dateFilter
  ].filter(Boolean).length;

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = !searchTerm || 
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || agency.status === statusFilter;

    const matchesDate = !dateFilter || agency.joinDate === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const filteredApplications = applications.filter(application => {
    const matchesSearch = !searchTerm || 
      application.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;

    const matchesDate = !dateFilter || application.appliedDate === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-gray-900 dark:text-gray-100">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header - Updated to match EmergencyMonitoring design */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Travel Agencies</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage partner tour agencies and applications</p>
        </div>

        {/* Main Container - Updated to match EmergencyMonitoring design */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Tab Navigation - Updated styling */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex px-6">
              <button
                onClick={() => setActiveTab('agencies')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'agencies'
                    ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Agency
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'applications'
                    ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Applications
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Controls - Updated to match EmergencyMonitoring design */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                
                {/* Search and Filter Section - EmergencyMonitoring Style */}
                <div className="flex items-center gap-3 flex-1 lg:justify-end">
                  {/* Search Bar with integrated Filter */}
                  <div className="relative flex-1 lg:flex-initial lg:min-w-[300px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-search text-gray-400 text-sm"></i>
                    </div>
                    <input
                      type="text"
                      placeholder={`Search ${activeTab === 'agencies' ? 'agencies' : 'applications'}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-10 w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    
                    {/* Filter Icon inside Search Bar */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="relative">
                        <button
                          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            showFilterDropdown || activeFiltersCount > 0
                              ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700'
                              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          <i className="fas fa-filter text-sm"></i>
                          {activeFiltersCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                              {activeFiltersCount}
                            </span>
                          )}
                        </button>

                        {/* Filter Dropdown - EmergencyMonitoring Style */}
                        {showFilterDropdown && (
                          <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20 p-4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Filter {activeTab === 'agencies' ? 'Agencies' : 'Applications'}</h3>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={clearFilters}
                                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium"
                                >
                                  Clear All
                                </button>
                                <button
                                  onClick={() => setShowFilterDropdown(false)}
                                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                                >
                                  <i className="fas fa-times text-sm"></i>
                                </button>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              {/* Status Filter */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                  Status
                                </label>
                                <select
                                  value={statusFilter}
                                  onChange={(e) => setStatusFilter(e.target.value)}
                                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                  <option value="all">All Status</option>
                                  <option value="active">Active</option>
                                  <option value="pending">Pending</option>
                                  <option value="suspended">Suspended</option>
                                  {activeTab === 'applications' && (
                                    <option value="under_review">Under Review</option>
                                  )}
                                </select>
                              </div>

                              {/* Date Filter */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                  {activeTab === 'agencies' ? 'Join Date' : 'Applied Date'}
                                </label>
                                <input
                                  type="date"
                                  value={dateFilter}
                                  onChange={(e) => setDateFilter(e.target.value)}
                                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                              </div>
                            </div>

                            {/* Active Filters Display */}
                            {activeFiltersCount > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Active Filters:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {searchTerm && (
                                    <span className="inline-flex items-center px-2 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 text-xs rounded-full border border-cyan-200 dark:border-cyan-700">
                                      Search: {searchTerm}
                                      <button
                                        onClick={() => setSearchTerm('')}
                                        className="ml-1.5 text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-200 text-xs"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  )}
                                  {statusFilter !== 'all' && (
                                    <span className="inline-flex items-center px-2 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 text-xs rounded-full border border-cyan-200 dark:border-cyan-700">
                                      Status: {statusFilter}
                                      <button
                                        onClick={() => setStatusFilter('all')}
                                        className="ml-1.5 text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-200 text-xs"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  )}
                                  {dateFilter && (
                                    <span className="inline-flex items-center px-2 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 text-xs rounded-full border border-cyan-200 dark:border-cyan-700">
                                      Date: {dateFilter}
                                      <button
                                        onClick={() => setDateFilter('')}
                                        className="ml-1.5 text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-200 text-xs"
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

                  {/* Refresh Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={activeTab === 'agencies' ? fetchAgencies : fetchApplications}
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium text-sm w-full justify-center lg:w-auto"
                    >
                      <i className="fas fa-sync-alt"></i>
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Agencies Tab - KEEPING ORIGINAL AGENCIES DESIGN */}
            {activeTab === 'agencies' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAgencies.map(agency => (
                    <div key={agency.id} className="bg-white dark:bg-gray-700 rounded-xl shadow-md border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-all overflow-hidden cursor-pointer" onClick={() => handleViewAgency(agency)}>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{agency.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{agency.contact}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            agency.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : agency.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {agency.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {agency.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {agency.accreditation}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Joined {new Date(agency.joinDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {agency.toursCount} tours
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
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
                              className="flex-1 px-3 py-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-sm font-medium rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
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
                              className="flex-1 px-3 py-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                            >
                              Suspend
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewAgency(agency);
                            }}
                            className="px-3 py-2 bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-200 text-sm font-medium rounded-lg hover:bg-cyan-200 dark:hover:bg-cyan-800 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredAgencies.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg mt-4">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">No agencies found</p>
                  </div>
                )}
              </div>
            )}

            {/* Applications Tab - KEEPING ORIGINAL APPLICATIONS DESIGN */}
            {activeTab === 'applications' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Agency Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact Person</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Applied Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredApplications.map(application => (
                        <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => handleViewApplication(application)}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{application.agencyName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{application.contactPerson}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{application.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              application.status === 'approved' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : application.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : application.status === 'under_review'
                                ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {application.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {application.status === 'pending' || application.status === 'under_review' ? (
                              <>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApplicationReview(application.id, 'approve');
                                  }}
                                  className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApplicationReview(application.id, 'reject');
                                  }}
                                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewApplication(application);
                                }}
                                className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                              >
                                View
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredApplications.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg mt-4">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">No applications found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KEEP ALL ORIGINAL MODALS EXACTLY AS THEY WERE */}

      {/* Agency Details Modal - EXACTLY ORIGINAL */}
      {showAgencyModal && selectedAgency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Agency Details</h3>
              <button 
                onClick={() => setShowAgencyModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedAgency.name}</h4>
                  <div className="flex items-center mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedAgency.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : selectedAgency.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {selectedAgency.status}
                    </span>
                    <div className="flex items-center ml-4 text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {selectedAgency.rating}/5
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedAgency.description}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h5>
                  <div className="space-y-2">
                    {selectedAgency.status !== 'active' && (
                      <button
                        onClick={() => handleStatusChange(selectedAgency.id, 'active')}
                        className="w-full px-3 py-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-sm font-medium rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                      >
                        Activate Agency
                      </button>
                    )}
                    {selectedAgency.status !== 'suspended' && (
                      <button
                        onClick={() => handleStatusChange(selectedAgency.id, 'suspended')}
                        className="w-full px-3 py-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      >
                        Suspend Agency
                      </button>
                    )}
                    <button className="w-full px-3 py-2 bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-200 text-sm font-medium rounded-lg hover:bg-cyan-200 dark:hover:bg-cyan-800 transition-colors">
                      Send Message
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {selectedAgency.contact}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {selectedAgency.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {selectedAgency.phone}
                    </div>
                    <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedAgency.address}
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Business Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Accreditation: {selectedAgency.accreditation}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Joined: {new Date(selectedAgency.joinDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedAgency.toursCount} active tours
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Services Offered</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedAgency.services.map((service, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Social Media</h5>
                <div className="flex space-x-4">
                  {selectedAgency.socialMedia?.facebook && (
                    <a href={selectedAgency.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" aria-label="Facebook">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                  {selectedAgency.socialMedia?.instagram && (
                    <a href={selectedAgency.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400" aria-label="Instagram">
                      <i className="fab fa-instagram text-[20px]"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Details Modal - EXACTLY ORIGINAL */}
      {showApplicationModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application Details</h3>
              <button 
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedApplication.agencyName}</h4>
                  <div className="flex items-center mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedApplication.status === 'approved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : selectedApplication.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : selectedApplication.status === 'under_review'
                        ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {selectedApplication.status.replace('_', ' ')}
                    </span>
                    <div className="flex items-center ml-4 text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Applied {new Date(selectedApplication.appliedDate).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedApplication.description}</p>
                </div>
                {(selectedApplication.status === 'pending' || selectedApplication.status === 'under_review') && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Review Application</h5>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleApplicationReview(selectedApplication.id, 'approve')}
                        className="w-full px-3 py-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-sm font-medium rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                      >
                        Approve Application
                      </button>
                      <button
                        onClick={() => handleApplicationReview(selectedApplication.id, 'reject')}
                        className="w-full px-3 py-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      >
                        Reject Application
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {selectedApplication.contactPerson}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {selectedApplication.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {selectedApplication.phone}
                    </div>
                    <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedApplication.address}
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Business Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      TIN: {selectedApplication.taxIdNumber}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {selectedApplication.yearsInBusiness} years in business
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {selectedApplication.employeeCount} employees
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Annual Revenue: {selectedApplication.annualRevenue}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Services Offered</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.services.map((service, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Submitted Documents</h5>
                <div className="space-y-3">
                  {selectedApplication.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded {new Date(doc.uploaded).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadDocument(doc.file)}
                        className="px-3 py-1 text-sm bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-200 rounded-lg hover:bg-cyan-200 dark:hover:bg-cyan-800 transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Modal */}
      {validationModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  validationModal.type === 'success' ? 'bg-green-100 text-green-600' :
                  validationModal.type === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-cyan-100 text-cyan-600'
                }`}>
                  <i className={`fas ${
                    validationModal.type === 'success' ? 'fa-check' :
                    validationModal.type === 'error' ? 'fa-exclamation' :
                    'fa-info'
                  }`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{validationModal.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{validationModal.message}</p>
              <div className="flex justify-end">
                <button
                  onClick={closeValidation}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  OK
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