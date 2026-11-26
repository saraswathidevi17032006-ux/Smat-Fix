const mongoose = require('mongoose');
const Report = require('../models/Report');

/**
 * Create a new problem report for the authenticated user.
 * POST /api/reports
 */
async function createReport(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(503);
      throw new Error('Database is not connected. Please try again in a moment.');
    }

    const { category, title, location, description, priority } = req.body;

    if (!category || !title || !location || !description) {
      res.status(400);
      throw new Error('Please fill in category, title, location, and description.');
    }

    const report = await Report.create({
      user: req.user._id,
      category: String(category).trim().toLowerCase(),
      title: String(title).trim(),
      location: String(location).trim(),
      description: String(description).trim(),
      priority: ['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium',
    });

    res.status(201).json({
      success: true,
      message: 'Problem report submitted successfully!',
      report,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Fetch all problem reports submitted by the authenticated user.
 * GET /api/reports/my
 */
async function getMyReports(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(503);
      throw new Error('Database is not connected. Please try again in a moment.');
    }

    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReport,
  getMyReports,
};
