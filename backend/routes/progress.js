const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const router = express.Router();

// Update progress (e.g., current chapter)
router.put("/progress/chapter", authMiddleware, async (req, res) => {
  const { chapter } = req.body;

  try {
    let user = await User.findById(req.user.id);
    user.progress.currentChapter = chapter;

    await user.save();
    res.json({
      message: "Progress updated successfully",
      progress: user.progress,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a highlight to progress
router.post("/progress/highlight", authMiddleware, async (req, res) => {
  const { chapter, text } = req.body;

  try {
    let user = await User.findById(req.user.id);

    user.progress.highlights.push({ chapter, text });

    await user.save();
    res.json({
      message: "Highlight added successfully",
      highlights: user.progress.highlights,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user progress and highlights
router.get("/progress", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("progress");
    res.json(user.progress);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
