import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, BarElement, ArcElement, Filler } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, BarElement, ArcElement, Filler);

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
            <p className="text-gray-600 dark:text-gray-300 mt-2">Total registered users growth over time</p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Line data={usersChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        {/* Tour Agencies */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 border-b border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Partner Tour Agencies</h3>
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-building text-white text-lg"></i>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Active agency partnerships and growth</p>
          </div>
          <div className="p-6">
            <div className="h-80">
              <Line data={tourAgenciesChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;