import express from "express"
import { body, validationResult } from "express-validator"
import Club from "../models/Club.js"
import User from "../models/User.js"
import Event from "../models/Event.js"
import { authenticate, authorize } from "../middlewares/auth.js"

const router = express.Router()

const allowedCategories = [
  "Academic",
  "Sports",
  "Cultural",
  "Technical",
  "Social Service",
  "Arts",
  "Other",
]

// Get all clubs
router.get("/", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query
    const pageNumber = parseInt(page, 10) || 1
    const limitNumber = parseInt(limit, 10) || 10

    const query = { isActive: true }
    if (category && category !== "All") query.category = category
    if (search) query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ]

    const clubs = await Club.find(query)
      .populate("clubHead", "fullName email")
      .populate("members", "fullName email role")
      .sort({ createdAt: -1 })
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)

    const total = await Club.countDocuments(query)

    res.json({
      clubs,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
      total,
    })
  } catch (error) {
    console.error("Error fetching clubs:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single club
router.get("/:id", authenticate, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("clubHead", "fullName email")
      .populate("members", "fullName email role")

    if (!club) return res.status(404).json({ message: "Club not found" })
    res.json({ club })
  } catch (error) {
    console.error("Error fetching club:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create club (Club Head only)
router.post(
  "/",
  [
    authenticate,
    authorize("club_head"),
    body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Club name must be between 2 and 100 characters"),
    body("description").trim().isLength({ min: 10, max: 1000 }).withMessage("Description must be between 10 and 1000 characters"),
    body("category").isIn(allowedCategories).withMessage(`Category must be one of: ${allowedCategories.join(", ")}`),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", errors: errors.array() })
      }

      const { name, description, category } = req.body

      const existingClub = await Club.findOne({ name: { $regex: `^${name}$`, $options: "i" } })
      if (existingClub) return res.status(400).json({ message: "Club with this name already exists" })

      const club = new Club({
        name,
        description,
        category,
        clubHead: req.user._id,
        members: [req.user._id],
      })

      await club.save()
      await club.populate("clubHead", "fullName email")

      await User.findByIdAndUpdate(req.user._id, { $push: { clubs: club._id } })

      res.status(201).json({ message: "Club created successfully", club })
    } catch (error) {
      console.error("Error creating club:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update club (Club Head only)
router.put(
  "/:id",
  [
    authenticate,
    authorize("club_head"),
    body("name").optional().trim().isLength({ min: 2, max: 100 }).withMessage("Club name must be between 2 and 100 characters"),
    body("description").optional().trim().isLength({ min: 10, max: 1000 }).withMessage("Description must be between 10 and 1000 characters"),
    body("category").optional().isIn(allowedCategories).withMessage(`Category must be one of: ${allowedCategories.join(", ")}`),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", errors: errors.array() })
      }

      const club = await Club.findById(req.params.id)
      if (!club) return res.status(404).json({ message: "Club not found" })

      if (club.clubHead.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Only club head can update the club" })
      }

      const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .populate("clubHead", "fullName email")

      res.json({ message: "Club updated successfully", club: updatedClub })
    } catch (error) {
      console.error("Error updating club:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Delete club (Club Head only)
router.delete("/:id", authenticate, authorize("club_head"), async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
    if (!club) return res.status(404).json({ message: "Club not found" })

    if (club.clubHead.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only club head can delete the club" })
    }

    await Event.deleteMany({ club: club._id })
    await User.updateMany({ clubs: club._id }, { $pull: { clubs: club._id } })
    await Club.findByIdAndDelete(req.params.id)

    res.json({ message: "Club deleted successfully" })
  } catch (error) {
    console.error("Error deleting club:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Join club
router.post("/:id/members", authenticate, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
    if (!club) return res.status(404).json({ message: "Club not found" })

    if (club.members.includes(req.user._id)) {
      return res.status(400).json({ message: "You are already a member of this club" })
    }

    club.members.push(req.user._id)
    await club.save()
    await User.findByIdAndUpdate(req.user._id, { $push: { clubs: club._id } })

    res.json({ message: "Successfully joined the club" })
  } catch (error) {
    console.error("Error joining club:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Leave club
router.delete("/:id/members", authenticate, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
    if (!club) return res.status(404).json({ message: "Club not found" })

    if (club.clubHead.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Club head cannot leave the club" })
    }

    if (!club.members.includes(req.user._id)) {
      return res.status(400).json({ message: "You are not a member of this club" })
    }

    club.members = club.members.filter((member) => member.toString() !== req.user._id.toString())
    await club.save()
    await User.findByIdAndUpdate(req.user._id, { $pull: { clubs: club._id } })

    res.json({ message: "Successfully left the club" })
  } catch (error) {
    console.error("Error leaving club:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get club members
router.get("/:id/members", authenticate, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate("members", "fullName email role")
    if (!club) return res.status(404).json({ message: "Club not found" })

    res.json({ members: club.members })
  } catch (error) {
    console.error("Error fetching club members:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get club events
router.get("/:id/events", authenticate, async (req, res) => {
  try {
    const events = await Event.find({ club: req.params.id })
      .populate("club", "name")
      .populate("createdBy", "fullName email")
      .sort({ date: -1 })

    res.json({ events })
  } catch (error) {
    console.error("Error fetching club events:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
