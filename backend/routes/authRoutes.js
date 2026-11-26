const express = require('express');
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route to verify JWT and fetch the current user
router.get('/me', protect, getCurrentUser);

module.exports = router;
