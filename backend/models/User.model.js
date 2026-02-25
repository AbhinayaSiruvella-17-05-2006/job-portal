import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["student", "recruiter"]
  },
  companyName: String
});

export default mongoose.model("User", userSchema);
