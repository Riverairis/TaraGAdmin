import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { logRevenueTransactionProcessed, logRevenueSubscriptionUpdated, logRevenueCommissionRateChanged } from '../utils/adminActivityLogger';

const RevenueManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [agencyCommissions, setAgencyCommissions] = useState([]);
  const [adRevenue, setAdRevenue] = useState([]);
  const [paymentTransactions, setPaymentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commissionRate, setCommissionRate] = useState(3);
  const [showRateModal, setShowRateModal] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [selectedAgency, setSelectedAgency] = useState('all');

  // New states for transactions and subscriptions
  const [transactions, setTransactions] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [agencySubscriptions, setAgencySubscriptions] = useState([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    agencyName: '',
    amount: '',
    paymentMethod: 'PayMongo',
    status: 'pending'
  });
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    price: '',
    duration: 'monthly',
    features: '',
    status: 'active',
    type: 'user' // Default to user subscription
  });

  // Filter states matching alerts design
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
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

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDateFilter('');
  };

  const activeFiltersCount = [
    searchTerm,
    statusFilter !== 'all',
    typeFilter !== 'all',
    dateFilter
  ].filter(Boolean).length;

  useEffect(() => {
    fetchAllData();
  }, [dateRange, selectedAgency]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAgencyCommissions(),
        fetchAdRevenue(),
        fetchPaymentTransactions(),
        fetchTransactions(),
        fetchUserSubscriptions(),
        fetchAgencySubscriptions()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    // Sample transaction data
    const exampleTransactions = [
      {
        id: 1,
        agencyName: "Island Paradise Tours",
        transactionId: "TXN-2024-001",
        amount: 15000.00,
        type: "subscription",
        paymentMethod: "PayMongo",
        status: "completed",
        date: "2024-01-15",
        customerEmail: "customer1@example.com"
      },
      {
        id: 2,
        agencyName: "Mountain Trek Adventures",
        transactionId: "TXN-2024-002",
        amount: 8900.00,
        type: "subscription",
        paymentMethod: "GCash",
        status: "pending",
        date: "2024-01-14",
        customerEmail: "customer2@example.com"
      },
      {
        id: 3,
        agencyName: "Heritage Cultural Tours",
        transactionId: "TXN-2024-003",
        amount: 12500.00,
        type: "subscription",
        paymentMethod: "Credit Card",
        status: "completed",
        date: "2024-01-13",
        customerEmail: "customer3@example.com"
      },
      {
        id: 4,
        agencyName: "Ocean Blue Expeditions",
        transactionId: "TXN-2024-004",
        amount: 21000.00,
        type: "subscription",
        paymentMethod: "PayPal",
        status: "refunded",
        date: "2024-01-12",
        customerEmail: "customer4@example.com"
      }
    ];
    setTransactions(exampleTransactions);
  };

  const fetchUserSubscriptions = async () => {
    // Real user subscription plan
    const userPlan = [
      {
        id: 1,
        name: "TaraG Premium",
        price: 499.00,
        duration: "monthly",
        features: "Unlimited itineraries, Priority support, Offline maps, Personalized recommendations, Ad-free experience, Early access to new features",
        status: "active",
        subscribers: 127,
        type: "user"
      }
    ];
    setUserSubscriptions(userPlan);
  };

  const fetchAgencySubscriptions = async () => {
    // Real agency subscription plan
    const agencyPlan = [
      {
        id: 1,
        name: "TaraG Agency Pro",
        price: 3999.00,
        duration: "monthly",
        features: "Premium listing, Unlimited tour packages, Featured placement on homepage, Advanced analytics dashboard, Priority customer support, Custom branding options, Commission management tools",
        status: "active",
        subscribers: 34,
        type: "agency"
      }
    ];
    setAgencySubscriptions(agencyPlan);
  };

  const fetchAgencyCommissions = async () => {
    // Coming soon - no example data
    setAgencyCommissions([]);
  };

  const fetchAdRevenue = async () => {
    const exampleAdRevenue = [
      {
        id: 1,
        advertiser: "Philippine Airlines",
        campaign: "Summer Getaway Promo",
        impressions: 125000,
        clicks: 2500,
        cpc: 15.00,
        revenue: 37500.00,
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        status: "active",
        ctr: 2.0
      },
      {
        id: 2,
        advertiser: "Hotel Sogo",
        campaign: "Staycation Package",
        impressions: 89000,
        clicks: 1780,
        cpc: 12.50,
        revenue: 22250.00,
        startDate: "2024-01-05",
        endDate: "2024-02-05",
        status: "active",
        ctr: 2.0
      },
      {
        id: 3,
        advertiser: "Smart Communications",
        campaign: "Travel SIM Cards",
        impressions: 150000,
        clicks: 3000,
        cpc: 10.00,
        revenue: 30000.00,
        startDate: "2023-12-15",
        endDate: "2024-01-15",
        status: "completed",
        ctr: 2.0
      }
    ];
    setAdRevenue(exampleAdRevenue);
  };

  const fetchPaymentTransactions = async () => {
    const exampleTransactions = [
      { id: 1, method: "PayMongo", amount: 45000, count: 12, date: "2024-01-15" },
      { id: 2, method: "GCash", amount: 32000, count: 8, date: "2024-01-14" },
      { id: 3, method: "Credit Card", amount: 28000, count: 6, date: "2024-01-13" },
      { id: 4, method: "PayPal", amount: 21000, count: 4, date: "2024-01-12" }
    ];
    setPaymentTransactions(exampleTransactions);
  };

  const handleAddTransaction = () => {
    const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    const transaction = {
      ...newTransaction,
      id: newId,
      transactionId: `TXN-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      type: "manual"
    };
    
    setTransactions([...transactions, transaction]);
    
    // Log the transaction
    logRevenueTransactionProcessed(transaction.transactionId, transaction.agencyName, transaction.amount);
    
    setShowTransactionModal(false);
    setNewTransaction({
      agencyName: '',
      amount: '',
      paymentMethod: 'PayMongo',
      status: 'pending'
    });
  };

  const handleAddSubscription = () => {
    const newId = getAllSubscriptions().length > 0 ? Math.max(...getAllSubscriptions().map(s => s.id)) + 1 : 1;
    const subscription = {
      ...newSubscription,
      id: newId,
      subscribers: 0
    };
    
    if (newSubscription.type === 'user') {
      setUserSubscriptions([...userSubscriptions, subscription]);
    } else {
      setAgencySubscriptions([...agencySubscriptions, subscription]);
    }
    
    // Log the subscription creation
    logRevenueSubscriptionUpdated(newId, subscription.name, 'created');
    
    setShowSubscriptionModal(false);
    setNewSubscription({
      name: '',
      price: '',
      duration: 'monthly',
      features: '',
      status: 'active',
      type: 'user'
    });
  };

  const handleUpdateSubscriptionStatus = (id, type, status) => {
    const subscription = type === 'user' 
      ? userSubscriptions.find(s => s.id === id)
      : agencySubscriptions.find(s => s.id === id);
    
    if (type === 'user') {
      setUserSubscriptions(userSubscriptions.map(plan => 
        plan.id === id ? {...plan, status} : plan
      ));
    } else {
      setAgencySubscriptions(agencySubscriptions.map(plan => 
        plan.id === id ? {...plan, status} : plan
      ));
    }
    
    // Log the subscription status update
    logRevenueSubscriptionUpdated(id, subscription?.name || 'Unknown Plan', status);
  };

  const handleUpdateTransactionStatus = (id, status) => {
    const transaction = transactions.find(t => t.id === id);
    
    setTransactions(transactions.map(transaction => 
      transaction.id === id ? {...transaction, status} : transaction
    ));
    
    // Log the transaction status update
    if (transaction) {
      logRevenueTransactionProcessed(transaction.transactionId, transaction.agencyName, transaction.amount);
    }
  };

  const handleUpdateCommissionRate = async () => {
    try {
      console.log('Updating commission rate to:', commissionRate);
      
      // Log the commission rate change
      await logRevenueCommissionRateChanged(commissionRate);
      
      showValidation({
        title: 'Success',
        message: `Commission rate updated to ${commissionRate}%`,
        type: 'success'
      });
      setShowRateModal(false);
      fetchAgencyCommissions();
    } catch (error) {
      console.error('Error updating commission rate:', error);
      showValidation({
        title: 'Error',
        message: 'Error updating commission rate. Please try again.',
        type: 'error'
      });
    }
  };

  const handleProcessCommission = (commissionId) => {
    setAgencyCommissions(agencyCommissions.map(commission => 
      commission.id === commissionId ? {...commission, status: 'processed'} : commission
    ));
    showValidation({
      title: 'Processed',
      message: `Commission ${commissionId} processed successfully`,
      type: 'success'
    });
  };

  // Helper function to get all subscriptions combined
  const getAllSubscriptions = () => {
    return [...userSubscriptions, ...agencySubscriptions];
  };

  const calculateMetrics = () => {
    const totalCommissions = agencyCommissions
      .filter(c => c.status === 'processed')
      .reduce((sum, commission) => sum + commission.commission, 0);
    
    const totalAdRevenue = adRevenue
      .filter(ad => ad.status === 'completed' || ad.status === 'active')
      .reduce((sum, ad) => sum + ad.revenue, 0);
    
    const totalTransactionAmount = agencyCommissions
      .reduce((sum, commission) => sum + commission.amount, 0);

    const avgTransactionSize = totalTransactionAmount / agencyCommissions.length || 0;
    
    return {
      totalRevenue: totalCommissions + totalAdRevenue,
      totalCommissions,
      totalAdRevenue,
      avgTransactionSize,
      totalTransactions: agencyCommissions.length,
      conversionRate: ((agencyCommissions.filter(c => c.status === 'processed').length / agencyCommissions.length) * 100) || 0
    };
  };

  const getRevenueChartData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const commissionsForDay = agencyCommissions
        .filter(c => c.date === dateStr)
        .reduce((sum, c) => sum + c.commission, 0);
      
      const adRevenueForDay = adRevenue
        .filter(ad => ad.startDate <= dateStr && ad.endDate >= dateStr)
        .reduce((sum, ad) => sum + (ad.revenue / 30), 0); // Daily average
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        commissions: commissionsForDay,
        adRevenue: adRevenueForDay,
        total: commissionsForDay + adRevenueForDay
      });
    }
    return last7Days;
  };

  const getPaymentMethodData = () => {
    const methodStats = {};
    paymentTransactions.forEach(transaction => {
      if (!methodStats[transaction.method]) {
        methodStats[transaction.method] = { amount: 0, count: 0 };
      }
      methodStats[transaction.method].amount += transaction.amount;
      methodStats[transaction.method].count += transaction.count;
    });
    
    return Object.entries(methodStats).map(([method, stats]) => ({
      name: method,
      value: stats.amount,
      count: stats.count
    }));
  };

  const exportData = (type) => {
    let data, filename;
    
    switch (type) {
      case 'commissions':
        data = agencyCommissions;
        filename = 'agency_commissions.json';
        break;
      case 'adrevenue':
        data = adRevenue;
        filename = 'ad_revenue.json';
        break;
      case 'analytics':
        data = { metrics: calculateMetrics(), chartData: getRevenueChartData() };
        filename = 'revenue_analytics.json';
        break;
      default:
        return;
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const metrics = calculateMetrics();
  const chartData = getRevenueChartData();
  const paymentMethodData = getPaymentMethodData();
  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  // Chart styling for dark mode
  const chartTextColor = document.documentElement.classList.contains('dark') ? '#fff' : '#000';
  const chartGridColor = document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const tooltipBgColor = document.documentElement.classList.contains('dark') ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)';

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header - Updated to match EmergencyMonitoring design */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Revenue Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive revenue tracking and analytics for TaraG ecosystem</p>
        </div>

        {/* Main Container - Updated to match EmergencyMonitoring design */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Tab Navigation - Updated styling */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex px-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'agency-commissions', label: 'Agency Commissions'},
                { id: 'ad-revenue', label: 'Ad Revenue' },
                { id: 'transactions', label: 'Transactions' },
                { id: 'subscriptions', label: 'Subscriptions' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
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
                      placeholder="Search revenue data..."
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
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Filter Revenue Data</h3>
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
                                  <option value="completed">Completed</option>
                                  <option value="pending">Pending</option>
                                  <option value="refunded">Refunded</option>
                                </select>
                              </div>

                              {/* Type Filter */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                  Type
                                </label>
                                <select
                                  value={typeFilter}
                                  onChange={(e) => setTypeFilter(e.target.value)}
                                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                  <option value="all">All Types</option>
                                  <option value="subscription">Subscription</option>
                                  <option value="commission">Commission</option>
                                  <option value="advertising">Advertising</option>
                                </select>
                              </div>

                              {/* Date Filter */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                  Date
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
                                  {typeFilter !== 'all' && (
                                    <span className="inline-flex items-center px-2 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 text-xs rounded-full border border-cyan-200 dark:border-cyan-700">
                                      Type: {typeFilter}
                                      <button
                                        onClick={() => setTypeFilter('all')}
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

                  {/* Date Range Selector */}
                  <div className="flex-shrink-0">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 90 days</option>
                    </select>
                  </div>

                  {/* Settings Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => setShowRateModal(true)}
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium text-sm w-full justify-center lg:w-auto"
                    >
                      <i className="fas fa-cog"></i>
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">₱{metrics.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <i className="fas fa-chart-line text-purple-600 dark:text-purple-400"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Agency Commissions</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">₱{metrics.totalCommissions.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <i className="fas fa-handshake text-blue-600 dark:text-blue-400"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Ad Revenue</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">₱{metrics.totalAdRevenue.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <i className="fas fa-bullhorn text-green-600 dark:text-green-400"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Avg Transaction</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">₱{metrics.avgTransactionSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <i className="fas fa-calculator text-orange-600 dark:text-orange-400"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Trend Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend (Last 7 Days)</h3>
                    <button
                      onClick={() => exportData('analytics')}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      Export
                    </button>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fill: chartTextColor }}
                        />
                        <YAxis 
                          tick={{ fill: chartTextColor }}
                        />
                        <Tooltip 
                          formatter={(value) => [`₱${value.toLocaleString()}`, '']}
                          contentStyle={{ 
                            backgroundColor: tooltipBgColor,
                            border: 'none',
                            borderRadius: '8px',
                            color: chartTextColor
                          }}
                        />
                        <Line type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={2} />
                        <Line type="monotone" dataKey="commissions" stroke="#06B6D4" strokeWidth={2} />
                        <Line type="monotone" dataKey="adRevenue" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Payment Methods Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={paymentMethodData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {paymentMethodData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`₱${value.toLocaleString()}`, '']}
                            contentStyle={{ 
                              backgroundColor: tooltipBgColor,
                              border: 'none',
                              borderRadius: '8px',
                              color: chartTextColor
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method Details</h3>
                    <div className="space-y-4">
                      {paymentMethodData.map((method, index) => (
                        <div key={method.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span className="font-medium text-gray-900 dark:text-white">{method.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">₱{method.value.toLocaleString()}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{method.count} transactions</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Agency Commissions Tab */}
            {activeTab === 'agency-commissions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Agency Commission Tracking</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => exportData('commissions')}
                      className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      Export
                    </button>
                  </div>
                </div>

                {agencyCommissions.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <i className="fas fa-handshake text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Commission Tracking Coming Soon</h3>
                    <p className="text-gray-500 dark:text-gray-400">Agency commission tracking will be available in the next update.</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Agency</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Commission</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {agencyCommissions.map((commission) => (
                            <tr key={commission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{commission.agencyName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{commission.transactionId}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">₱{commission.amount.toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">₱{commission.commission.toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  commission.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                  commission.status === 'processed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}>
                                  {commission.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{commission.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {commission.status === 'pending' && (
                                  <button
                                    onClick={() => handleProcessCommission(commission.id)}
                                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-medium"
                                  >
                                    Process
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ad Revenue Tab */}
            {activeTab === 'ad-revenue' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advertising Revenue</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => exportData('adrevenue')}
                      className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      Export
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Advertiser</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Campaign</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Impressions</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Clicks</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CTR</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Revenue</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Period</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {adRevenue.map((ad) => (
                          <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{ad.advertiser}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{ad.campaign}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{ad.impressions.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{ad.clicks.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{ad.ctr}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">₱{ad.revenue.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                ad.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                ad.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                              }`}>
                                {ad.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {ad.startDate} to {ad.endDate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Agency/Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment Method</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{transaction.transactionId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              <div>{transaction.agencyName}</div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs">{transaction.customerEmail}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">₱{transaction.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{transaction.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{transaction.paymentMethod}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={transaction.status}
                                onChange={(e) => handleUpdateTransactionStatus(transaction.id, e.target.value)}
                                className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-cyan-500 ${
                                  transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                  transaction.status === 'refunded' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="refunded">Refunded</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{transaction.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-medium mr-3">
                                View
                              </button>
                              <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Subscriptions Tab - Card Layout */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subscription Plans</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage user and agency subscription tiers</p>
                  </div>
                  <button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <i className="fas fa-plus"></i>
                    Add Plan
                  </button>
                </div>

                {/* Subscription Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {getAllSubscriptions().map((plan) => (
                    <div 
                      key={`${plan.type}-${plan.id}`} 
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      {/* Card Header */}
                      <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${
                        plan.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
                          : 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h4>
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                                plan.type === 'user' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              }`}>
                                <i className={`fas ${plan.type === 'user' ? 'fa-user' : 'fa-building'} mr-1.5`}></i>
                                {plan.type}
                              </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold text-gray-900 dark:text-white">₱{plan.price.toLocaleString()}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">/ {plan.duration}</span>
                            </div>
                          </div>
                          <select
                            value={plan.status}
                            onChange={(e) => handleUpdateSubscriptionStatus(plan.id, plan.type, e.target.value)}
                            className={`text-xs font-semibold rounded-full px-3 py-1.5 border-0 focus:ring-2 focus:ring-cyan-500 cursor-pointer ${
                              plan.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 space-y-4">
                        {/* Subscribers Count */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                            <i className="fas fa-users text-cyan-600 dark:text-cyan-400 text-xl"></i>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Active Subscribers</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{plan.subscribers}</p>
                          </div>
                        </div>

                        {/* Features List */}
                        <div>
                          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <i className="fas fa-check-circle text-cyan-500"></i>
                            Features Included
                          </h5>
                          <ul className="space-y-2">
                            {plan.features.split(',').map((feature, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <i className="fas fa-check text-green-500 mt-0.5 flex-shrink-0"></i>
                                <span>{feature.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <button className="flex-1 px-4 py-2.5 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors font-medium flex items-center justify-center gap-2">
                            <i className="fas fa-edit"></i>
                            Edit Plan
                          </button>
                          <button className="flex-1 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium flex items-center justify-center gap-2">
                            <i className="fas fa-trash"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {getAllSubscriptions().length === 0 && (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <i className="fas fa-box-open text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Subscription Plans</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first subscription plan</p>
                    <button
                      onClick={() => setShowSubscriptionModal(true)}
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-2.5 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
                    >
                      <i className="fas fa-plus"></i>
                      Add Your First Plan
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Commission Rate Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Update Commission Rate</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Commission Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={commissionRate}
                onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRateModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCommissionRate}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Update Rate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Transaction</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agency/Customer Name
                </label>
                <input
                  type="text"
                  value={newTransaction.agencyName}
                  onChange={(e) => setNewTransaction({...newTransaction, agencyName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  value={newTransaction.paymentMethod}
                  onChange={(e) => setNewTransaction({...newTransaction, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="PayMongo">PayMongo</option>
                  <option value="GCash">GCash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={newTransaction.status}
                  onChange={(e) => setNewTransaction({...newTransaction, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTransactionModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Subscription Plan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={newSubscription.name}
                  onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plan Type
                </label>
                <select
                  value={newSubscription.type}
                  onChange={(e) => setNewSubscription({...newSubscription, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="user">User Subscription</option>
                  <option value="agency">Agency Subscription</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={newSubscription.price}
                  onChange={(e) => setNewSubscription({...newSubscription, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration
                </label>
                <select
                  value={newSubscription.duration}
                  onChange={(e) => setNewSubscription({...newSubscription, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Features
                </label>
                <textarea
                  value={newSubscription.features}
                  onChange={(e) => setNewSubscription({...newSubscription, features: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={newSubscription.status}
                  onChange={(e) => setNewSubscription({...newSubscription, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubscription}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Add Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Modal */}
      {validationModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-sm w-full p-6 text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              validationModal.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
              validationModal.type === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
              'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              <i className={`fas ${
                validationModal.type === 'success' ? 'fa-check text-green-600 dark:text-green-400' :
                validationModal.type === 'error' ? 'fa-times text-red-600 dark:text-red-400' :
                'fa-info text-blue-600 dark:text-blue-400'
              }`}></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{validationModal.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{validationModal.message}</p>
            <button
              onClick={closeValidation}
              className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueManagement;