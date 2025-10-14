const Recruiter = require('../models/Recruiter');
const Assignment = require('../models/Assignment');
const Candidate = require('../models/Candidate');

exports.getAssignedCandidates = async (req, res) => {
  try {
    const userId = req.user._id;
    const recruiter = await Recruiter.findOne({ user: userId });
    if (!recruiter) return res.status(404).json({ message: 'Recruiter profile not found' });
    const assignments = await Assignment.find({ recruiter: recruiter._id }).populate({ path: 'candidate', populate: { path: 'user' } });
    res.json(assignments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.submitGmeet = async (req, res) => {
  try {
    const userId = req.user._id;
    const recruiter = await Recruiter.findOne({ user: userId });
    if (!recruiter) return res.status(404).json({ message: 'Recruiter profile not found' });
    const { candidateId, gmeetLink } = req.body;
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    const assignment = await Assignment.findOne({ candidate: candidate._id, recruiter: recruiter._id });
    if (!assignment) return res.status(403).json({ message: 'This candidate is not assigned to you' });
    assignment.gmeetLink = gmeetLink;
    await assignment.save();
    res.json({ message: 'GMeet link submitted', assignment });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
