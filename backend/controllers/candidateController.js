import User from "../models/User.js";
import Assignment from "../models/Assignment.js";

export const registerCandidate = async (req, res) => {
  const { name, email, password } = req.body;

  const candidate = await User.create({ name, email, password, role: "candidate" });
  const recruiters = await User.find({ role: "recruiter" });

  if (recruiters.length === 0) {
    return res.status(400).json({ message: "No recruiters available" });
  }

  const randomRecruiter = recruiters[Math.floor(Math.random() * recruiters.length)];

  await Assignment.create({
    candidateId: candidate._id,
    recruiterId: randomRecruiter._id,
  });

  res.json({
    message: "Candidate registered and assigned",
    candidate,
    recruiter: randomRecruiter,
  });
};

export const viewAssignment = async (req, res) => {
  const assignment = await Assignment.findOne({ candidateId: req.user._id }).populate("recruiterId");
  res.json(assignment);
};
