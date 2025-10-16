const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const { createUser, listStats, assignRandom } = require('../controllers/adminController');

router.post('/users', auth(['admin']), createUser);
router.get('/stats', auth(['admin']), listStats);
router.post('/assign-random', auth(['admin']), assignRandom);

module.exports = router;


