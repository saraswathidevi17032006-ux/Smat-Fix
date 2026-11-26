const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * Protect private routes by verifying the Bearer JWT token
 * and attaching the authenticated user to req.user.
 */
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Not authorized. Missing or invalid Authorization header.');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500);
      throw new Error('Server configuration error: JWT_SECRET is not set.');
    }

    if (mongoose.connection.readyState !== 1) {
      res.status(503);
      throw new Error('Database is not connected. Please start MongoDB and try again.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error('Not authorized. User no longer exists.');
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(401);
    }
    return next(error);
  }
}

/**
 * Restrict route access to specific user roles (e.g., authorizeRoles('admin')).
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403);
      return next(new Error('Forbidden: You do not have permission to access this resource.'));
    }
    return next();
  };
}

module.exports = {
  protect,
  authorizeRoles,
};
