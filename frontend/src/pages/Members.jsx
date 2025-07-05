"use client"

import { useState, useEffect } from "react"
import { FiSearch, FiUsers } from "react-icons/fi"
import MemberItem from "../components/MemberItem"
import axios from "axios"

const Members = ({ user }) => {
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("All")

  const roles = ["All", "student", "club_head"]

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    filterMembers()
  }, [members, searchTerm, selectedRole])

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMembers(response.data.users)
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterMembers = () => {
    let filtered = members

    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedRole !== "All") {
      filtered = filtered.filter((member) => member.role === selectedRole)
    }

    setFilteredMembers(filtered)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <p className="text-gray-600">View all registered members</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="input-field pr-10 appearance-none"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === "All" ? "All Roles" : role === "club_head" ? "Club Heads" : "Students"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Members List */}
      {filteredMembers.length > 0 ? (
        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <MemberItem key={member._id} member={member} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

export default Members
