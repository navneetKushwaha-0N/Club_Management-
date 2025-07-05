import mongoose from "mongoose"

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Club name is required"],
      trim: true,
      maxlength: [100, "Club name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Club description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Club category is required"],
      enum: ["Academic", "Sports", "Cultural", "Technical", "Social Service", "Arts", "Other"],
    },
    clubHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Club head is required"],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Add virtual for member count
clubSchema.virtual("memberCount").get(function () {
  return this.members ? this.members.length : 0
})

// Add virtual for event count
clubSchema.virtual("eventCount").get(function () {
  return this.events ? this.events.length : 0
})

// Ensure virtuals are included in JSON
clubSchema.set("toJSON", { virtuals: true })
clubSchema.set("toObject", { virtuals: true })

export default mongoose.model("Club", clubSchema)
