const User = require('../models/User');
const Recruiter = require('../models/Recruiter');
const Candidate = require('../models/Candidate');
const Assignment = require('../models/Assignment');
const bcrypt = require('bcryptjs');

exports.getAllData = async (req, res) => {
  try {
    const users = await User.find().lean();
    const recruiters = await Recruiter.find().populate('user').lean();
    const candidates = await Candidate.find().populate('user').lean();
    const assignments = await Assignment.find().populate({ path: 'candidate', populate: { path: 'user' } }).populate({ path: 'recruiter', populate: { path: 'user' } }).lean();
    res.json({ users, recruiters, candidates, assignments });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createRecruiter = async (req, res) => {
  try {
    const { name, email, password, company, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash, role: 'recruiter' });
    const recruiter = await Recruiter.create({ user: user._id, company, phone });
    res.json({ message: 'Recruiter added', recruiter });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
