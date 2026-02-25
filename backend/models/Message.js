const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderEmail: String,
    receiverEmail: String,
    message: String, // Changed from 'text' to 'message'
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);