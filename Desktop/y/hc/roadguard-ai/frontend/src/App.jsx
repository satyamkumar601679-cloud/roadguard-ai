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

  useEffect(() => {
    loadData()
  }, [detection])

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
    window.URL.revokeObjectURL(url)
    showToast('Reports exported successfully!', 'success')
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-b from-white via-slate-50 to-white'
    }`}>
      {/* Toast Notification */}
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <header className={`${
        darkMode 
          ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700' 
          : 'bg-white shadow-md border-b border-slate-200'
      } sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className={`text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
                🛣️ RoadGuard AI
              </h1>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm font-medium`}>
                Intelligent Infrastructure Management System
              </p>
            </div>
            
            {/* Header Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                  autoRefresh 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                    : 'bg-slate-600 text-white'
                }`}
                title={autoRefresh ? 'Auto-refresh enabled (30s)' : 'Auto-refresh disabled'}
              >
                {autoRefresh ? '📡' : '⏸️'}
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                  darkMode 
                    ? 'bg-slate-700 text-white hover:bg-slate-600' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? '⏳' : '🔄'}
              </button>
              <button
                onClick={exportToCSV}
                className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg`}
                title="Export reports as CSV"
              >
                📥
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' 
                    : 'bg-slate-200 text-slate-800'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Detection Section */}
        <section className="mb-12">
          <div className="space-y-2 mb-6">
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Detection Engine
            </h2>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} font-medium`}>
              Upload a road image to detect damage and assess priority
            </p>
          </div>
          <ImageUpload 
            onDetectionComplete={handleDetectionComplete} 
            setLoading={setLoading} 
            showToast={showToast} 
            darkMode={darkMode} 
          />
        </section>

        {/* Detection Result */}
        {detection && (
          <section className="mb-12 space-y-6">
            <div className="space-y-2">
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Analysis Results
              </h2>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} font-medium`}>
                AI-powered damage assessment and severity classification
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden border ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <div className="p-6 border-b border-slate-300 dark:border-slate-700">
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Original vs Processed
                  </h3>
                </div>
                <div className="p-6">
                  <DetectionResult detection={detection} darkMode={darkMode} />
                </div>
              </div>
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden border ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <div className="p-6 border-b border-slate-300 dark:border-slate-700">
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Severity Assessment
                  </h3>
                </div>
                <div className="p-6">
                  <SeverityCard detection={detection} darkMode={darkMode} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Map Section */}
        {reports.length > 0 && (
          <section className="mb-12">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Detection Map
                </h2>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} font-medium`}>
                  Visualize all reported damage locations in real-time
                </p>
              </div>
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden border ${
                darkMode ? 'border-slate-700' : 'border-slate-200'
              }`} style={{ height: '500px' }}>
                <Map 
                  reports={reports} 
                  detection={detection} 
                  selectedReport={selectedReport} 
                  onMarkerClick={setSelectedReport} 
                  darkMode={darkMode} 
                />
              </div>
            </div>
          </section>
        )}

        {/* Dashboard Section */}
        {stats && (
          <section className="mb-12">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Analytics Dashboard
                </h2>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} font-medium`}>
                  Comprehensive statistics and trend analysis
                </p>
              </div>
              <Dashboard stats={stats} reports={reports} darkMode={darkMode} />
            </div>
          </section>
        )}

        {/* Report History Section */}
        {reports.length > 0 && (
          <section className="mb-12">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Detection History
                </h2>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} font-medium`}>
                  {reports.length} reports · Sorted by priority
                </p>
              </div>
              <ReportHistory 
                reports={reports} 
                selectedReport={selectedReport} 
                onSelectReport={setSelectedReport} 
                darkMode={darkMode}
              />
            </div>
          </section>
        )}

        {/* Welcome Hero Section */}
        {reports.length === 0 && !detection && (
          <section className="mb-12">
            <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} rounded-3xl shadow-2xl overflow-hidden border ${
              darkMode ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <div className="relative overflow-hidden p-12 sm:p-16">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-10 -mr-40 -mt-40"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-12">
                    <h2 className={`text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
                      Welcome to RoadGuard AI
                    </h2>
                    <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-700'} max-w-2xl mx-auto`}>
                      The intelligent infrastructure monitoring system that uses advanced computer vision to detect road damage, assess severity, and guide maintenance decisions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-white/40 backdrop-blur-md'} rounded-2xl p-8 border ${
                      darkMode ? 'border-slate-600' : 'border-white/60'
                    } hover:scale-105 transition-transform duration-300`}>
                      <div className="text-4xl mb-3">📸</div>
                      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        Smart Upload
                      </h3>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-700'} text-sm`}>
                        Simply upload a road image and let our AI analyze it instantly
                      </p>
                    </div>

                    <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-white/40 backdrop-blur-md'} rounded-2xl p-8 border ${
                      darkMode ? 'border-slate-600' : 'border-white/60'
                    } hover:scale-105 transition-transform duration-300`}>
                      <div className="text-4xl mb-3">🤖</div>
                      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        AI Detection
                      </h3>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-700'} text-sm`}>
                        Advanced computer vision identifies and classifies road damage patterns
                      </p>
                    </div>

                    <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-white/40 backdrop-blur-md'} rounded-2xl p-8 border ${
                      darkMode ? 'border-slate-600' : 'border-white/60'
                    } hover:scale-105 transition-transform duration-300`}>
                      <div className="text-4xl mb-3">📊</div>
                      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        Data Insights
                      </h3>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-700'} text-sm`}>
                        Get actionable insights and priority recommendations for repairs
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className={`${darkMode ? 'text-slate-500' : 'text-slate-700'} font-medium`}>
                      👆 Start by uploading a road image above
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className={`${
        darkMode 
          ? 'bg-gradient-to-t from-slate-950 to-slate-900 border-t border-slate-800' 
          : 'bg-gradient-to-t from-slate-100 to-white border-t border-slate-200'
      } mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                RoadGuard AI
              </h3>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                Smart infrastructure monitoring for smarter cities
              </p>
            </div>
            <div>
              <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Features
              </h4>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <li>AI-Powered Detection</li>
                <li>Real-time Analytics</li>
                <li>Data Export</li>
                <li>Dark Mode Support</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Stats
              </h4>
              <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <p>Reports: <span className="font-semibold text-blue-600">{reports.length}</span></p>
                <p>High Priority: <span className="font-semibold text-red-600">{stats?.high || 0}</span></p>
              </div>
            </div>
          </div>
          
          <div className={`border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'} pt-8`}>
            <p className={`text-center text-sm ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
              &copy; 2024 RoadGuard AI. Powered by React, Flask, OpenCV & Supabase.
            </p>
            <p className={`text-center text-xs ${darkMode ? 'text-slate-600' : 'text-slate-500'} mt-2`}>
              Version 2.0 Enhanced • Production Ready
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
