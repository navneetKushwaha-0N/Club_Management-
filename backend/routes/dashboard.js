import express from "express"
import Club from "../models/Club.js"
import Event from "../models/Event.js"
import User from "../models/User.js"
import { authenticate } from "../middlewares/auth.js"

const router = express.Router()

// Get dashboard statistics
router.get("/stats", authenticate, async (req, res) => {
  try {
    const userId = req.user._id
    const userRole = req.user.role

    // Get total counts
    const totalClubs = await Club.countDocuments({ isActive: true })
    const totalEvents = await Event.countDocuments({
      date: { $gte: new Date() },
      status: { $in: ["upcoming", "ongoing"] },
    })
    const totalMembers = await User.countDocuments()

    // Get user-specific stats
    let myClubs = 0
    if (userRole === "club_head") {
      // Count clubs where user is the head
      myClubs = await Club.countDocuments({
        clubHead: userId,
        isActive: true,
      })
    } else {
      // Count clubs user has joined
      const user = await User.findById(userId).populate("clubs")
      myClubs = user.clubs ? user.clubs.length : 0
    }

    // Get recent activity stats
    const recentClubs = await Club.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
      isActive: true,
    })

    const recentEvents = await Event.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
    })

    const upcomingEvents = await Event.countDocuments({
      date: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
      },
      status: "upcoming",
    })

    res.json({
      totalClubs,
      totalEvents,
      totalMembers,
      myClubs,
      recentClubs,
      recentEvents,
      upcomingEvents,
      userRole,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get recent activities for dashboard
router.get("/activities", authenticate, async (req, res) => {
  try {
    const userId = req.user._id
    const limit = Number.parseInt(req.query.limit) || 10

    // Get recent clubs
    const recentClubs = await Club.find({ isActive: true })
      .populate("clubHead", "fullName")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name category createdAt clubHead")

    // Get recent events
    const recentEvents = await Event.find()
      .populate("club", "name")
      .populate("createdBy", "fullName")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title date location club createdBy createdAt")

    // Get user's upcoming events
    const userEvents = await Event.find({
      $or: [{ attendees: userId }, { createdBy: userId }],
      date: { $gte: new Date() },
    })
      .populate("club", "name")
      .sort({ date: 1 })
      .limit(5)
      .select("title date location club status")

    res.json({
      recentClubs,
      recentEvents,
      userEvents,
    })
  } catch (error) {
    console.error("Error fetching dashboard activities:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user's personalized dashboard data
router.get("/personal", authenticate, async (req, res) => {
  try {
    const userId = req.user._id
    const userRole = req.user.role

    let personalData = {}

    if (userRole === "club_head") {
      // Get clubs managed by this user
      const managedClubs = await Club.find({
        clubHead: userId,
        isActive: true,
      })
        .populate("members", "fullName")
        .select("name category members events createdAt")

      // Get events created by this user
      const createdEvents = await Event.find({ createdBy: userId })
        .populate("club", "name")
        .populate("attendees", "fullName")
        .sort({ date: -1 })
        .limit(10)

      personalData = {
        managedClubs,
        createdEvents,
        totalMembersManaged: managedClubs.reduce((total, club) => total + club.members.length, 0),
        totalEventsCreated: createdEvents.length,
      }
    } else {
      // Get clubs joined by this user
      const user = await User.findById(userId)
        .populate({
          path: "clubs",
          populate: { path: "clubHead", select: "fullName" },
        })
        .populate("eventsAttended")

      // Get upcoming events for joined clubs
      const upcomingClubEvents = await Event.find({
        club: { $in: user.clubs.map((club) => club._id) },
        date: { $gte: new Date() },
      })
        .populate("club", "name")
        .sort({ date: 1 })
        .limit(10)

      personalData = {
        joinedClubs: user.clubs,
        attendedEvents: user.eventsAttended,
        upcomingClubEvents,
        totalClubsJoined: user.clubs.length,
        totalEventsAttended: user.eventsAttended.length,
      }
    }

    res.json(personalData)
  } catch (error) {
    console.error("Error fetching personal dashboard data:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get club statistics (for club heads)
router.get("/club-stats/:clubId", authenticate, async (req, res) => {
  try {
    const { clubId } = req.params
    const userId = req.user._id

    // Verify user is the club head
    const club = await Club.findById(clubId)
    if (!club) {
      return res.status(404).json({ message: "Club not found" })
    }

    if (club.clubHead.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied. Only club head can view these statistics." })
    }

    // Get club statistics
    const memberCount = club.members.length
    const eventCount = await Event.countDocuments({ club: clubId })
    const upcomingEventCount = await Event.countDocuments({
      club: clubId,
      date: { $gte: new Date() },
      status: "upcoming",
    })

    // Get member growth over time (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const memberGrowth = await User.aggregate([
      {
        $match: {
          clubs: club._id,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ])

    // Get event attendance statistics
    const eventStats = await Event.aggregate([
      {
        $match: { club: club._id },
      },
      {
        $project: {
          title: 1,
          date: 1,
          attendeeCount: { $size: "$attendees" },
          status: 1,
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $limit: 10,
      },
    ])

    res.json({
      clubId,
      clubName: club.name,
      memberCount,
      eventCount,
      upcomingEventCount,
      memberGrowth,
      eventStats,
      clubCreatedAt: club.createdAt,
    })
  } catch (error) {
    console.error("Error fetching club statistics:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
