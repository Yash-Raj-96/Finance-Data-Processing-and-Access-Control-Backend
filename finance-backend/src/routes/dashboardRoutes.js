// src/routes/dashboardRoutes.js
const express = require('express');

const {
  getSummary,
  getTrends,
  getCategoryAnalytics
} = require('../controllers/dashboardController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

//  All routes require authentication
router.use(protect);

//  SUMMARY → Viewer + Analyst + Admin
router.get(
  '/summary',
  authorize('viewer', 'analyst', 'admin'),
  getSummary
);

//  TRENDS → Analyst + Admin
router.get(
  '/trends',
  authorize('analyst', 'admin'),
  getTrends
);

//  CATEGORY ANALYTICS → Analyst + Admin
router.get(
  '/category-analytics',
  authorize('analyst', 'admin'),
  getCategoryAnalytics
);

module.exports = router;
