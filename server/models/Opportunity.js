const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: "Campus Organization",
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["internship", "hackathon", "event", "project", "job"],
      default: "internship",
    },
    location: {
      type: String,
      default: "On-campus",
    },
    logo: {
      type: String,
      default: null,
    },
    skillsRequired: {
      type: [String],
      required: true,
      default: [],
    },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "closed", "interview_scheduled"],
      default: "open",
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);
