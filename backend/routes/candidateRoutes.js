const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const candidate = require('../controllers/candidateController');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads', 'resumes');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.use(verifyToken, authorizeRoles('candidate'));
router.post('/upload-resume', upload.single('resume'), candidate.uploadResumeAndAssign);
router.get('/my-assignment', candidate.getMyAssignment);

module.exports = router;
