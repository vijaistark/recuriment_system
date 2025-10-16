const User = require('../models/User');

async function setPresence(req, res) {
  try {
    const { present } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { isPresent: !!present }, { new: true });
    res.json({ isPresent: user.isPresent });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update presence' });
  }
}

async function setMeetingLink(req, res) {
  try {
    const { meetingLink } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { meetingLink }, { new: true });
    res.json({ meetingLink: user.meetingLink });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update meeting link' });
  }
}

async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).select('name email isPresent meetingLink');
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load profile' });
  }
}

module.exports = { setPresence, setMeetingLink, me };


