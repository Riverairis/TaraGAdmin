import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, BarElement, ArcElement, Filler } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, BarElement, ArcElement, Filler);

const AnalyticsDashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [tourGuidesData, setTourGuidesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get last 7 months labels
  const getMonthLabels = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const labels = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      labels.push(months[date.getMonth()]);
    }

    return labels;
  };

  const chartLabels = getMonthLabels();

  // Fetch users and tour guides data from backend
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const response = await fetch('http://localhost:5000/api/user/filtered-users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const users = data.users || [];

          // Separate travelers and tour guides
          const travelers = users.filter(user => (user.type || '').toLowerCase() === 'traveler');
          const tourGuides = users.filter(user => (user.type || '').toLowerCase() === 'tourguide');

          // Group by month for the last 7 months
          const groupByMonth = (userList) => {
            const currentDate = new Date();
            const monthCounts = new Array(7).fill(0);

            userList.forEach(user => {
              if (user.createdOn && user.createdOn._seconds) {
                const userDate = new Date(user.createdOn._seconds * 1000);
                const monthsDiff = (currentDate.getFullYear() - userDate.getFullYear()) * 12 +
                                  (currentDate.getMonth() - userDate.getMonth());

                // Count cumulative users up to each month
                if (monthsDiff >= 0 && monthsDiff < 7) {
                  for (let i = 6 - monthsDiff; i < 7; i++) {
                    monthCounts[i]++;
                  }
                }
              }
            });

            return monthCounts;
          };

          setUsersData(groupByMonth(travelers));
          setTourGuidesData(groupByMonth(tourGuides));
        } else {
          console.error('Failed to fetch analytics data');
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Total Users Graph
  const usersChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Total Travelers',
        data: usersData.length > 0 ? usersData : [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  // Tour Guides Graph
  const tourGuidesChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Total Tour Guides',
        data: tourGuidesData.length > 0 ? tourGuidesData : [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(249, 115, 22, 1)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(249, 115, 22, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          },
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        }
      },
      tooltip: {
        backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        bodyColor: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        intersect: false,
        mode: 'index'
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            weight: '500'
          },
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11,
            weight: '500'
          },
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        <span className="ml-4 text-lg text-gray-600 dark:text-gray-400">Loading analytics data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Total Users Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 border-b border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Platform Usage Statistics</h3>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-white text-lg"></i>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Total registered travelers growth over time</p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Line data={usersChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Tour Guides */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 border-b border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Tour Guides Growth</h3>
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Registered tour guides over time</p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Line data={tourGuidesChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;