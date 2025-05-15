"use client"

import { useState } from "react"
import { FaUser, FaLock, FaUserShield, FaUserTie, FaUsers } from "react-icons/fa"

const Login = ({ onLogin, onSignup }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("admin")
  const [error, setError] = useState("")
  const [isSignup, setIsSignup] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    if (isSignup) {
      const success = onSignup(username, password, userType)
      if (!success) {
        setError("Username already exists. Try a different one.")
      }
    } else {
      const success = onLogin(username, password, userType)
      if (!success) {
        setError('Invalid credentials. Try using "password" as the password.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Club Management</h1>
          <p className="text-gray-600 mt-2">{isSignup ? "Create an account" : "Sign in to access your dashboard"}</p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">User Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: "admin", icon: <FaUserShield />, label: "Admin" },
                { type: "clubhead", icon: <FaUserTie />, label: "Club Head" },
                { type: "participant", icon: <FaUsers />, label: "Participant" }
              ].map(({ type, icon, label }) => (
                <button
                  type="button"
                  key={type}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                    userType === type
                      ? "bg-purple-100 border-purple-500 text-purple-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setUserType(type)}
                >
                  <div className="text-xl mb-1">{icon}</div>
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
              />
            </div>
            {!isSignup && <p className="text-xs text-gray-500 mt-1">Hint: Use "password" for demo</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
          >
            {isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="text-center mt-4 text-sm text-gray-600">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignup(!isSignup)
              setError("")
            }}
            className="text-purple-600 hover:underline font-medium"
          >
            {isSignup ? "Sign In" : "Create one"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
