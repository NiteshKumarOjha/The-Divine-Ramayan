const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");
const profileRoutes = require("./routes/profile");
const progressRoutes = require("./routes/progress");
const chapterRoutes = require("./routes/chapter");
const dashboardRoutes = require("./routes/dashboard");
const Chapter = require("./models/Chapter.js");

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Allow your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error seeding chapters:", err));

// Sample route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the Ramayan Storytelling Backend!");
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes); // Profile routes
app.use("/api/progress", progressRoutes); // Progress tracking routes
app.use("/api/chapter", chapterRoutes); // Chapter routes
app.use("/api/dashboard", dashboardRoutes); // Dashboard route

// Server listening on the port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
