// src/models/index.js
//const sequelize = require('../config/database');
const { sequelize } = require('../config/database');

const User = require('./User');
const Transaction = require('./Transaction');

// Associations
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Transaction
};