const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    dept:     { type: String, default: null },
    year:     { type: Number, default: null },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    age:      { type: Number, default: null },
    notes:    { type: String, default: "" },
    status:   { type: String, default: "active", enum: ["active", "inactive"] },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("User", userSchema);
