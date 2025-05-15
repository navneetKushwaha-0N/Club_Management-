const User = require("../models/User")
const bcrypt = require("bcryptjs")

// Signup
exports.signup = async (req, res) => {
  const { username, password, role } = req.body
  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) return res.status(400).json({ message: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, password: hashedPassword, role })
    await newUser.save()
    res.status(201).json({ message: "User created successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// Login
exports.login = async (req, res) => {
  const { username, password, role } = req.body
  try {
    const user = await User.findOne({ username, role })
    if (!user) return res.status(400).json({ message: "User not found" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid password" })

    res.status(200).json({ message: "Login successful", user: { username, role } })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
