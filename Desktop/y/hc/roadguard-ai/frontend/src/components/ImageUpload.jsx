import React, { useState } from 'react'
import axios from 'axios'

export default function ImageUpload({ onDetectionComplete, setLoading, showToast, darkMode }) {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [error, setError] = useState('')

  const validateImage = (file) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

    if (!file) {
      setError('Please select an image file')
      showToast('Please select an image file', 'warning')
      return false
    }

    if (file.size > maxSize) {
      setError('File size exceeds 5MB limit')
      showToast('File size must be less than 5MB', 'error')
      return false
    }

    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file format. Use JPEG, PNG, or WebP')
      showToast('Please use JPEG, PNG, or WebP format', 'error')
      return false
    }

    setError('')
    return true
  }

  const validateCoordinates = (lat, lon) => {
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lon)

    if (isNaN(latitude) || isNaN(longitude)) {
      return 'Latitude and Longitude must be valid numbers'
    }
    if (latitude < -90 || latitude > 90) {
      return 'Latitude must be between -90 and 90'
    }
    if (longitude < -180 || longitude > 180) {
      return 'Longitude must be between -180 and 180'
    }
    return null
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && validateImage(file)) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6))
          setLongitude(position.coords.longitude.toFixed(6))
          showToast('📍 Location acquired!', 'success')
          setLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          showToast('⚠️ Using default location (San Francisco)', 'warning')
          setLatitude('37.7749')
          setLongitude('-122.4194')
          setLoading(false)
        }
      )
    } else {
      showToast('Geolocation not supported by this browser', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fileInput = e.target.elements.image
    const file = fileInput.files[0]

    if (!file) {
      showToast('Please select an image file', 'warning')
      return
    }

    if (!validateImage(file)) {
      return
    }

    const coordError = validateCoordinates(latitude, longitude)
    if (coordError) {
      setError(coordError)
      showToast(coordError, 'error')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('latitude', latitude || '0')
      formData.append('longitude', longitude || '0')

      const response = await axios.post('http://localhost:5000/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000 // 30 second timeout
      })

      onDetectionComplete({
        ...response.data,
        original_image: previewUrl,
      })

      showToast('✅ Detection completed successfully!', 'success')
      setPreviewUrl(null)
      fileInput.value = ''
      setLatitude('')
      setLongitude('')
    } catch (error) {
      console.error('Detection error:', error)
      const errorMsg = error.response?.data?.error || 'Error detecting potholes. Make sure backend is running.'
      setError(errorMsg)
      showToast('❌ ' + errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6 ${darkMode ? 'text-white' : ''}`}>
      <h2 className="text-2xl font-bold mb-4">📸 Upload Road Image</h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
              Image File (Max 5MB)
            </label>
            <input
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300 bg-white'}`}
            />
            <p className="text-xs mt-1 opacity-70">Supported: JPEG, PNG, WebP</p>
          </div>
          <div className="flex-1">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
              Location
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              📍 Get Current Location
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="-90 to 90"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300 bg-white'}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="-180 to 180"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300 bg-white'}`}
            />
          </div>
        </div>

        {previewUrl && (
          <div className="mt-4">
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Image Preview:</p>
            <img src={previewUrl} alt="Preview" className="max-h-64 rounded-lg object-cover" />
          </div>
        )}

        <button
          type="submit"
          disabled={!previewUrl}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🚀 Analyze Road Damage
        </button>
      </form>
    </div>
  )
}
