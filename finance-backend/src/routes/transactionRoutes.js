// src/routes/transactionRoutes.js
const express = require('express');
const { body } = require('express-validator');

const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

//  Apply authentication to all routes
router.use(protect);

//  VALIDATION RULES

const createValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),

  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be income or expense'),

  body('category')
    .notEmpty()
    .withMessage('Category is required'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description too long'),

  validate
];

const updateValidation = [
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),

  body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be income or expense'),

  body('category')
    .optional()
    .notEmpty()
    .withMessage('Category cannot be empty'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description too long'),

  validate
];

//  ROUTES

//  CREATE (Analyst + Admin)
router.post(
  '/',
  authorize('analyst', 'admin'),
  checkPermission('transaction', 'create'),
  createValidation,
  createTransaction
);

//  GET ALL (Viewer + Analyst + Admin)
router.get(
  '/',
  authorize('viewer', 'analyst', 'admin'),
  checkPermission('transaction', 'read'),
  getTransactions
);

//  GET SINGLE
router.get(
  '/:id',
  authorize('viewer', 'analyst', 'admin'),
  checkPermission('transaction', 'read'),
  getTransaction
);

//  UPDATE (Analyst + Admin)
router.put(
  '/:id',
  authorize('analyst', 'admin'),
  checkPermission('transaction', 'update'),
  updateValidation,
  updateTransaction
);

//  DELETE (Admin ONLY )
router.delete(
  '/:id',
  authorize('admin'),
  checkPermission('transaction', 'delete'),
  deleteTransaction
);

module.exports = router;
