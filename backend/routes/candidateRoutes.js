const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/authMiddleware');
const { uploadResume, setPresence, getMyMeeting } = require('../controllers/candidateController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${base}_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.post('/resume', auth(['candidate']), upload.single('resume'), uploadResume);
router.post('/presence', auth(['candidate']), setPresence);
router.get('/meeting', auth(['candidate']), getMyMeeting);

module.exports = router;


