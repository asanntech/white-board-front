'use client'

import { useState, useEffect, useCallback } from 'react'
import packageJson from '../../../package.json'

const STORAGE_KEY = 'app-version'

export const UpdateNotificationModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const storedVersion = localStorage.getItem(STORAGE_KEY)
    if (storedVersion !== packageJson.version) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, packageJson.version)
    setIsOpen(false)
  }, [])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          アプリが更新されました
        </h2>
        <p className="text-sm text-gray-600 mb-1">
          White Board App が最新バージョンに更新されました。
        </p>
        <p className="text-xs text-gray-400 mb-5">v{packageJson.version}</p>
        <button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
          onClick={handleClose}
        >
          OK
        </button>
      </div>
    </div>
  )
}
