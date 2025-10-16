import Assignment from "../models/Assignment.js";

export const getAssignedCandidates = async (req, res) => {
  const assignments = await Assignment.find({ recruiterId: req.user._id }).populate("candidateId");
  res.json(assignments);
};

export const addGmeetLink = async (req, res) => {
  const { assignmentId, gmeetLink } = req.body;
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) return res.status(404).json({ message: "Assignment not found" });
  if (assignment.recruiterId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Unauthorized" });

  assignment.gmeetLink = gmeetLink;
  await assignment.save();
  res.json({ message: "GMeet link added successfully" });
};
