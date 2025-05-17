const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/authRoutes")

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 5001

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully") // 👈 This is the message
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  })
  .catch((err) => console.log("❌ MongoDB Error:", err))
