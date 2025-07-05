import { FiMail } from "react-icons/fi"

const MemberItem = ({ member, showRole = true }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium">{member.fullName?.charAt(0)?.toUpperCase()}</span>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{member.fullName}</h4>
          <div className="flex items-center text-sm text-gray-500">
            <FiMail className="w-3 h-3 mr-1" />
            <span>{member.email}</span>
          </div>
        </div>
      </div>

      {showRole && (
        <div className="flex items-center">
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              member.role === "club_head" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
            }`}
          >
            {member.role === "club_head" ? "Club Head" : "Student"}
          </span>
        </div>
      )}
    </div>
  )
}

export default MemberItem
