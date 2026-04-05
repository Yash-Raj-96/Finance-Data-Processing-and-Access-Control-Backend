// src/controllers/transactionController.js
const transactionService = require('../services/transactionService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

//  CREATE
const createTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await transactionService.createTransaction(
    req.user.id,
    req.body
  );

  if (!transaction) {
    return next(new AppError('Failed to create transaction', 400));
  }

  res.status(201).json({
    success: true,
    message: 'Transaction created successfully',
    data: transaction
  });
});

//  GET ALL (FILTER + PAGINATION + SEARCH + SORT)
const getTransactions = asyncHandler(async (req, res, next) => {
  const result = await transactionService.getTransactions(
    req.user.id,
    req.query
  );

  res.status(200).json({
    success: true,
    message: 'Transactions fetched successfully',
    data: result
  });
});

//  GET BY ID
const getTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await transactionService.getTransactionById(
    req.params.id,
    req.user.id
  );

  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }

  res.status(200).json({
    success: true,
    data: transaction
  });
});

//  UPDATE
const updateTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await transactionService.updateTransaction(
    req.params.id,
    req.user.id,
    req.body
  );

  if (!transaction) {
    return next(new AppError('Failed to update transaction', 400));
  }

  res.status(200).json({
    success: true,
    message: 'Transaction updated successfully',
    data: transaction
  });
});

//  DELETE
const deleteTransaction = asyncHandler(async (req, res, next) => {
  const softDelete = req.query.permanent !== 'true';

  await transactionService.deleteTransaction(
    req.params.id,
    req.user.id,
    softDelete
  );

  res.status(200).json({
    success: true,
    message: softDelete
      ? 'Transaction moved to trash'
      : 'Transaction permanently deleted'
  });
});

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
};
