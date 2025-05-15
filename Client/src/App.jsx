"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import AdminDashboard from "./components/dashboards/AdminDashboard"
import ClubHeadDashboard from "./components/dashboards/ClubHeadDashboard"
import ParticipantDashboard from "./components/dashboards/ParticipantDashboard"
import "./App.css"

function App() {
  const [user, setUser] = useState({
    isAuthenticated: false,
    userType: null,
    username: null,
  })

  const handleLogin = (username, password, userType) => {
    // In a real app, you would validate credentials against a backend
    // This is just a simple demo
    if (password === "password") {
      setUser({
        isAuthenticated: true,
        userType,
        username,
      })
      return true
    }
    return false
  }

  const handleLogout = () => {
    setUser({
      isAuthenticated: false,
      userType: null,
      username: null,
    })
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user.isAuthenticated ? (
              <Navigate to={`/dashboard/${user.userType?.toLowerCase()}`} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            user.isAuthenticated && user.userType === "admin" ? (
              <AdminDashboard username={user.username || ""} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/dashboard/clubhead"
          element={
            user.isAuthenticated && user.userType === "clubhead" ? (
              <ClubHeadDashboard username={user.username || ""} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/dashboard/participant"
          element={
            user.isAuthenticated && user.userType === "participant" ? (
              <ParticipantDashboard username={user.username || ""} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
