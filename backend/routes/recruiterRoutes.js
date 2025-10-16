const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const { setPresence, setMeetingLink, me } = require('../controllers/recruiterController');

router.get('/me', auth(['recruiter']), me);
router.post('/presence', auth(['recruiter']), setPresence);
router.post('/meeting-link', auth(['recruiter']), setMeetingLink);

module.exports = router;


