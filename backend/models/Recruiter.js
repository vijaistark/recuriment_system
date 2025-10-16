import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: String,
});

export default mongoose.model("Recruiter", recruiterSchema);
