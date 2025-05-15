import { FaCalendarAlt, FaUsers, FaCamera, FaTrophy } from "react-icons/fa"
import DashboardLayout from "../layouts/DashboardLayout"

const ParticipantDashboard = ({ username, onLogout }) => {
  const stats = [
    { title: "My Clubs", value: "3", icon: <FaUsers className="text-blue-500" /> },
    { title: "Upcoming Events", value: "5", icon: <FaCalendarAlt className="text-green-500" /> },
    { title: "Submissions", value: "12", icon: <FaCamera className="text-purple-500" /> },
    { title: "Achievements", value: "2", icon: <FaTrophy className="text-yellow-500" /> },
  ]

  return (
    <DashboardLayout title="Participant Dashboard" username={username} userType="Club Participant" onLogout={onLogout}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full p-3 bg-gray-100 mr-4">{stat.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaUsers className="mr-2 text-purple-600" /> My Clubs
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Photography Club</span>
                <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">Active</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Member since Jan 2023 • 3 upcoming events</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Debate Society</span>
                <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">Active</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Member since Mar 2023 • 1 upcoming event</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Chess Club</span>
                <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">Active</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Member since May 2023 • 1 upcoming event</div>
            </div>
          </div>
          <button className="mt-4 text-purple-600 text-sm font-medium flex items-center">
            Explore More Clubs <span className="ml-1">→</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-purple-600" /> Upcoming Events
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Annual Photography Exhibition</span>
                <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">Tomorrow</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Photography Club • Main Hall</div>
              <div className="mt-2">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Attending</span>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Inter-College Debate Competition</span>
                <span className="text-sm bg-purple-100 text-purple-800 py-1 px-2 rounded">Next Week</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Debate Society • Auditorium</div>
              <div className="mt-2">
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Chess Tournament</span>
                <span className="text-sm bg-purple-100 text-purple-800 py-1 px-2 rounded">In 2 Weeks</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Chess Club • Recreation Room</div>
              <div className="mt-2">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Attending</span>
              </div>
            </div>
          </div>
          <button className="mt-4 text-purple-600 text-sm font-medium flex items-center">
            View All Events <span className="ml-1">→</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ParticipantDashboard
