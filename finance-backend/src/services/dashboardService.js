// src/services/dashboardService.js
const { Transaction } = require('../models');
const { Op } = require('sequelize');

class DashboardService {

  //  SUMMARY
  async getSummary(userId, period = 'month') {
    let startDate;
    const now = new Date();

    switch (period) {
      case 'week':
        startDate = new Date(new Date().setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(new Date().setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(new Date().setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(new Date().setMonth(now.getMonth() - 1));
    }

    const transactions = await Transaction.findAll({
      where: {
        userId,
        date: { [Op.gte]: startDate },
        isDeleted: false
      }
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals = {};

    transactions.forEach(transaction => {
      const amount = Number(transaction.amount);

      if (transaction.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpenses += amount;

        if (!categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += amount;
      }
    });

    const netBalance = totalIncome - totalExpenses;

    //  Recent transactions
    const recentTransactions = await Transaction.findAll({
      where: {
        userId,
        isDeleted: false
      },
      order: [['date', 'DESC']],
      limit: 5
    });

    return {
      period,
      totalIncome: totalIncome.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      netBalance: netBalance.toFixed(2),
      transactionCount: transactions.length,
      categoryBreakdown: categoryTotals,
      recentTransactions
    };
  }

  //  MONTHLY TRENDS
  async getTrends(userId, months = 6) {
    const startDate = new Date(
      new Date().setMonth(new Date().getMonth() - months)
    );

    const transactions = await Transaction.findAll({
      where: {
        userId,
        date: { [Op.gte]: startDate },
        isDeleted: false
      },
      order: [['date', 'ASC']]
    });

    const monthlyData = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);

      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          income: 0,
          expenses: 0
        };
      }

      const amount = Number(transaction.amount);

      if (transaction.type === 'income') {
        monthlyData[monthKey].income += amount;
      } else {
        monthlyData[monthKey].expenses += amount;
      }
    });

    const trends = Object.values(monthlyData).map(data => ({
      ...data,
      income: Number(data.income).toFixed(2),
      expenses: Number(data.expenses).toFixed(2),
      netBalance: (data.income - data.expenses).toFixed(2)
    }));

    return {
      months,
      trends: trends.sort((a, b) => a.month.localeCompare(b.month))
    };
  }

  //  CATEGORY ANALYTICS
  async getCategoryAnalytics(userId) {
    const transactions = await Transaction.findAll({
      where: {
        userId,
        type: 'expense',
        isDeleted: false
      },
      attributes: ['category', 'amount']
    });

    const categoryData = {};
    let totalExpenses = 0;

    transactions.forEach(transaction => {
      const amount = Number(transaction.amount);
      totalExpenses += amount;

      if (!categoryData[transaction.category]) {
        categoryData[transaction.category] = 0;
      }
      categoryData[transaction.category] += amount;
    });

    const analytics = Object.entries(categoryData).map(([category, amount]) => ({
      category,
      amount: amount.toFixed(2),
      percentage: totalExpenses
        ? ((amount / totalExpenses) * 100).toFixed(2)
        : '0.00'
    }));

    return {
      totalExpenses: totalExpenses.toFixed(2),
      categories: analytics.sort((a, b) => b.amount - a.amount)
    };
  }
}

module.exports = new DashboardService();
