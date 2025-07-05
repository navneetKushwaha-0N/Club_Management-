import express from "express"
import { body, validationResult } from "express-validator"
import Event from "../models/Event.js"
import Club from "../models/Club.js"
import User from "../models/User.js"
import { authenticate, authorize } from "../middlewares/auth.js"

const router = express.Router()

// Get all events
router.get("/", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query

    const query = {}

    if (status && status !== "All") {
      query.status = status
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const events = await Event.find(query)
      .populate("club", "name")
      .populate("createdBy", "fullName email")
      .populate("attendees", "fullName email role")
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Event.countDocuments(query)

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single event
router.get("/:id", authenticate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("club", "name")
      .populate("createdBy", "fullName email")
      .populate("attendees", "fullName email role")

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    res.json({ event })
  } catch (error) {
    console.error("Error fetching event:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create event (Club Head only)
router.post(
  "/",
  [
    authenticate,
    authorize("club_head"),
    body("title").trim().isLength({ min: 2, max: 200 }).withMessage("Event title must be between 2 and 200 characters"),
    body("description")
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Description must be between 10 and 2000 characters"),
    body("date").isISO8601().withMessage("Please provide a valid date"),
    body("location").trim().isLength({ min: 2, max: 200 }).withMessage("Location must be between 2 and 200 characters"),
    body("club").isMongoId().withMessage("Please provide a valid club ID"),
    body("maxAttendees").optional().isInt({ min: 1 }).withMessage("Maximum attendees must be at least 1"),
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

      const { title, description, date, location, club, maxAttendees } = req.body

      // Check if club exists and user is the club head
      const clubDoc = await Club.findById(club)
      if (!clubDoc) {
        return res.status(404).json({ message: "Club not found" })
      }

      if (clubDoc.clubHead.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Only club head can create events for this club" })
      }

      // Check if event date is in the future
      if (new Date(date) <= new Date()) {
        return res.status(400).json({ message: "Event date must be in the future" })
      }

      const event = new Event({
        title,
        description,
        date,
        location,
        club,
        createdBy: req.user._id,
        maxAttendees,
      })

      await event.save()
      await event.populate("club", "name")
      await event.populate("createdBy", "fullName email")

      // Add event to club's events array
      await Club.findByIdAndUpdate(club, {
        $push: { events: event._id },
      })

      res.status(201).json({
        message: "Event created successfully",
        event,
      })
    } catch (error) {
      console.error("Error creating event:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update event (Creator only)
router.put(
  "/:id",
  [
    authenticate,
    body("title")
      .optional()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage("Event title must be between 2 and 200 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Description must be between 10 and 2000 characters"),
    body("date").optional().isISO8601().withMessage("Please provide a valid date"),
    body("location")
      .optional()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage("Location must be between 2 and 200 characters"),
    body("maxAttendees").optional().isInt({ min: 1 }).withMessage("Maximum attendees must be at least 1"),
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

      const event = await Event.findById(req.params.id)
      if (!event) {
        return res.status(404).json({ message: "Event not found" })
      }

      // Check if user is the event creator
      if (event.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Only event creator can update the event" })
      }

      // If updating date, check if it's in the future
      if (req.body.date && new Date(req.body.date) <= new Date()) {
        return res.status(400).json({ message: "Event date must be in the future" })
      }

      const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .populate("club", "name")
        .populate("createdBy", "fullName email")

      res.json({
        message: "Event updated successfully",
        event: updatedEvent,
      })
    } catch (error) {
      console.error("Error updating event:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Delete event (Creator only)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    // Check if user is the event creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only event creator can delete the event" })
    }

    // Remove event from club's events array
    await Club.findByIdAndUpdate(event.club, {
      $pull: { events: event._id },
    })

    // Remove event from users' eventsAttended array
    await User.updateMany({ eventsAttended: event._id }, { $pull: { eventsAttended: event._id } })

    await Event.findByIdAndDelete(req.params.id)

    res.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// RSVP to event
router.post('/:id/rsvp', authenticate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    // Check if event is in the future
    if (new Date(event.date) <= new Date()) {
      return res.status(400).json({ message: 'Cannot RSVP to past events' })
    }

    // Check if user is already attending
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already attending this event' })
    }

    // Check if event has reached maximum capacity
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event has reached maximum capacity' })
    }

    // Add user to event attendees
    event.attendees.push(req.user._id)
    await event.save()

    // Add event to user's eventsAttended array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { eventsAttended: event._id }
    })

    res.json({ message: 'Successfully RSVP\'d to the event' })
  } catch (error) {
    console.error('Error RSVPing to event:', error)
    res.status(500).json({ message: "Server error" })
  }
})

// ✅ DEFAULT EXPORT (IMPORTANT FOR SERVER.JS IMPORT)
export default router;
