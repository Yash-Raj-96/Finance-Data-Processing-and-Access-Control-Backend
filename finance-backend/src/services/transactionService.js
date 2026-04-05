// src/services/transactionService.js
const { Transaction } = require('../models');
const { Op } = require('sequelize');

class TransactionService {

  //  CREATE
  async createTransaction(userId, transactionData) {
    const transaction = await Transaction.create({
      ...transactionData,
      userId
    });

    return transaction;
  }

  //  GET ALL (FILTER + SEARCH + PAGINATION + SORT)
  async getTransactions(userId, filters = {}) {
    try {
      const {
        type,
        category,
        search,
        startDate,
        endDate,
        page = 1,
        limit = 10,
        sortBy = 'date',
        order = 'DESC'
      } = filters;

      const where = {
        userId,
        isDeleted: false
      };

      // 🔹 Type filter
      if (type) {
        where.type = type;
      }

      // 🔹 Category filter
      if (category) {
        where.category = category;
      }

      // 🔹 Date filter (range)
      if (startDate && endDate) {
        where.date = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      } else if (startDate) {
        where.date = {
          [Op.gte]: new Date(startDate)
        };
      } else if (endDate) {
        where.date = {
          [Op.lte]: new Date(endDate)
        };
      }

      // 🔹 Search (category + description)
      if (search) {
        where[Op.or] = [
          { category: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // 🔹 Pagination
      const parsedLimit = parseInt(limit) || 10;
      const parsedPage = parseInt(page) || 1;
      const offset = (parsedPage - 1) * parsedLimit;

      // 🔹 Query DB
      const { count, rows } = await Transaction.findAndCountAll({
        where,
        order: [[sortBy, order.toUpperCase()]],
        limit: parsedLimit,
        offset
      });

      return {
        total: count,
        page: parsedPage,
        totalPages: Math.ceil(count / parsedLimit),
        transactions: rows
      };

    } catch (error) {
      throw new Error(error.message);
    }
  }

  //  GET BY ID
  async getTransactionById(id, userId) {
    const transaction = await Transaction.findOne({
      where: {
        id,
        userId,
        isDeleted: false
      }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  //  UPDATE
  async updateTransaction(id, userId, updateData) {
    const transaction = await this.getTransactionById(id, userId);

    const allowedUpdates = [
      'amount',
      'type',
      'category',
      'date',
      'description'
    ];

    const filteredData = {};

    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    await transaction.update(filteredData);

    return transaction;
  }

  //  DELETE (SOFT DELETE DEFAULT)
  async deleteTransaction(id, userId, softDelete = true) {
    const transaction = await this.getTransactionById(id, userId);

    if (softDelete) {
      await transaction.update({
        isDeleted: true,
        deletedAt: new Date()
      });
    } else {
      await transaction.destroy();
    }

    return true;
  }
}

module.exports = new TransactionService();
