import React from 'react'

export default function SeverityCard({ severity, priorityScore, damageCount }) {
  const getSeverityColor = (level) => {
    switch (level) {
      case 'High':
        return 'bg-red-500'
      case 'Medium':
        return 'bg-yellow-500'
      case 'Low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getSeverityBgColor = (level) => {
    switch (level) {
      case 'High':
        return 'bg-red-50 border-red-200'
      case 'Medium':
        return 'bg-yellow-50 border-yellow-200'
      case 'Low':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className={`rounded-lg shadow-lg p-6 border-2 ${getSeverityBgColor(severity)}`}>
      <h3 className="text-xl font-bold mb-4 text-gray-800">Damage Assessment</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Severity Level</p>
          <div className={`${getSeverityColor(severity)} text-white font-bold text-3xl py-4 rounded-lg`}>
            {severity}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Repair Priority</p>
          <div className="bg-blue-500 text-white font-bold text-3xl py-4 rounded-lg">
            {priorityScore}%
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Damage Areas Detected:</span> {damageCount}
        </p>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2 flex items-center">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Low Priority (Green) - Non-urgent repairs
        </p>
        <p className="mb-2 flex items-center">
          <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
          Medium Priority (Yellow) - Schedule repairs
        </p>
        <p className="flex items-center">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          High Priority (Red) - Urgent repairs needed
        </p>
      </div>
    </div>
  )
}
