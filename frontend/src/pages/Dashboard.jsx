"use client"

import { useState, useEffect } from "react"
import { FiUsers, FiCalendar, FiTrendingUp, FiActivity } from "react-icons/fi"
import axios from "axios"

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalClubs: 0,
    totalEvents: 0,
    totalMembers: 0,
    myClubs: 0,
  })
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const [statsRes, eventsRes] = await Promise.all([
        axios.get("http://localhost:5001/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5001/api/events?limit=5", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      setStats(statsRes.data || { totalClubs: 0, totalEvents: 0, totalMembers: 0, myClubs: 0 })
      setRecentEvents(Array.isArray(eventsRes.data?.events) ? eventsRes.data.events : [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shadow-inner`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName || "User"}!</h1>
        <p className="text-indigo-100">Here’s what’s happening in your clubs today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Clubs" value={stats.totalClubs} icon={FiUsers} color="bg-indigo-500" />
        <StatCard title="Upcoming Events" value={stats.totalEvents} icon={FiCalendar} color="bg-green-500" />
        <StatCard title="Total Members" value={stats.totalMembers} icon={FiTrendingUp} color="bg-purple-500" />
        <StatCard
          title={user?.role === "club_head" ? "My Clubs" : "Joined Clubs"}
          value={stats.myClubs}
          icon={FiActivity}
          color="bg-pink-500"
        />
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-2xl p-6 shadow-md animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Events</h2>
          <a href="/events" className="text-indigo-600 hover:text-indigo-800 font-medium transition">
            View all
          </a>
        </div>

        {Array.isArray(recentEvents) && recentEvents.length > 0 ? (
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div
                key={event._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition transform hover:-translate-y-1 duration-200 ease-in-out"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-inner">
                    <FiCalendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.club?.name || "No club"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {event.date ? new Date(event.date).toLocaleDateString() : "Date TBD"}
                  </p>
                  <p className="text-sm text-gray-500">{event.location || "Location TBD"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-500">No recent events found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
