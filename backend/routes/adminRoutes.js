const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken, authorizeRoles('admin'));

router.get('/all', admin.getAllData);
router.post('/recruiter', admin.createRecruiter);

module.exports = router;
