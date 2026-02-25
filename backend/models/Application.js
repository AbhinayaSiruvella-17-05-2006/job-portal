const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    studentEmail: {
      type: String,
      required: true,
    },

    studentName: String,
    phone: String,

    personal: Object,
    education: Array,
    experience: Array,
    additional: Object,

    recruiterQuestions: Object,

    resume: String,

    status: {
  type: String,
  enum: [
    "pending",
    "accepted",
    "rejected",
    "offer_accepted",
    "offer_rejected",
  ],
  default: "pending",
},

    offerLetter: {
      type: String,
      default: "",
    },

    // ✅ NEW FIELD FOR PDF OFFER LETTER
    offerPdf: {
      type: String,
      default: "",
    },

    rejectionMessage: {
      type: String,
      default: "",
    },

    acceptedAt: Date,
    rejectedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);