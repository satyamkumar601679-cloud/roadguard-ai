import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})

function MapCenter({ lat, lng }) {
  const map = useMap()

  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15)
    }
  }, [lat, lng, map])

  return null
}

function MarkerIcon(severity) {
  const colors = {
    High: '#ef4444',
    Medium: '#f59e0b',
    Low: '#10b981',
  }

  return L.divIcon({
    html: `<div style="background-color: ${colors[severity] || '#6b7280'}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [25, 25],
    className: 'custom-marker',
  })
}

export default function Map({ detection, reports, onMarkerClick }) {
  const [mapKey, setMapKey] = useState(0)

  const defaultLat = detection?.latitude || 37.7749
  const defaultLng = detection?.longitude || -122.4194

  useEffect(() => {
    setMapKey((prev) => prev + 1)
  }, [detection, reports])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Road Damage Map</h2>

      <div
        style={{
          height: '500px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '2px solid #e5e7eb',
        }}
      >
        <MapContainer
          key={mapKey}
          center={[defaultLat, defaultLng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          <MapCenter lat={defaultLat} lng={defaultLng} />

          {detection && (
            <Marker
              position={[detection.latitude, detection.longitude]}
              icon={MarkerIcon(detection.severity_level)}
            >
              <Popup>
                <div className="font-semibold text-sm">
                  <p>
                    <span className="font-bold">New Detection</span>
                  </p>
                  <p className="text-gray-700">
                    Severity: <span className="font-semibold">{detection.severity_level}</span>
                  </p>
                  <p className="text-gray-700">
                    Priority: <span className="font-semibold">{detection.priority_score}%</span>
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {reports &&
            reports.map((report, idx) => (
              <Marker
                key={idx}
                position={[report.latitude, report.longitude]}
                icon={MarkerIcon(report.severity_level)}
                eventHandlers={{
                  click: () => onMarkerClick && onMarkerClick(report),
                }}
              >
                <Popup>
                  <div className="font-semibold text-sm">
                    <p className="text-gray-700">
                      Severity: <span className="font-semibold">{report.severity_level}</span>
                    </p>
                    <p className="text-gray-700">
                      Priority: <span className="font-semibold">{report.priority_score}%</span>
                    </p>
                    <p className="text-gray-600 text-xs">
                      {new Date(report.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💡 Tip:</span> Click on markers to view report details. The map shows
          all detected potholes with color-coded severity levels.
        </p>
      </div>
    </div>
  )
}
