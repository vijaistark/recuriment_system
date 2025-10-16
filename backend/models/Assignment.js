import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  gmeetLink: { type: String },
});

export default mongoose.model("Assignment", assignmentSchema);
