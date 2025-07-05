"use client"

import { useState, useEffect } from "react"
import { FiSearch, FiPlus, FiCalendar } from "react-icons/fi"
import EventCard from "../components/EventCard"
import EventCreateForm from "/Users/mollenmist/Desktop/CLUB/frontend/src/pages/EventCreateForm.jsx"
import axios from "axios"

const Events = ({ user }) => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [showCreateForm, setShowCreateForm] = useState(false)

  const statuses = ["All", "upcoming", "ongoing", "completed"]

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, selectedStatus])

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEvents(Array.isArray(response.data?.events) ? response.data.events : [])
    } catch (error) {
      console.error("Error fetching events:", error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    const safeEvents = Array.isArray(events) ? events : []
    let filtered = safeEvents

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.club?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter((event) => event.status === selectedStatus)
    }

    setFilteredEvents(filtered)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 mt-1">Discover upcoming events and activities</p>
        </div>
        {user?.role === "club_head" && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 mt-4 sm:mt-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            <FiPlus className="w-5 h-5" />
            <span>Create Event</span>
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
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border border-gray-300 shadow-inner pl-10 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400 transition duration-300"
          />
        </div>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="block w-full rounded-xl border border-gray-300 shadow-inner py-3 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300 appearance-none"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "All" ? "All Events" : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredEvents?.length || 0} event{filteredEvents?.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Events Grid */}
      {filteredEvents?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transform hover:scale-105 transition duration-300"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Create Event Modal */}
      <EventCreateForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSuccess={fetchEvents}
      />
    </div>
  )
}

export default Events
