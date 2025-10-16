const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Candidate = require('../models/Candidate');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );
    let candidate = null;
    if (user.role === 'candidate') {
      candidate = await Candidate.findOne({ user: user._id }).select('resumePath assignedRecruiter');
    }
    res.json({
      token,
      user: { id: user._id, role: user.role, name: user.name, email: user.email, isPresent: user.isPresent, meetingLink: user.meetingLink },
      candidate,
    });
  } catch (e) {
    res.status(500).json({ message: 'Login failed' });
  }
}

module.exports = { login };


