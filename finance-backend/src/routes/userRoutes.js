// src/routes/userRoutes.js
const express = require('express');
const { body, param } = require('express-validator');

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

//  All routes require authentication
router.use(protect);

//  Validation rules
const updateValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid user ID'),

  body('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),

  body('role')
    .optional()
    .isIn(['viewer', 'analyst', 'admin'])
    .withMessage('Invalid role'),

  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Invalid status'),

  validate
];

//  ROUTES

//  Get all users (Admin only)
router.get(
  '/',
  authorize('admin'),
  getUsers
);

//  Get single user (Admin only)
router.get(
  '/:id',
  authorize('admin'),
  [
    param('id').isUUID().withMessage('Invalid user ID'),
    validate
  ],
  getUser
);

//  Update user (Admin only)
router.put(
  '/:id',
  authorize('admin'),
  updateValidation,
  updateUser
);

//  Delete user (Admin only)
router.delete(
  '/:id',
  authorize('admin'),
  [
    param('id').isUUID().withMessage('Invalid user ID'),
    validate
  ],
  deleteUser
);

module.exports = router;
