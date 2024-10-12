const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "No Authorization header, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // Assumes 'Bearer TOKEN' format
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully!"); // Debug log
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err); // Debug log
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
