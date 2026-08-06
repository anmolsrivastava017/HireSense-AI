const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  strengths: [String],
  weaknesses: [String],
  suggestions: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", resumeSchema);