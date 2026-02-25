const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    recruiterEmail: { type: String, required: true },
    // BASIC JOB INFO (REQUIRED)
    company: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // JOB TYPE
    jobType: {
      type: String,
      enum: ["pdf", "questions"],
      required: true,
    },

    // PDF JOB
    pdfPath: {
      type: String,
      default: "",
    },

    // QUESTION JOB
    eligibility: {
      skills: [String],
      yearOfStudy: String,
      mode: String,
      paidType: String,
      stipendAmount: String,
      duration: String,
      location: {
        country: String,
        state: String,
        city: String,
      },
    },

    questions: [
      {
        questionText: String,
        answerType: String,
        options: [String],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
