"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiUserPlus, FiUserMinus } from "react-icons/fi"
import axios from "axios"

const EventDetail = ({ user }) => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAttending, setIsAttending] = useState(false)

  useEffect(() => {
    fetchEventDetails()
  }, [id])

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setEvent(response.data.event)
      setIsAttending(response.data.event.attendees?.some((attendee) => attendee._id === user._id))
    } catch (error) {
      console.error("Error fetching event details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRSVP = async () => {
    try {
      const token = localStorage.getItem("token")
      if (isAttending) {
        await axios.delete(`/api/events/${id}/rsvp`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await axios.post(
          `/api/events/${id}/rsvp`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
      }
      fetchEventDetails()
    } catch (error) {
      console.error("Error updating RSVP:", error)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Event not found</h2>
        <p className="text-gray-600">The event you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
              <span
                className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${
                  event.status === "upcoming"
                    ? "bg-green-100 text-green-800"
                    : event.status === "ongoing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {event.status}
              </span>
            </div>

            <p className="text-primary-600 font-medium mb-4">{event.club?.name}</p>
            <p className="text-gray-600 mb-6">{event.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <FiCalendar className="w-5 h-5 mr-3 text-gray-400" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiClock className="w-5 h-5 mr-3 text-gray-400" />
                <span>{formatTime(event.date)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiMapPin className="w-5 h-5 mr-3 text-gray-400" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiUsers className="w-5 h-5 mr-3 text-gray-400" />
                <span>{event.attendees?.length || 0} attending</span>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-0">
            <button
              onClick={handleRSVP}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                isAttending ? "bg-red-100 text-red-700 hover:bg-red-200" : "btn-primary"
              }`}
            >
              {isAttending ? <FiUserMinus className="w-4 h-4" /> : <FiUserPlus className="w-4 h-4" />}
              <span>{isAttending ? "Cancel RSVP" : "RSVP"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Attendees */}
      {event.attendees && event.attendees.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendees ({event.attendees.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.attendees.map((attendee) => (
              <div key={attendee._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{attendee.fullName?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{attendee.fullName}</p>
                  <p className="text-sm text-gray-500 capitalize">{attendee.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Details */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Organized by</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{event.createdBy?.fullName?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{event.createdBy?.fullName}</p>
                <p className="text-sm text-gray-500">{event.club?.name}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Created</h3>
            <p className="text-gray-600">
              {new Date(event.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
