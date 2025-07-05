import { Link } from "react-router-dom"
import { FiUsers, FiCalendar } from "react-icons/fi"

const ClubCard = ({ club }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{club.name}</h3>
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-200 to-purple-200 text-indigo-800 rounded-full">
            {club.category}
          </span>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{club.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FiUsers className="w-4 h-4 mr-1 text-indigo-500" />
            <span>{club.memberCount || 0} members</span>
          </div>
          <div className="flex items-center">
            <FiCalendar className="w-4 h-4 mr-1 text-purple-500" />
            <span>{club.eventCount || 0} events</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center">
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-inner">
            <span className="text-white text-sm font-semibold">{club.clubHead?.fullName?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{club.clubHead?.fullName}</p>
            <p className="text-xs text-gray-500">Club Head</p>
          </div>
        </div>

        <Link
          to={`/clubs/${club._id}`}
          className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default ClubCard
