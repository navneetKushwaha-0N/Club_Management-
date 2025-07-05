"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi"
import axios from "axios"

const SignupForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      await axios.post("http://localhost:5001/api/auth/register", formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      navigate("/login")
    } catch (err) {
      console.error("API error response:", err.response?.data)
      const backendError = err.response?.data
      if (backendError?.errors && Array.isArray(backendError.errors)) {
        setError(backendError.errors[0].msg)
      } else {
        setError(backendError?.message || "Registration failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500/40 via-indigo-500/40 to-blue-500/40">
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md transition duration-500">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Or{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg shadow-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <div className="relative mt-1">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full py-3 pl-10 pr-4 bg-white/30 dark:bg-gray-900/40 text-gray-900 dark:text-gray-100 placeholder-gray-600 placeholder:italic rounded-xl border border-white/50 dark:border-gray-600 backdrop-blur-md transition-all duration-300 focus:ring-4 focus:ring-indigo-400/50 focus:scale-[1.02] outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <div className="relative mt-1">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full py-3 pl-10 pr-4 bg-white/30 dark:bg-gray-900/40 text-gray-900 dark:text-gray-100 placeholder-gray-600 placeholder:italic rounded-xl border border-white/50 dark:border-gray-600 backdrop-blur-md transition-all duration-300 focus:ring-4 focus:ring-indigo-400/50 focus:scale-[1.02] outline-none"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <div className="relative mt-1">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full py-3 pl-3 pr-10 bg-white/30 dark:bg-gray-900/40 text-gray-900 dark:text-gray-100 placeholder-gray-600 placeholder:italic rounded-xl border border-white/50 dark:border-gray-600 backdrop-blur-md appearance-none transition-all duration-300 focus:ring-4 focus:ring-indigo-400/50 focus:scale-[1.02] outline-none"
              >
                <option value="student">Student</option>
                <option value="club_head">Club Head</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full py-3 pl-10 pr-10 bg-white/30 dark:bg-gray-900/40 text-gray-900 dark:text-gray-100 placeholder-gray-600 placeholder:italic rounded-xl border border-white/50 dark:border-gray-600 backdrop-blur-md transition-all duration-300 focus:ring-4 focus:ring-indigo-400/50 focus:scale-[1.02] outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="w-full py-3 pl-10 pr-10 bg-white/30 dark:bg-gray-900/40 text-gray-900 dark:text-gray-100 placeholder-gray-600 placeholder:italic rounded-xl border border-white/50 dark:border-gray-600 backdrop-blur-md transition-all duration-300 focus:ring-4 focus:ring-indigo-400/50 focus:scale-[1.02] outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupForm
