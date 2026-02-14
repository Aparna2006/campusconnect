const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    photoUrl: {
      type: String,
      default: "",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["student", "admin", "recruiter", "club_coordinator"],
      default: "student",
    },
    settings: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
      applicationAlerts: { type: Boolean, default: true },
      profileVisibility: {
        type: String,
        enum: ["private", "campus", "public"],
        default: "campus",
      },
      showProfilePublic: { type: Boolean, default: true },
      searchableByRecruiters: { type: Boolean, default: true },
      twoFactor: { type: Boolean, default: false },
      theme: {
        type: String,
        enum: ["system", "light", "dark"],
        default: "system",
      },
      language: { type: String, default: "en" },
      timezone: { type: String, default: "UTC" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
