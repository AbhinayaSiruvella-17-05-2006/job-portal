const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientEmail: String,   // who receives notification
    senderEmail: String,      // who triggered it
    type: String,             // "application", "accepted", "rejected", "new_job"
    message: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);