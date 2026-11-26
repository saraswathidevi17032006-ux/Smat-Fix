const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9]{10,15}$/;

/**
 * Generate a signed JWT token for an authenticated user.
 */
function generateToken(userId, role) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('Server configuration error: JWT_SECRET is not set.');
  }

  return jwt.sign({ id: userId, role }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

/**
 * Format safe user data (never includes password).
 */
function formatUserResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    createdAt: user.createdAt,
  };
}

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
async function registerUser(req, res, next) {
  try {
    const { name, email, phone, password, confirmPassword, role } = req.body || {};

    // --- Field validation ---
    if (!name || !name.trim()) {
      res.status(400);
      throw new Error('Name is required.');
    }

    if (name.trim().length < 2) {
      res.status(400);
      throw new Error('Name must be at least 2 characters long.');
    }

    if (!email || !EMAIL_PATTERN.test(email.trim())) {
      res.status(400);
      throw new Error('Please provide a valid email address.');
    }

    if (phone && phone.trim() && !PHONE_PATTERN.test(phone.trim())) {
      res.status(400);
      throw new Error('Please provide a valid phone number (10–15 digits, optionally starting with +).');
    }

    if (!password || password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long.');
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      res.status(400);
      throw new Error('Passwords do not match.');
    }

    // Only allow safe self-registration roles
    const allowedPublicRoles = ['citizen', 'technician'];
    const assignedRole = role && allowedPublicRoles.includes(role) ? role : 'citizen';

    if (role && !allowedPublicRoles.includes(role)) {
      res.status(400);
      throw new Error('Invalid role. Self-registration supports citizen or technician.');
    }

    if (mongoose.connection.readyState !== 1) {
      res.status(503);
      throw new Error('Database is not connected. Please start MongoDB and try again.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      res.status(409);
      throw new Error('An account with this email already exists.');
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      password,
      role: assignedRole,
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to Smart Fix!',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Authenticate user and return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !EMAIL_PATTERN.test(email.trim())) {
      res.status(400);
      throw new Error('Please provide a valid email address.');
    }

    if (!password) {
      res.status(400);
      throw new Error('Password is required.');
    }

    if (mongoose.connection.readyState !== 1) {
      res.status(503);
      throw new Error('Database is not connected. Please start MongoDB and try again.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password.');
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      res.status(401);
      throw new Error('Invalid email or password.');
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Get the currently logged-in user's profile
 * @route   GET /api/auth/me
 * @access  Private (requires Bearer token)
 */
function getCurrentUser(req, res) {
  return res.status(200).json({
    success: true,
    user: formatUserResponse(req.user),
  });
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
