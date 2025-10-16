import User from "../models/User.js";
import Assignment from "../models/Assignment.js";

export const addRecruiter = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Recruiter already exists" });

    const recruiter = await User.create({ name, email, password, role: "recruiter" });
    res.json(recruiter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllData = async (req, res) => {
  const users = await User.find();
  const assignments = await Assignment.find().populate("candidateId recruiterId");
  res.json({ users, assignments });
};
