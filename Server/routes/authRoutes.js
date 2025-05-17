const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// Signup route with username and email uniqueness check
router.post("/signup", async (req, res) => {
  console.log("Signup request received:", req.body);

  const { username, password, role, email } = req.body;

  // Basic validation
  if (!username || !password || !role || !email) {
    return res.status(400).json({ success: false, message: "Please provide username, password, role, and email" });
  }

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username or Email already exists" });
    }

    const newUser = new User({ username, password, role, email });
    await newUser.save();

    res.status(201).json({ success: true, message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: "Please provide username, password, and role." });
  }

  try {
    // Find user by username and role
    const user = await User.findOne({ username, role });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or role." });
    }

    // Simple password check (replace with hashed password check in production)
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password." });
    }

    // Login successful, return user data (without password)
    const userData = {
      _id: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
    };

    res.status(200).json({ success: true, message: "Login successful!", user: userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Something went wrong during login." });
  }
});

module.exports = router;
