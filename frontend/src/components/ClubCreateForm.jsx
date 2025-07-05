"use client"

import { useState } from "react"
import { FiX } from "react-icons/fi"
import axios from "axios"

const ClubCreateForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Academic",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const categories = [
    "Academic",
    "Sports",
    "Cultural",
    "Technical",
    "Social Service",
    "Arts",
    "Other",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"}/api/clubs`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      onSuccess()
      onClose()
      setFormData({ name: "", description: "", category: "Academic" })
    } catch (err) {
      if (err.response?.data?.errors?.length > 0) {
        setError(
          err.response.data.errors.map((e) => e.msg).join(", ")
        )
      } else {
        setError(err.response?.data?.message || "Failed to create club")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white/20 dark:bg-gray-800/30 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 rounded-2xl max-w-md w-full p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Club</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50/60 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 backdrop-blur">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Club Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
              Club Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/30 dark:bg-gray-800/30 backdrop-blur rounded-xl p-3 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-900 dark:text-white font-medium placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter your club’s name"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full appearance-none bg-white/30 dark:bg-gray-800/30 backdrop-blur rounded-xl p-3 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition font-medium"
            >
              <option value="" disabled className="text-gray-400">
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category} value={category} className="text-gray-800 dark:text-gray-200">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-white/30 dark:bg-gray-800/30 backdrop-blur rounded-xl p-3 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-900 dark:text-white font-medium placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              placeholder="Describe your club here..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Club"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClubCreateForm
