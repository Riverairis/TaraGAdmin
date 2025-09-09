import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, BarElement, ArcElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, BarElement, ArcElement);

const AnalyticsDashboard = () => {
  const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  // Total Users Graph
  const usersChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Total Users',
        data: [800, 900, 950, 1000, 1100, 1200, 1247],
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

  // Tour Agencies Graph
  const tourAgenciesChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Partner Tour Agencies',
        data: [45, 48, 52, 55, 58, 62, 65],
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

  // Popular Destinations (Bar Chart)
  const destinationsData = {
    labels: ['Boracay', 'Palawan', 'Bohol', 'Siargao', 'Cebu', 'Batangas'],
    datasets: [
      {
        label: 'Bookings',
        data: [320, 280, 245, 190, 165, 140],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Most Booked Tour Packages (Doughnut Chart)
  const tourPackagesData = {
    labels: ['Beach Paradise', 'Mountain Adventure', 'City Explorer', 'Island Hopping', 'Cultural Heritage'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 3,
        hoverOffset: 10
      }
    ]
  };

  // User Engagement Metrics
  const engagementData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Daily Active Users',
        data: [450, 520, 480, 650, 720, 800, 890],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: 'Bookings Made',
        data: [25, 30, 28, 45, 52, 48, 65],
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
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
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
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
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8
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
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    },
    cutout: '60%'
  };

  return (
    <div className="space-y-8">
      
      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Total Users Trend */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Platform Usage Statistics</h3>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-white text-lg"></i>
              </div>
            </div>
            <p className="text-gray-600 mt-2">Total registered users growth over time</p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Line data={usersChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Tour Agencies */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Partner Tour Agencies</h3>
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-building text-white text-lg"></i>
              </div>
            </div>
            <p className="text-gray-600 mt-2">Active agency partnerships and growth</p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Line data={tourAgenciesChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 border-b border-green-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Popular Destinations</h3>
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-map-marker-alt text-white text-lg"></i>
              </div>
            </div>
            <p className="text-gray-600 mt-2">Top destinations by booking volume</p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Bar data={destinationsData} options={barChartOptions} />
            </div>
          </div>
        </div>

        {/* Most Booked Tour Packages */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-purple-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Most Booked Tour Packages</h3>
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-suitcase-rolling text-white text-lg"></i>
              </div>
            </div>
            <p className="text-gray-600 mt-2">Distribution of popular tour types</p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Doughnut data={tourPackagesData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* User Engagement Metrics */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 border-b border-teal-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">User Engagement Metrics</h3>
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-white text-lg"></i>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Daily active users and booking conversion rates</p>
        </div>
        <div className="p-6">
          <div className="h-96">
            <Line data={engagementData} options={lineChartOptions} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;