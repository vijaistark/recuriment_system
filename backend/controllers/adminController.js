const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Candidate = require('../models/Candidate');

async function createUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!['recruiter', 'candidate'].includes(role)) {
      return res.status(400).json({ message: 'Role must be recruiter or candidate' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role });
    if (role === 'candidate') {
      await Candidate.create({ user: user._id });
    }
    res.status(201).json({ id: user._id });
  } catch (e) {
    res.status(500).json({ message: 'Create user failed' });
  }
}

async function listStats(req, res) {
  try {
    const [recruiterPresent, recruiterAbsent, candidatePresent, candidateAbsent] = await Promise.all([
      User.countDocuments({ role: 'recruiter', isPresent: true }),
      User.countDocuments({ role: 'recruiter', isPresent: false }),
      User.countDocuments({ role: 'candidate', isPresent: true }),
      User.countDocuments({ role: 'candidate', isPresent: false }),
    ]);
    res.json({ recruiterPresent, recruiterAbsent, candidatePresent, candidateAbsent });
  } catch (e) {
    res.status(500).json({ message: 'Stats failed' });
  }
}

async function assignRandom(req, res) {
  try {
    // assign each candidate without assignedRecruiter to a random present recruiter
    const recruiters = await User.find({ role: 'recruiter', isPresent: true }).select('_id');
    if (!recruiters.length) return res.status(400).json({ message: 'No present recruiters available' });
    const candidates = await Candidate.find({ assignedRecruiter: { $exists: false } });
    for (const cand of candidates) {
      const random = recruiters[Math.floor(Math.random() * recruiters.length)]._id;
      cand.assignedRecruiter = random;
      await cand.save();
    }
    res.json({ assigned: candidates.length });
  } catch (e) {
    res.status(500).json({ message: 'Assignment failed' });
  }
}

module.exports = { createUser, listStats, assignRandom };


