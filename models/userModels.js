const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,       // FIX: prevent duplicate accounts with same email
      lowercase: true,    // FIX: normalize so "A@x.com" and "a@x.com" don't collide
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"], // FIX: basic safety
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    notifcation: {
      type: Array,
      default: [],
    },
    seennotification: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true } // FIX: adds createdAt / updatedAt automatically — useful for admin dashboards
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;