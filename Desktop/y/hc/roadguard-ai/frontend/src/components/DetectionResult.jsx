import React from 'react'

export default function DetectionResult({ detection }) {
  if (!detection) return null

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Detection Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Original Image</h3>
          {detection.original_image && (
            <img
              src={detection.original_image}
              alt="Original"
              className="w-full rounded-lg object-cover border-2 border-gray-300"
            />
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Damage Detection</h3>
          {detection.processed_image && (
            <img
              src={detection.processed_image}
              alt="Processed"
              className="w-full rounded-lg object-cover border-2 border-blue-300"
            />
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-600 text-sm mb-1">Damage Count</p>
          <p className="text-2xl font-bold text-blue-600">{detection.damage_count || 0}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-600 text-sm mb-1">Severity</p>
          <p
            className={`text-2xl font-bold ${
              detection.severity_level === 'High'
                ? 'text-red-600'
                : detection.severity_level === 'Medium'
                  ? 'text-yellow-600'
                  : 'text-green-600'
            }`}
          >
            {detection.severity_level}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-600 text-sm mb-1">Priority Score</p>
          <p className="text-2xl font-bold text-orange-600">{detection.priority_score}%</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-600 text-sm mb-1">Location</p>
          <p className="text-xs font-mono text-gray-700">
            {detection.latitude?.toFixed(3)}, {detection.longitude?.toFixed(3)}
          </p>
        </div>
      </div>
    </div>
  )
}
