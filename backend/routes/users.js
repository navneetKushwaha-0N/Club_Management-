import express from "express"
import { body, validationResult } from "express-validator"
import User from "../models/User.js"
import { authenticate } from "../middlewares/auth.js"

const router = express.Router()

// Get all users (for members page)
router.get("/", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query

    const query = {}

    if (role && role !== "All") {
      query.role = role
    }

    if (search) {
      query.$or = [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    const users = await User.find(query)
      .select("-password")
      .populate("clubs", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single user profile
router.get("/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("clubs", "name category")
      .populate("eventsAttended", "title date location")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Users can only view their own profile or club heads can view members
    if (req.user._id.toString() !== user._id.toString() && req.user.role !== "club_head") {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json({ user })
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put(
  "/:id",
  [
    authenticate,
    body("fullName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Full name must be between 2 and 100 characters"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Please provide a valid email"),
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

      // Users can only update their own profile
      if (req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "You can only update your own profile" })
      }

      const { fullName, email } = req.body

      // Check if email is already taken by another user
      if (email) {
        const existingUser = await User.findOne({
          email,
          _id: { $ne: req.params.id },
        })
        if (existingUser) {
          return res.status(400).json({ message: "Email is already taken" })
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { fullName, email },
        { new: true, runValidators: true },
      ).select("-password")

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      })
    } catch (error) {
      console.error("Error updating user:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Delete user account
router.delete("/:id", authenticate, async (req, res) => {
  try {
    // Users can only delete their own account
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "You can only delete your own account" })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // If user is a club head, check if they have active clubs
    if (user.role === "club_head") {
      const Club = (await import("../models/Club.js")).default
      const activeClubs = await Club.find({ clubHead: user._id, isActive: true })

      if (activeClubs.length > 0) {
        return res.status(400).json({
          message:
            "Cannot delete account. You are the head of active clubs. Please transfer ownership or delete the clubs first.",
        })
      }
    }

    await User.findByIdAndDelete(req.params.id)

    res.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user's clubs
router.get("/:id/clubs", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "clubs",
      populate: {
        path: "clubHead",
        select: "fullName email",
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Users can only view their own clubs or club heads can view member clubs
    if (req.user._id.toString() !== user._id.toString() && req.user.role !== "club_head") {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json({ clubs: user.clubs })
  } catch (error) {
    console.error("Error fetching user clubs:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user's events
router.get("/:id/events", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "eventsAttended",
      populate: [
        { path: "club", select: "name" },
        { path: "createdBy", select: "fullName email" },
      ],
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Users can only view their own events
    if (req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json({ events: user.eventsAttended })
  } catch (error) {
    console.error("Error fetching user events:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Change password
router.put(
  "/:id/password",
  [
    authenticate,
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
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

      // Users can only change their own password
      if (req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "You can only change your own password" })
      }

      const { currentPassword, newPassword } = req.body

      const user = await User.findById(req.params.id)
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword)
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" })
      }

      // Update password
      user.password = newPassword
      await user.save()

      res.json({ message: "Password updated successfully" })
    } catch (error) {
      console.error("Error changing password:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

export default router
