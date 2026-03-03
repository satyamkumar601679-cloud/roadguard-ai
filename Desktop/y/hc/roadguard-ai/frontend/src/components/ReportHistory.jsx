import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

export default function ReportHistory({ reports, onReportClick }) {
  const [sortBy, setSortBy] = useState('timestamp')

  const getSeverityColor = (level) => {
    switch (level) {
      case 'High':
        return 'text-red-600 bg-red-50'
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'Low':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const sortedReports = [...(reports || [])].sort((a, b) => {
    if (sortBy === 'priority') {
      return b.priority_score - a.priority_score
    } else if (sortBy === 'severity') {
      const severityOrder = { High: 3, Medium: 2, Low: 1 }
      return (severityOrder[b.severity_level] || 0) - (severityOrder[a.severity_level] || 0)
    } else {
      return new Date(b.timestamp) - new Date(a.timestamp)
    }
  })

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Report History</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="timestamp">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="severity">Sort by Severity</option>
        </select>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedReports && sortedReports.length > 0 ? (
          sortedReports.map((report, idx) => (
            <div
              key={idx}
              onClick={() => onReportClick && onReportClick(report)}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition flex justify-between items-center"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(report.severity_level)}`}>
                    {report.severity_level}
                  </span>
                  <span className="text-sm text-gray-600">
                    Priority: <span className="font-bold">{report.priority_score}%</span>
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  📍 {report.latitude?.toFixed(3)}, {report.longitude?.toFixed(3)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {report.timestamp
                    ? formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })
                    : 'Unknown date'}
                </p>
              </div>
              <div className="text-right text-xs text-gray-500">
                Click to view
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No reports yet. Start by uploading a road image.</p>
        )}
      </div>
    </div>
  )
}
