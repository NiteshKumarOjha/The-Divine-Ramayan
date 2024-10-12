const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Chapter = require("../models/Chapter");
const router = express.Router();

// Get user dashboard info
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const chapters = await Chapter.find();
    const currentChapter = user.progress.currentChapter;

    const userHighlights = chapters.reduce((acc, chapter) => {
      const chapterHighlights = chapter.highlights.filter(
        (h) => h.userId.toString() === user.id
      );
      if (chapterHighlights.length) {
        acc.push({
          chapterNumber: chapter.chapterNumber,
          highlights: chapterHighlights,
        });
      }
      return acc;
    }, []);

    res.json({
      user,
      currentChapter,
      userHighlights,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
