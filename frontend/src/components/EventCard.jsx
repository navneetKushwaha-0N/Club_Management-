import { Link } from "react-router-dom"
import { FiCalendar, FiClock, FiMapPin, FiUsers } from "react-icons/fi"

const EventCard = ({ event }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
          <p className="text-sm text-primary-600 font-medium">{event.club?.name}</p>
        </div>
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
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

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <FiCalendar className="w-4 h-4 mr-2" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <FiClock className="w-4 h-4 mr-2" />
          <span>{formatTime(event.date)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <FiMapPin className="w-4 h-4 mr-2" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <FiUsers className="w-4 h-4 mr-2" />
          <span>{event.attendees?.length || 0} attending</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">Created by {event.createdBy?.fullName}</div>

        <Link to={`/events/${event._id}`} className="btn-primary text-sm">
          View Details
        </Link>
      </div>
    </div>
  )
}

export default EventCard
