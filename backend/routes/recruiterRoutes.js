const express = require('express');
const router = express.Router();
const recruiter = require('../controllers/recruiterController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken, authorizeRoles('recruiter'));
router.get('/assigned', recruiter.getAssignedCandidates);
router.post('/submit-gmeet', recruiter.submitGmeet);

module.exports = router;
