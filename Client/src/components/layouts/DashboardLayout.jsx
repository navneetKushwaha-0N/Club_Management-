"use client"

import { useState } from "react"
import { FaSignOutAlt, FaBell, FaUser, FaBars, FaTimes } from "react-icons/fa"

const DashboardLayout = ({ title, username, userType, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4 text-gray-500 focus:outline-none md:hidden"
            >
              <FaBars size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <FaBell size={20} />
            </button>
            <div className="relative">
              <button className="flex items-center text-sm focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                  <FaUser />
                </div>
                <span className="ml-2 hidden md:block font-medium">{username}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for mobile */}
        <div
          className={`fixed inset-0 z-20 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-lg">
            <div className="h-16 flex items-center justify-between px-4 border-b">
              <h2 className="text-xl font-bold text-purple-600">Club Manager</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <div className="px-4 py-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-800">{userType}</p>
                  <p className="text-xs text-gray-500">Logged in as {username}</p>
                </div>
              </div>
              <nav className="space-y-1">{/* Mobile navigation items would go here */}</nav>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={onLogout}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
              >
                <FaSignOutAlt className="mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Welcome, {username}</h2>
                <p className="text-gray-600">{userType}</p>
              </div>
              <button
                onClick={onLogout}
                className="mt-4 sm:mt-0 flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
              >
                <FaSignOutAlt className="mr-2" />
                Sign Out
              </button>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
