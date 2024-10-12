const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: [
    {
      type: String,
      required: true,
    },
  ],
  chapterNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  illustrations: [
    {
      type: String, // Array of URLs to the illustration images
      required: false,
    },
  ],
  highlights: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Chapter", ChapterSchema);
