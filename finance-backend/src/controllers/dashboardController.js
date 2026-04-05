// src/controllers/dashboardController.js
const dashboardService = require('../services/dashboardService');

const getSummary = async (req, res) => {
  try {
    const period = req.query.period || 'month';
    const summary = await dashboardService.getSummary(req.user.id, period);
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getTrends = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const trends = await dashboardService.getTrends(req.user.id, months);
    
    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getCategoryAnalytics = async (req, res) => {
  try {
    const analytics = await dashboardService.getCategoryAnalytics(req.user.id);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getSummary,
  getTrends,
  getCategoryAnalytics
};