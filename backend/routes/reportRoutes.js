const express = require('express');
const { createReport, getMyReports } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected problem reporting routes
router.post('/', protect, createReport);
router.get('/my', protect, getMyReports);

module.exports = router;
