import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resume: String,
  skills: [String],
});

export default mongoose.model("Candidate", candidateSchema);
