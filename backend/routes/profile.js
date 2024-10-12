const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const router = express.Router();

// Get the user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  const { name, email, bio, profilePicture } = req.body;
  try {
    console.log("Updating profile for user:", req.user.id);
    console.log("Update data:", { name, email, bio, profilePicture });

    let user = await User.findById(req.user.id);
    if (!user) {
      console.log("User not found:", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }

    if (email) user.email = email;
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    console.log("User before save:", user);
    await user.save();
    console.log("User after save:", user);

    res.json(user);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/user/markRead/:chapter", authMiddleware, async (req, res) => {
  const chapter = Number(req.params.chapter);

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if chapter is already marked as read
    if (user.completed.includes(chapter)) {
      return res
        .status(400)
        .json({ message: "Chapter already marked as read" });
    }

    // Add chapter to completed array
    user.completed.push(chapter);
    await user.save();

    res.json({
      message: `Chapter ${chapter} marked as read`,
      completed: user.completed,
    });
  } catch (error) {
    console.error("Error marking chapter as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
