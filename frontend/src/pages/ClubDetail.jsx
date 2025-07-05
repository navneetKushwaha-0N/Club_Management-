"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FiUsers, FiCalendar, FiEdit, FiTrash2, FiUserPlus, FiUserMinus } from "react-icons/fi"
import MemberItem from "../components/MemberItem"
import EventCard from "../components/EventCard"
import ConfirmDeleteModal from "../components/ConfirmDeleteModal"
import axios from "axios"

const ClubDetail = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [club, setClub] = useState(null)
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetchClubDetails()
  }, [id])

  const fetchClubDetails = async () => {
    try {
      const token = localStorage.getItem("token")
      const [clubRes, membersRes, eventsRes] = await Promise.all([
        axios.get(`/api/clubs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`/api/clubs/${id}/members`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`/api/clubs/${id}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      setClub(clubRes.data.club)
      setMembers(membersRes.data.members)
      setEvents(eventsRes.data.events)
      setIsMember(membersRes.data.members.some((member) => member._id === user._id))
    } catch (error) {
      console.error("Error fetching club details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinLeave = async () => {
    try {
      const token = localStorage.getItem("token")
      if (isMember) {
        await axios.delete(`/api/clubs/${id}/members`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await axios.post(
          `/api/clubs/${id}/members`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
      }
      fetchClubDetails()
    } catch (error) {
      console.error("Error joining/leaving club:", error)
    }
  }

  const handleDeleteClub = async () => {
    setDeleteLoading(true)
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`/api/clubs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      navigate("/clubs")
    } catch (error) {
      console.error("Error deleting club:", error)
    } finally {
      setDeleteLoading(false)
      setShowDeleteModal(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Club not found</h2>
        <p className="text-gray-600">The club you're looking for doesn't exist.</p>
      </div>
    )
  }

  const isClubHead = club.clubHead._id === user._id

  return (
    <div className="space-y-6">
      {/* Club Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{club.name}</h1>
              <span className="inline-block px-2 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
                {club.category}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{club.description}</p>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <FiUsers className="w-4 h-4 mr-1" />
                <span>{members.length} members</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="w-4 h-4 mr-1" />
                <span>{events.length} events</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-4 sm:mt-0">
            {!isClubHead && (
              <button
                onClick={handleJoinLeave}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isMember ? "bg-red-100 text-red-700 hover:bg-red-200" : "btn-primary"
                }`}
              >
                {isMember ? <FiUserMinus className="w-4 h-4" /> : <FiUserPlus className="w-4 h-4" />}
                <span>{isMember ? "Leave Club" : "Join Club"}</span>
              </button>
            )}

            {isClubHead && (
              <>
                <button className="btn-secondary flex items-center space-x-2">
                  <FiEdit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-100 text-red-700 hover:bg-red-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Club Head Info */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Club Head</h2>
        <MemberItem member={club.clubHead} showRole={false} />
      </div>

      {/* Members */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Members ({members.length})</h2>
        </div>

        {members.length > 0 ? (
          <div className="space-y-3">
            {members.map((member) => (
              <MemberItem key={member._id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No members yet</p>
          </div>
        )}
      </div>

      {/* Events */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Events ({events.length})</h2>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No events scheduled</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteClub}
        title="Delete Club"
        message={`Are you sure you want to delete "${club.name}"? This action cannot be undone and will remove all associated events and memberships.`}
        loading={deleteLoading}
      />
    </div>
  )
}

export default ClubDetail
