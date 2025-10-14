const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/login', auth.login);
router.post('/register/admin', auth.registerAdmin);
router.post('/register/recruiter', auth.registerRecruiter);
router.post('/register/candidate', auth.registerCandidate);

module.exports = router;
