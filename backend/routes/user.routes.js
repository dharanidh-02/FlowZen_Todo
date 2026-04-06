const express = require("express");
const router = express.Router();
const { getUser, updateUser } = require("../controllers/user.controller");
const { protect } = require("../middleware/authMiddleware");

// GET  /api/user/getuser      — get logged-in user's profile
router.get("/getuser", protect, getUser);

// PATCH /api/user/updateuser — update logged-in user's profile
router.patch("/updateuser", protect, updateUser);

module.exports = router;
