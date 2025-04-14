const User = require("../models/user");

const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId); // from authMiddleware

    if (!user || !user.is_admin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    next(); // ✅ user is admin, proceed to route
  } catch (err) {
    console.error("Admin check failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = adminOnly;