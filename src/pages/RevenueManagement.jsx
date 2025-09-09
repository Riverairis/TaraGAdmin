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
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
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
        fetchSubscriptionPlans()
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

  const fetchSubscriptionPlans = async () => {
    // Sample subscription plans
    const examplePlans = [
      {
        id: 1,
        name: "Basic Plan",
        price: 999.00,
        duration: "monthly",
        features: "Basic listing, 5 featured tours, email support",
        status: "active",
        subscribers: 15
      },
      {
        id: 2,
        name: "Professional Plan",
        price: 2499.00,
        duration: "monthly",
        features: "Premium listing, 20 featured tours, priority support, analytics",
        status: "active",
        subscribers: 8
      },
      {
        id: 3,
        name: "Enterprise Plan",
        price: 4999.00,
        duration: "monthly",
        features: "Featured placement, unlimited tours, 24/7 support, advanced analytics",
        status: "active",
        subscribers: 3
      },
      {
        id: 4,
        name: "Annual Basic",
        price: 9999.00,
        duration: "yearly",
        features: "Basic plan with 2 months free",
        status: "inactive",
        subscribers: 2
      }
    ];
    setSubscriptionPlans(examplePlans);
  };
  const fetchAgencyCommissions = async () => {
    // Enhanced with more realistic data matching TaraG Portal features
    const exampleCommissions = [
      {
        id: 1,
        agencyName: "Island Paradise Tours",
        transactionId: "TXN-2024-001",
        amount: 15000.00,
        commission: 450.00,
        date: "2024-01-15",
        status: "processed",
        paymentMethod: "PayMongo",
        customerCount: 4,
        packageType: "Island Hopping"
      },
      {
        id: 2,
        agencyName: "Mountain Trek Adventures",
        transactionId: "TXN-2024-002",
        amount: 8900.00,
        commission: 267.00,
        date: "2024-01-14",
        status: "pending",
        paymentMethod: "GCash",
        customerCount: 2,
        packageType: "Mountain Hiking"
      },
      {
        id: 3,
        agencyName: "Heritage Cultural Tours",
        transactionId: "TXN-2024-003",
        amount: 12500.00,
        commission: 375.00,
        date: "2024-01-13",
        status: "processed",
        paymentMethod: "Credit Card",
        customerCount: 6,
        packageType: "Cultural Tour"
      },
      {
        id: 4,
        agencyName: "Ocean Blue Expeditions",
        transactionId: "TXN-2024-004",
        amount: 21000.00,
        commission: 630.00,
        date: "2024-01-12",
        status: "processed",
        paymentMethod: "PayPal",
        customerCount: 8,
        packageType: "Diving Adventure"
      },
      {
        id: 5,
        agencyName: "Sunset Travel Co.",
        transactionId: "TXN-2024-005",
        amount: 7500.00,
        commission: 225.00,
        date: "2024-01-11",
        status: "pending",
        paymentMethod: "Bank Transfer",
        customerCount: 3,
        packageType: "Sunset Tour"
      }
    ];
    setAgencyCommissions(exampleCommissions);
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

  const handleAddSubscription = () => {
    const newId = subscriptionPlans.length > 0 ? Math.max(...subscriptionPlans.map(s => s.id)) + 1 : 1;
    const subscription = {
      ...newSubscription,
      id: newId,
      subscribers: 0
    };
    
    setSubscriptionPlans([...subscriptionPlans, subscription]);
    setShowSubscriptionModal(false);
    setNewSubscription({
      name: '',
      price: '',
      duration: 'monthly',
      features: '',
      status: 'active'
    });
  };

  const handleUpdateSubscriptionStatus = (id, status) => {
    setSubscriptionPlans(subscriptionPlans.map(plan => 
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Revenue Management</h1>
            <p className="text-sm text-gray-500">Comprehensive revenue tracking and analytics for TaraG ecosystem</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500">Total Revenue</div>
              <div className="text-lg font-bold text-cyan-600">₱{metrics.totalRevenue.toLocaleString()}</div>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
    { id: 'agency-commissions', label: 'Agency Commissions' },
    { id: 'ad-revenue', label: 'Ad Revenue' },
    { id: 'payment-methods', label: 'Payment Methods' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'analytics', label: 'Analytics' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`py-3 px-6 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
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
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
        <p className="text-3xl font-bold text-gray-900">₱{metrics.totalRevenue.toLocaleString()}</p>
      </div>
      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
        <i className="fas fa-chart-line text-purple-600"></i>
      </div>
    </div>
  </div>
  
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">Agency Commissions</p>
        <p className="text-3xl font-bold text-gray-900">₱{metrics.totalCommissions.toLocaleString()}</p>
      </div>
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <i className="fas fa-handshake text-blue-600"></i>
      </div>
    </div>
  </div>
  
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">Ad Revenue</p>
        <p className="text-3xl font-bold text-gray-900">₱{metrics.totalAdRevenue.toLocaleString()}</p>
      </div>
      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
        <i className="fas fa-bullhorn text-green-600"></i>
      </div>
    </div>
  </div>
  
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">Avg Transaction</p>
        <p className="text-3xl font-bold text-gray-900">₱{metrics.avgTransactionSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
      </div>
      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
        <i className="fas fa-calculator text-orange-600"></i>
      </div>
    </div>
  </div>
</div>

            {/* Revenue Trend Chart */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trend (Last 7 Days)</h3>
                <button
                  onClick={() => exportData('analytics')}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                >
                  Export
                </button>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, '']} />
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
              <h2 className="text-lg font-semibold text-gray-900">Agency Commissions ({commissionRate}%)</h2>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button
                  onClick={() => exportData('commissions')}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Export Data
                </button>
                <select className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All Status</option>
                  <option>Processed</option>
                  <option>Pending</option>
                </select>
                <input
                  type="text"
                  placeholder="Search agencies..."
                  className="px-3 py-2 border border-gray-300 rounded-lg w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agencyCommissions.map(commission => (
                    <tr key={commission.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{commission.agencyName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{commission.transactionId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{commission.packageType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₱{commission.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-600">
                        ₱{commission.commission.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{commission.paymentMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{commission.customerCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(commission.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          commission.status === 'processed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {commission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {commission.status === 'pending' && (
                          <button 
                            onClick={() => handleProcessCommission(commission.id)}
                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 transition-colors"
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

        {/* Ad Revenue Tab */}
        {activeTab === 'ad-revenue' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Advertising Revenue</h2>
              <button
                onClick={() => exportData('adrevenue')}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors mt-4 md:mt-0"
              >
                Export Data
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Advertiser</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impressions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adRevenue.map(ad => (
                    <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{ad.advertiser}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ad.campaign}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {ad.impressions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {ad.clicks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {ad.ctr}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₱{ad.cpc.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-600">
                        ₱{ad.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ad.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
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

        {/* Payment Methods Tab */}
        {activeTab === 'payment-methods' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Payment Method Analytics</h2>
              <p className="text-sm text-gray-500">Distribution of payment methods used by TaraG travelers</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Revenue by Payment Method</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, 'Revenue']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-900">Payment Method Details</h3>
                {paymentMethodData.map((method, index) => (
                  <div key={method.name} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.count} transactions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₱{method.value.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {((method.value / paymentMethodData.reduce((sum, m) => sum + m.value, 0)) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Transaction Management</h2>
        <div className="flex space-x-3 mt-4 md:mt-0">
         
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg"
            onChange={(e) => {
              // Filter logic would go here
            }}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map(transaction => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transaction.transactionId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {transaction.agencyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₱{transaction.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                  {transaction.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {transaction.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : transaction.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {transaction.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleUpdateTransactionStatus(transaction.id, 'completed')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Complete
                      </button>
                      <button 
                        onClick={() => handleUpdateTransactionStatus(transaction.id, 'refunded')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Refund
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}

  {/* Subscriptions Tab */}
  {activeTab === 'subscriptions' && (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Subscription Plans</h2>
        <button
          onClick={() => setShowSubscriptionModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-600 transition-all shadow-md mt-4 md:mt-0"
        >
          Create Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionPlans.map(plan => (
          <div key={plan.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {plan.status}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="text-3xl font-bold text-cyan-600">₱{plan.price.toLocaleString()}</div>
              <div className="text-gray-500">per {plan.duration}</div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <i className="fas fa-users mr-2"></i>
                {plan.subscribers} subscribers
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {plan.features.split(',').map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2 text-xs"></i>
                    <span>{feature.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateSubscriptionStatus(plan.id, plan.status === 'active' ? 'inactive' : 'active')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                  plan.status === 'active' 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                } transition-colors`}
              >
                {plan.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Advanced Analytics</h2>
              <button
                onClick={() => exportData('analytics')}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Export Analytics
              </button>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">Conversion Rate</p>
        <p className="text-3xl font-bold text-gray-900">{metrics.conversionRate.toFixed(1)}%</p>
      </div>
      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
        <i className="fas fa-percent text-indigo-600"></i>
      </div>
    </div>
  </div>
  
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">Total Transactions</p>
        <p className="text-3xl font-bold text-gray-900">{metrics.totalTransactions}</p>
      </div>
      <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
        <i className="fas fa-receipt text-pink-600"></i>
      </div>
    </div>
  </div>
  
  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">Active Agencies</p>
        <p className="text-3xl font-bold text-gray-900">{new Set(agencyCommissions.map(c => c.agencyName)).size}</p>
      </div>
      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
        <i className="fas fa-building text-teal-600"></i>
      </div>
    </div>
  </div>
</div>

            {/* Revenue Breakdown Chart */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission vs Ad Revenue Comparison</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, '']} />
                    <Bar dataKey="commissions" fill="#8B5CF6" name="Commissions" />
                    <Bar dataKey="adRevenue" fill="#06B6D4" name="Ad Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Performing Agencies */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Agencies</h3>
              <div className="space-y-3">
                {agencyCommissions
                  .reduce((acc, commission) => {
                    const existing = acc.find(a => a.name === commission.agencyName);
                    if (existing) {
                      existing.revenue += commission.commission;
                      existing.transactions += 1;
                    } else {
                      acc.push({
                        name: commission.agencyName,
                        revenue: commission.commission,
                        transactions: 1
                      });
                    }
                    return acc;
                  }, [])
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((agency, index) => (
                    <div key={agency.name} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-cyan-600 font-semibold text-sm">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{agency.name}</p>
                          <p className="text-sm text-gray-500">{agency.transactions} transactions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-cyan-600">₱{agency.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">commission earned</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div> 

  {/* Add Subscription Modal */}
  {showSubscriptionModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Create Subscription Plan</h3>
          <button 
            onClick={() => setShowSubscriptionModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
            <input
              type="text"
              value={newSubscription.name}
              onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              placeholder="Enter plan name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₱)</label>
            <input
              type="number"
              value={newSubscription.price}
              onChange={(e) => setNewSubscription({...newSubscription, price: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              placeholder="Enter price"
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <select
              value={newSubscription.duration}
              onChange={(e) => setNewSubscription({...newSubscription, duration: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma separated)</label>
            <textarea
              value={newSubscription.features}
              onChange={(e) => setNewSubscription({...newSubscription, features: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              placeholder="Feature 1, Feature 2, Feature 3"
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={newSubscription.status}
              onChange={(e) => setNewSubscription({...newSubscription, status: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSubscription}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-600 transition-all shadow-md"
            >
              Create Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
      {/* Enhanced Commission Rate Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Settings</h3>
              <button 
                onClick={() => setShowRateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <p className="text-sm text-gray-500 mt-1">Current rate: {commissionRate}% of agency transactions</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">TaraG Payment Integration Status</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    PayMongo API - Integrated
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    GCash - Integrated
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    PayPal - Integrated
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-clock text-yellow-500 mr-2"></i>
                    Bank Transfer - Pending Setup
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-sm text-yellow-700">
                    Changing the commission rate will affect future transactions only. Existing commissions will not be modified.
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowRateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCommissionRate}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-600 transition-all shadow-md"
                >
                  Update Settings
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