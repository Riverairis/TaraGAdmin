import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

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
  const [showUserSubscriptionModal, setShowUserSubscriptionModal] = useState(false);
  const [showAgencySubscriptionModal, setShowAgencySubscriptionModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    agencyName: '',
    amount: '',
    paymentMethod: 'PayMongo',
    status: 'pending'
  });
  const [newUserSubscription, setNewUserSubscription] = useState({
    name: '',
    price: '',
    duration: 'monthly',
    features: '',
    status: 'active'
  });
  const [newAgencySubscription, setNewAgencySubscription] = useState({
    name: '',
    price: '',
    duration: 'monthly',
    features: '',
    status: 'active'
  });

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
    // Sample user subscription plans
    const examplePlans = [
      {
        id: 1,
        name: "Traveler Basic",
        price: 299.00,
        duration: "monthly",
        features: "Basic travel features, 3 saved itineraries, standard support",
        status: "active",
        subscribers: 45,
        type: "user"
      },
      {
        id: 2,
        name: "Traveler Pro",
        price: 599.00,
        duration: "monthly",
        features: "Advanced features, unlimited itineraries, priority support, offline maps",
        status: "active",
        subscribers: 22,
        type: "user"
      },
      {
        id: 3,
        name: "Traveler Premium",
        price: 999.00,
        duration: "monthly",
        features: "All features, personalized recommendations, 24/7 support, travel insurance",
        status: "active",
        subscribers: 12,
        type: "user"
      },
      {
        id: 4,
        name: "Annual Traveler",
        price: 5999.00,
        duration: "yearly",
        features: "Pro plan with 2 months free",
        status: "inactive",
        subscribers: 8,
        type: "user"
      }
    ];
    setUserSubscriptions(examplePlans);
  };

  const fetchAgencySubscriptions = async () => {
    // Sample agency subscription plans
    const examplePlans = [
      {
        id: 1,
        name: "Agency Starter",
        price: 1999.00,
        duration: "monthly",
        features: "Basic listing, 5 featured tours, email support",
        status: "active",
        subscribers: 15,
        type: "agency"
      },
      {
        id: 2,
        name: "Agency Professional",
        price: 4499.00,
        duration: "monthly",
        features: "Premium listing, 20 featured tours, priority support, analytics",
        status: "active",
        subscribers: 8,
        type: "agency"
      },
      {
        id: 3,
        name: "Agency Enterprise",
        price: 8999.00,
        duration: "monthly",
        features: "Featured placement, unlimited tours, 24/7 support, advanced analytics",
        status: "active",
        subscribers: 3,
        type: "agency"
      },
      {
        id: 4,
        name: "Annual Agency",
        price: 19999.00,
        duration: "yearly",
        features: "Professional plan with 2 months free",
        status: "inactive",
        subscribers: 2,
        type: "agency"
      }
    ];
    setAgencySubscriptions(examplePlans);
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
    setShowTransactionModal(false);
    setNewTransaction({
      agencyName: '',
      amount: '',
      paymentMethod: 'PayMongo',
      status: 'pending'
    });
  };

  const handleAddUserSubscription = () => {
    const newId = userSubscriptions.length > 0 ? Math.max(...userSubscriptions.map(s => s.id)) + 1 : 1;
    const subscription = {
      ...newUserSubscription,
      id: newId,
      subscribers: 0,
      type: "user"
    };
    
    setUserSubscriptions([...userSubscriptions, subscription]);
    setShowUserSubscriptionModal(false);
    setNewUserSubscription({
      name: '',
      price: '',
      duration: 'monthly',
      features: '',
      status: 'active'
    });
  };

  const handleAddAgencySubscription = () => {
    const newId = agencySubscriptions.length > 0 ? Math.max(...agencySubscriptions.map(s => s.id)) + 1 : 1;
    const subscription = {
      ...newAgencySubscription,
      id: newId,
      subscribers: 0,
      type: "agency"
    };
    
    setAgencySubscriptions([...agencySubscriptions, subscription]);
    setShowAgencySubscriptionModal(false);
    setNewAgencySubscription({
      name: '',
      price: '',
      duration: 'monthly',
      features: '',
      status: 'active'
    });
  };

  const handleUpdateUserSubscriptionStatus = (id, status) => {
    setUserSubscriptions(userSubscriptions.map(plan => 
      plan.id === id ? {...plan, status} : plan
    ));
  };

  const handleUpdateAgencySubscriptionStatus = (id, status) => {
    setAgencySubscriptions(agencySubscriptions.map(plan => 
      plan.id === id ? {...plan, status} : plan
    ));
  };

  const handleUpdateTransactionStatus = (id, status) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === id ? {...transaction, status} : transaction
    ));
  };

  const handleUpdateCommissionRate = async () => {
    try {
      console.log('Updating commission rate to:', commissionRate);
      alert(`Commission rate updated to ${commissionRate}%`);
      setShowRateModal(false);
      fetchAgencyCommissions();
    } catch (error) {
      console.error('Error updating commission rate:', error);
      alert('Error updating commission rate. Please try again.');
    }
  };

  const handleProcessCommission = (commissionId) => {
    setAgencyCommissions(agencyCommissions.map(commission => 
      commission.id === commissionId ? {...commission, status: 'processed'} : commission
    ));
    alert(`Commission ${commissionId} processed`);
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-cyan-50 to-white dark:from-cyan-900/20 dark:to-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive revenue tracking and analytics for TaraG ecosystem</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</div>
              <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400">₱{metrics.totalRevenue.toLocaleString()}</div>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <button
              onClick={() => setShowRateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'agency-commissions', label: 'Agency Commissions' },
            { id: 'ad-revenue', label: 'Ad Revenue' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'user-subscriptions', label: 'User Subscriptions' },
            { id: 'agency-subscriptions', label: 'Agency Subscriptions' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`py-3 px-6 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 shadow-md hover:shadow-lg transition-shadow">
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
              
              <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 shadow-md hover:shadow-lg transition-shadow">
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
              
              <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 shadow-md hover:shadow-lg transition-shadow">
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
              
              <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 shadow-md hover:shadow-lg transition-shadow">
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
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
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
          </div>
        )}

        {/* Agency Commissions Tab */}
        {activeTab === 'agency-commissions' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Agency Commissions ({commissionRate}%)</h2>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button
                  onClick={() => exportData('commissions')}
                  className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  Export Data
                </button>
                <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>All Status</option>
                  <option>Processed</option>
                  <option>Pending</option>
                </select>
                <input
                  type="text"
                  placeholder="Search agencies..."
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {agencyCommissions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <i className="fas fa-handshake text-gray-400 dark:text-gray-500 text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Coming Soon</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Agency commissions feature is currently under development. Check back soon for updates!
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Agency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Transaction ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Package Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Commission</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Payment Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Customers</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {agencyCommissions.map(commission => (
                      <tr key={commission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{commission.agencyName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{commission.transactionId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{commission.packageType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ₱{commission.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-600 dark:text-cyan-400">
                          ₱{commission.commission.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{commission.paymentMethod}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{commission.customerCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {new Date(commission.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            commission.status === 'processed' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                          }`}>
                            {commission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {commission.status === 'pending' && (
                            <button 
                              onClick={() => handleProcessCommission(commission.id)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                            >
                              Process
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Ad Revenue Tab */}
        {activeTab === 'ad-revenue' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Advertising Revenue</h2>
              <button
                onClick={() => exportData('adrevenue')}
                className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors mt-4 md:mt-0"
              >
                Export Data
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Advertiser</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Impressions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">CTR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">CPC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {adRevenue.map(ad => (
                    <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{ad.advertiser}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{ad.campaign}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {ad.impressions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {ad.clicks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {ad.ctr}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        ₱{ad.cpc.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-600 dark:text-cyan-400">
                        ₱{ad.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ad.status === 'active' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                            : ad.status === 'completed'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
                        }`}>
                          {ad.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Transactions</h2>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button
                  onClick={() => setShowTransactionModal(true)}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Add Transaction
                </button>
                <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Refunded</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Agency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map(transaction => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.agencyName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{transaction.transactionId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        ₱{transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 capitalize">{transaction.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{transaction.paymentMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <select
                          value={transaction.status}
                          onChange={(e) => handleUpdateTransactionStatus(transaction.id, e.target.value)}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Subscriptions Tab */}
        {activeTab === 'user-subscriptions' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Subscription Plans</h2>
              <button
                onClick={() => setShowUserSubscriptionModal(true)}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors mt-4 md:mt-0"
              >
                Add Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userSubscriptions.map(plan => (
                <div key={plan.id} className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                      <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">
                        ₱{plan.price.toLocaleString()}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{plan.duration}</span>
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      plan.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
                    }`}>
                      {plan.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{plan.features}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{plan.subscribers} subscribers</span>
                    <span className="capitalize">{plan.duration}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <select
                      value={plan.status}
                      onChange={(e) => handleUpdateUserSubscriptionStatus(plan.id, e.target.value)}
                      className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agency Subscriptions Tab */}
        {activeTab === 'agency-subscriptions' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Agency Subscription Plans</h2>
              <button
                onClick={() => setShowAgencySubscriptionModal(true)}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors mt-4 md:mt-0"
              >
                Add Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencySubscriptions.map(plan => (
                <div key={plan.id} className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                      <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">
                        ₱{plan.price.toLocaleString()}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{plan.duration}</span>
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      plan.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
                    }`}>
                      {plan.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{plan.features}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{plan.subscribers} subscribers</span>
                    <span className="capitalize">{plan.duration}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <select
                      value={plan.status}
                      onChange={(e) => handleUpdateAgencySubscriptionStatus(plan.id, e.target.value)}
                      className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Commission Rate Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commission Rate Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
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
        </div>
      )}

      {/* Add Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Transaction</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agency Name
                </label>
                <input
                  type="text"
                  value={newTransaction.agencyName}
                  onChange={(e) => setNewTransaction({...newTransaction, agencyName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter agency name"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  value={newTransaction.paymentMethod}
                  onChange={(e) => setNewTransaction({...newTransaction, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
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
        </div>
      )}

      {/* Add User Subscription Modal */}
      {showUserSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add User Subscription Plan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={newUserSubscription.name}
                  onChange={(e) => setNewUserSubscription({...newUserSubscription, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter plan name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={newUserSubscription.price}
                  onChange={(e) => setNewUserSubscription({...newUserSubscription, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration
                </label>
                <select
                  value={newUserSubscription.duration}
                  onChange={(e) => setNewUserSubscription({...newUserSubscription, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  value={newUserSubscription.features}
                  onChange={(e) => setNewUserSubscription({...newUserSubscription, features: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe plan features"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowUserSubscriptionModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUserSubscription}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Add Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Agency Subscription Modal */}
      {showAgencySubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Agency Subscription Plan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={newAgencySubscription.name}
                  onChange={(e) => setNewAgencySubscription({...newAgencySubscription, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter plan name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={newAgencySubscription.price}
                  onChange={(e) => setNewAgencySubscription({...newAgencySubscription, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration
                </label>
                <select
                  value={newAgencySubscription.duration}
                  onChange={(e) => setNewAgencySubscription({...newAgencySubscription, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  value={newAgencySubscription.features}
                  onChange={(e) => setNewAgencySubscription({...newAgencySubscription, features: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe plan features"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAgencySubscriptionModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAgencySubscription}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Add Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueManagement;