const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "",
  },
  // Array to store completed chapters
  completed: {
    type: [Number], // List of completed chapter numbers
    default: [], // Initially, no chapters are marked as completed
  },
});

module.exports = mongoose.model("User", UserSchema);
