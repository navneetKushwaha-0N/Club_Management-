import express from "express"
import { body, validationResult } from "express-validator"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router()

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  })
}

// Register user
router.post(
  "/register",
  [
    body("fullName")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Full name must be between 2 and 100 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("role").isIn(["student", "club_head"]).withMessage("Role must be either student or club_head"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { fullName, email, password, role } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          message: "User with this email already exists",
        })
      }

      // Create new user
      const user = new User({
        fullName,
        email,
        password,
        role,
      })

      await user.save()

      // Generate token
      const token = generateToken(user._id)

      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        token,
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({
        message: "Server error during registration",
      })
    }
  },
)

// Login user
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
    body("role").isIn(["student", "club_head"]).withMessage("Role must be either student or club_head"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { email, password, role } = req.body

      // Find user by email and role
      const user = await User.findOne({ email, role })
      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials or role",
        })
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid credentials",
        })
      }

      // Generate token
      const token = generateToken(user._id)

      res.json({
        message: "Login successful",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        token,
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({
        message: "Server error during login",
      })
    }
  },
)

export default router
