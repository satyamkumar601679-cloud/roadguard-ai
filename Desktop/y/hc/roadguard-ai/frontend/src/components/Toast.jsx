import React, { useEffect, useState } from 'react'

const Toast = ({ message, type = 'success' }) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
    }, 2700)

    return () => clearTimeout(timer)
  }, [])

  const typeStyles = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    warning: 'bg-yellow-500 border-yellow-600',
    info: 'bg-blue-500 border-blue-600'
  }

  const typeEmojis = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 ${
      isExiting ? 'translate-x-96 opacity-0' : 'translate-x-0 opacity-100'
    }`}>
      <div className={`${typeStyles[type]} border-2 text-white px-6 py-3 rounded-lg shadow-lg max-w-sm`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{typeEmojis[type]}</span>
          <p className="font-semibold">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default Toast
