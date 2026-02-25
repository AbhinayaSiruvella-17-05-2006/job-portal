
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  studentEmail: String,
  studentName: String,
  phone: String,
  personal: mongoose.Schema.Types.Mixed,
  education: mongoose.Schema.Types.Mixed,
  experience: mongoose.Schema.Types.Mixed,
  additional: mongoose.Schema.Types.Mixed,
  recruiterQuestions: mongoose.Schema.Types.Mixed,
  resume: String,
  status: {
    type: String,
    default: "pending"
  },
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Application", applicationSchema);