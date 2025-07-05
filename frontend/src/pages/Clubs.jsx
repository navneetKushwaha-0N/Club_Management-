"use client"

import { useState, useEffect } from "react"
import { FiSearch, FiPlus, FiFilter } from "react-icons/fi"
import ClubCard from "../components/ClubCard"
import ClubCreateForm from "../components/ClubCreateForm"
import axios from "axios"

const Clubs = ({ user }) => {
  const [clubs, setClubs] = useState([])
  const [filteredClubs, setFilteredClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showCreateForm, setShowCreateForm] = useState(false)

  const categories = [
    "All",
    "Academic",
    "Sports",
    "Cultural",
    "Technical",
    "Social Service",
    "Arts",
    "Other",
  ]

  useEffect(() => {
    fetchClubs()
  }, [])

  useEffect(() => {
    filterClubs()
  }, [clubs, searchTerm, selectedCategory])

  const fetchClubs = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"}/api/clubs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setClubs(response.data?.clubs || [])
    } catch (error) {
      console.error("Error fetching clubs:", error)
      setClubs([])
    } finally {
      setLoading(false)
    }
  }

  const filterClubs = () => {
    let filtered = Array.isArray(clubs) ? clubs : []

    if (searchTerm) {
      filtered = filtered.filter(
        (club) =>
          club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          club.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((club) => club.category === selectedCategory)
    }

    setFilteredClubs(filtered)
  }

  const handleCreateSuccess = () => {
    fetchClubs()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clubs</h1>
          <p className="text-gray-600">Discover and join amazing clubs</p>
        </div>
        {user?.role === "club_head" && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 mt-4 sm:mt-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            <FiPlus className="w-5 h-5" />
            <span>Create Club</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 animate-slide-in">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border border-gray-300 shadow-inner pl-10 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400 transition duration-300"
          />
        </div>

        <div className="relative flex-1 sm:flex-none sm:w-60">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-600 py-3 pr-10 pl-4 text-gray-800 dark:text-white bg-gradient-to-r from-white to-gray-100 dark:from-gray-800 dark:to-gray-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300 font-medium placeholder-gray-500 dark:placeholder-gray-400"
          >
            {categories.map((category) => (
              <option key={category} value={category} className="text-gray-800 dark:text-gray-200">
                {category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiFilter className="h-5 w-5 text-gray-400 dark:text-gray-300" />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {Array.isArray(filteredClubs) ? filteredClubs.length : 0} club
          {Array.isArray(filteredClubs) && filteredClubs.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Clubs Grid */}
      {Array.isArray(filteredClubs) && filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredClubs.map((club) => (
            <div
              key={club._id}
              className="rounded-xl transition duration-300 ease-in-out hover:bg-indigo-50 hover:bg-opacity-50"
            >
              <ClubCard club={club} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 animate-bounce-in">
          <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No clubs found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Create Club Modal */}
      <ClubCreateForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}

export default Clubs
