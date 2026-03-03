import React, { useState, useEffect } from 'react'
import ImageUpload from './components/ImageUpload'
import DetectionResult from './components/DetectionResult'
import SeverityCard from './components/SeverityCard'
import Map from './components/Map'
import Dashboard from './components/Dashboard'
import ReportHistory from './components/ReportHistory'
import Toast from './components/Toast'
import { fetchRoadReports, getReportStats } from './supabaseClient'
import './index.css'

export default function App() {
  const [detection, setDetection] = useState(null)
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Fetch reports and stats on mount and after new detection
  useEffect(() => {
    loadData()
  }, [detection])

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const loadData = async () => {
    setLoading(true)
    try {
      const [fetchedReports, fetchedStats] = await Promise.all([
        fetchRoadReports(),
        getReportStats(),
      ])
      setReports(fetchedReports || [])
      setStats(fetchedStats)
    } catch (error) {
      console.error('Error loading data:', error)
      showToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ ...toast, show: false }), 3000)
  }

  const handleDetectionComplete = (result) => {
    setDetection(result)
    setSelectedReport(null)
    showToast('✅ Detection completed successfully!', 'success')
  }

  const handleRefresh = () => {
    loadData()
    showToast('Refreshing data...', 'info')
  }

  const exportToCSV = () => {
    if (reports.length === 0) {
      showToast('No data to export', 'warning')
      return
    }
    const csv = [
      ['ID', 'Severity', 'Priority Score', 'Latitude', 'Longitude', 'Date'].join(','),
      ...reports.map(r => [
        r.id,
        r.severity_level,
        r.priority_score,
        r.latitude,
        r.longitude,
        new Date(r.timestamp).toLocaleDateString()
      ].join(','))
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roadguard-reports-${new Date().toISOString()}.csv`
    a.click()
    showToast('Reports exported successfully!', 'success')
  }

  return (
    <div className={`min-h-screen transition ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      {/* Toast Notification */}
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white shadow-lg sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">🛣️ RoadGuard AI</h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-blue-100'} text-sm`}>Smart Infrastructure Monitoring & Repair Planning</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-2 rounded-lg font-semibold transition ${autoRefresh ? 'bg-green-500' : 'bg-gray-500'} text-white hover:opacity-90`}
                title={autoRefresh ? 'Auto-refresh enabled (30s)' : 'Auto-refresh disabled'}
              >
                {autoRefresh ? '📡 Auto' : '⏸️ Manual'}
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50"
              >
                {loading ? '🔄' : '🔄'}
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                title="Export reports as CSV"
              >
                📥
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 py-8 ${darkMode ? 'text-white' : ''}`}>
        {/* Detection Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">New Detection</h2>
          <ImageUpload onDetectionComplete={handleDetectionComplete} setLoading={setLoading} showToast={showToast} darkMode={darkMode} />
        </div>

        {/* Detection Result */}
        {detection && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Detection Result</h2>
              <DetectionResult detection={detection} darkMode={darkMode} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Assessment</h2>
              <SeverityCard detection={detection} darkMode={darkMode} />
            </div>
          </div>
        )}

        {/* Map */}
        {reports.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Detection Map</h2>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`} style={{ height: '500px' }}>
              <Map reports={reports} detection={detection} selectedReport={selectedReport} onMarkerClick={setSelectedReport} darkMode={darkMode} />
            </div>
          </div>
        )}

        {/* Dashboard */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">City Dashboard</h2>
            <Dashboard stats={stats} reports={reports} darkMode={darkMode} />
          </div>
        )}

        {/* Report History */}
        {reports.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Report History</h2>
            <ReportHistory 
              reports={reports} 
              selectedReport={selectedReport} 
              onSelectReport={setSelectedReport} 
              darkMode={darkMode}
            />
          </div>
        )}

        {/* Welcome Message */}
        {reports.length === 0 && !detection && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 text-center`}>
            <h3 className="text-2xl font-bold mb-4">Welcome to RoadGuard AI</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Upload a road image to detect potholes and get started with smart infrastructure monitoring.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-lg`}>
                <h4 className="font-bold mb-2">📸 Upload Image</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add a road damage image for AI detection</p>
              </div>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} p-4 rounded-lg`}>
                <h4 className="font-bold mb-2">🤖 AI Analysis</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Advanced computer vision detection</p>
              </div>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-yellow-50'} p-4 rounded-lg`}>
                <h4 className="font-bold mb-2">📊 Plan Repairs</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Priority-based maintenance planning</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-950' : 'bg-gray-800'} ${darkMode ? 'text-gray-400' : 'text-gray-300'} py-6 mt-12`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; 2024 RoadGuard AI. Smart Infrastructure Monitoring System for City Authorities.
          </p>
          <p className="text-xs mt-2 opacity-70">Built with React, Flask, OpenCV, and Supabase | Reports: {reports.length} | High Risk: {stats?.high || 0}</p>
        </div>
      </footer>
    </div>
  )
}
