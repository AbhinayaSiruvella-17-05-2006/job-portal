import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/job_portal");
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ DB connection failed", error.message);
  }
};

export default connectDB;
