const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

exports.uploadResumeAndAssign = async (req, res) => {
  try {
    // req.user is the candidate's user
    const userId = req.user._id;
    const candidate = await Candidate.findOne({ user: userId });
    if (!candidate) return res.status(404).json({ message: 'Candidate profile not found' });

    if (!req.file) return res.status(400).json({ message: 'No file' });
    const resumePath = `/uploads/resumes/${req.file.filename}`;
    candidate.resumeUrl = resumePath;
    await candidate.save();

    // Assign randomly if not already assigned
    const existing = await Assignment.findOne({ candidate: candidate._id });
    if (existing) {
      return res.json({ message: 'Resume uploaded, already assigned', candidate, assignment: existing });
    }
    const recruiters = await Recruiter.find();
    if (!recruiters.length) return res.status(400).json({ message: 'No recruiters available' });
    const rand = recruiters[Math.floor(Math.random() * recruiters.length)];
    const assignment = await Assignment.create({ candidate: candidate._id, recruiter: rand._id });
    const populated = await assignment.populate({ path: 'recruiter', populate: { path: 'user' } }).populate({ path: 'candidate', populate: { path: 'user' } });
    res.json({ message: 'Resume uploaded and assigned', candidate, assignment: populated });
  } catch (err) { console.error(err); res.status(500).json({ message: err.message }); }
};

exports.getMyAssignment = async (req, res) => {
  try {
    const userId = req.user._id;
    const candidate = await Candidate.findOne({ user: userId });
    if (!candidate) return res.status(404).json({ message: 'Candidate profile not found' });
    const assignment = await Assignment.findOne({ candidate: candidate._id }).populate({ path: 'recruiter', populate: { path: 'user' } });
    res.json({ candidate, assignment });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
