const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Chapter = require("../models/Chapter");
const User = require("../models/User");
const router = express.Router();

// Get all chapters
router.get("/all", async (req, res) => {
  try {
    const chapters = await Chapter.find().sort("chapterNumber"); // Fetch all chapters sorted by chapter number
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single chapter by number
router.get("/:chapterNumber", async (req, res) => {
  try {
    const chapter = await Chapter.findOne({
      chapterNumber: req.params.chapterNumber,
    });
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
