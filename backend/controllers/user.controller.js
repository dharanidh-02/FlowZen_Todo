const User = require("../models/User.model");

// ─────────────────────────────────────────
// GET /api/user/me  (protected)
// ─────────────────────────────────────────
const getUser = async (req, res) => {
  const { userid } = req.user; // from JWT

  try {
    const user = await User.findById(userid).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("getUser error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─────────────────────────────────────────
// PATCH /api/user/update  (protected)
// ─────────────────────────────────────────
const updateUser = async (req, res) => {
  const { userid } = req.user;

  // Only these fields can be updated directly
  const allowedFields = ["username", "dept", "year", "email", "age", "status", "notes"];
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userid,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    console.error("updateUser error:", err.message);
    // Handle unique constraint violations (MongoDB duplicate key error code 11000)
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email or username already taken" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getUser, updateUser };
