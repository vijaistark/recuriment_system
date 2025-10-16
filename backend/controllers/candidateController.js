const path = require('path');
const Candidate = require('../models/Candidate');
const User = require('../models/User');

async function uploadResume(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const filepath = `/uploads/${req.file.filename}`;
    const candidate = await Candidate.findOneAndUpdate(
      { user: req.user.id },
      { resumePath: filepath },
      { new: true }
    );
    res.json({ resumePath: candidate.resumePath });
  } catch (e) {
    res.status(500).json({ message: 'Resume upload failed' });
  }
}

async function setPresence(req, res) {
  try {
    const { present } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { isPresent: !!present }, { new: true });
    res.json({ isPresent: user.isPresent });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update presence' });
  }
}

async function getMyMeeting(req, res) {
  try {
    const candidate = await Candidate.findOne({ user: req.user.id }).populate({
      path: 'assignedRecruiter',
      select: 'meetingLink name',
    });
    if (!candidate || !candidate.assignedRecruiter) return res.json({ meetingLink: null });
    res.json({ meetingLink: candidate.assignedRecruiter.meetingLink, recruiterName: candidate.assignedRecruiter.name });
  } catch (e) {
    res.status(500).json({ message: 'Failed to get meeting' });
  }
}

module.exports = { uploadResume, setPresence, getMyMeeting };


