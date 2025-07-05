import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: [true, "Club is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Event creator is required"],
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    maxAttendees: {
      type: Number,
      min: [1, "Maximum attendees must be at least 1"],
    },
  },
  {
    timestamps: true,
  },
)

// Update status based on date
eventSchema.pre("find", function () {
  this.populate("club", "name")
  this.populate("createdBy", "fullName email")
})

eventSchema.pre("findOne", function () {
  this.populate("club", "name")
  this.populate("createdBy", "fullName email")
  this.populate("attendees", "fullName email role")
})

// Add virtual for attendee count
eventSchema.virtual("attendeeCount").get(function () {
  return this.attendees ? this.attendees.length : 0
})

// Ensure virtuals are included in JSON
eventSchema.set("toJSON", { virtuals: true })
eventSchema.set("toObject", { virtuals: true })

export default mongoose.model("Event", eventSchema)
