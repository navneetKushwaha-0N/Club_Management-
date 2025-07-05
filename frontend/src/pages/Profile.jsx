"use client"

import { useState } from "react"
import { FiUser, FiMail, FiEdit, FiSave, FiX } from "react-icons/fi"

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // TODO: Implement profile update API call
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
    })
    setIsEditing(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 px-4 py-6">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-2xl p-6 transition hover:shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your account information</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium px-4 py-2 rounded-xl shadow hover:shadow-lg transition duration-300"
            >
              <FiEdit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center space-x-2 bg-green-500 text-white font-medium px-4 py-2 rounded-xl shadow hover:shadow-lg transition duration-300"
              >
                <FiSave className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center space-x-2 bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-xl shadow hover:shadow-lg transition duration-300"
              >
                <FiX className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-inner">
            <span className="text-white text-3xl font-bold">{user.fullName?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{user.fullName}</h2>
            <p className="text-gray-500 capitalize">{user.role.replace("_", " ")}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
              />
            ) : (
              <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <FiUser className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{user.fullName}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
              />
            ) : (
              <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <FiMail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{user.email}</span>
              </div>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  user.role === "club_head"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {user.role === "club_head" ? "Club Head" : "Student"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="bg-white shadow rounded-2xl p-6 transition hover:shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center bg-gray-50 p-6 rounded-xl border border-gray-200">
            <p className="text-3xl font-bold text-indigo-600">0</p>
            <p className="text-sm text-gray-600 mt-1">Clubs Joined</p>
          </div>
          <div className="text-center bg-gray-50 p-6 rounded-xl border border-gray-200">
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600 mt-1">Events Attended</p>
          </div>
          <div className="text-center bg-gray-50 p-6 rounded-xl border border-gray-200">
            <p className="text-3xl font-bold text-purple-600">
              {user.role === "club_head" ? "0" : "N/A"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {user.role === "club_head" ? "Clubs Created" : "Not Applicable"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
