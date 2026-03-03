import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function Dashboard({ stats }) {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">City Dashboard Analytics</h2>
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    )
  }

  const pieData = {
    labels: ['High Priority', 'Medium Priority', 'Low Priority'],
    datasets: [
      {
        data: [stats.high, stats.medium, stats.low],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderColor: ['#dc2626', '#d97706', '#059669'],
        borderWidth: 2,
      },
    ],
  }

  const barData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Number of Potholes',
        data: [stats.high, stats.medium, stats.low],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderColor: ['#dc2626', '#d97706', '#059669'],
        borderWidth: 1,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'x',
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">City Dashboard Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
          <p className="text-sm font-semibold mb-2 opacity-90">Total Potholes</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow">
          <p className="text-sm font-semibold mb-2 opacity-90">High Priority</p>
          <p className="text-3xl font-bold">{stats.high}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow">
          <p className="text-sm font-semibold mb-2 opacity-90">Medium Priority</p>
          <p className="text-3xl font-bold">{stats.medium}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
          <p className="text-sm font-semibold mb-2 opacity-90">Low Priority</p>
          <p className="text-3xl font-bold">{stats.low}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Severity Distribution</h3>
          <Pie data={pieData} />
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Pothole Breakdown</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-sm text-green-800">
          <span className="font-semibold">✓ System Status:</span> All monitoring systems operational. Dashboard
          updates in real-time with new reports.
        </p>
      </div>
    </div>
  )
}
