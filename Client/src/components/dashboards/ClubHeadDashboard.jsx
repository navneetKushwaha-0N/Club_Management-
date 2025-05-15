import { FaUsers, FaCalendarAlt, FaClipboardList, FaUserPlus } from "react-icons/fa"
import DashboardLayout from "../layouts/DashboardLayout"

const ClubHeadDashboard = ({ username, onLogout }) => {
  const stats = [
    { title: "Total Members", value: "48", icon: <FaUsers className="text-blue-500" /> },
    { title: "Active Events", value: "3", icon: <FaCalendarAlt className="text-green-500" /> },
    { title: "Pending Requests", value: "12", icon: <FaClipboardList className="text-yellow-500" /> },
    { title: "New Members", value: "5", icon: <FaUserPlus className="text-purple-500" /> },
  ]

  return (
    <DashboardLayout
      title="Club Head Dashboard"
      username={username}
      userType="Photography Club Head"
      onLogout={onLogout}
    >
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
            <FaUsers className="mr-2 text-purple-600" /> Club Members
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Alex Johnson</span>
                <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">Active</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Senior Photographer • Joined 2 years ago</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Sarah Williams</span>
                <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">Active</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Event Coordinator • Joined 1 year ago</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Michael Chen</span>
                <span className="text-sm bg-yellow-100 text-yellow-800 py-1 px-2 rounded">New</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Junior Member • Joined 2 weeks ago</div>
            </div>
          </div>
          <button className="mt-4 text-purple-600 text-sm font-medium flex items-center">
            View All Members <span className="ml-1">→</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-purple-600" /> Club Events
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Annual Photography Exhibition</span>
                <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">Tomorrow</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Main Hall • 42 attendees confirmed</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Photography Workshop</span>
                <span className="text-sm bg-purple-100 text-purple-800 py-1 px-2 rounded">Next Week</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Studio B • 18 attendees confirmed</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <div className="flex justify-between items-center">
                <span className="font-medium">Photo Walk</span>
                <span className="text-sm bg-purple-100 text-purple-800 py-1 px-2 rounded">In 3 Weeks</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">City Park • 24 attendees confirmed</div>
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

export default ClubHeadDashboard
