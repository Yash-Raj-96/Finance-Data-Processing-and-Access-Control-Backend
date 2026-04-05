// src/services/userService.js
const { User, Transaction } = require('../models');
const { Op } = require('sequelize');

class UserService {
  async getAllUsers(filters = {}) {
    const where = {};
    
    if (filters.status) where.status = filters.status;
    if (filters.role) where.role = filters.role;
    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }
    
    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      include: [{
        model: Transaction,
        as: 'transactions',
        required: false,
        where: { isDeleted: false },
        attributes: ['id', 'amount', 'type', 'category', 'date']
      }]
    });
    
    return users;
  }
  
  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Transaction,
        as: 'transactions',
        where: { isDeleted: false },
        required: false,
        attributes: ['id', 'amount', 'type', 'category', 'date', 'description']
      }]
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
  
  async updateUser(id, updateData) {
    const user = await User.findByPk(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Don't allow updating sensitive fields through this method
    const allowedUpdates = ['name', 'role', 'status'];
    const filteredData = {};
    
    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });
    
    await user.update(filteredData);
    
    return user;
  }
  
  async deleteUser(id) {
    const user = await User.findByPk(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    await user.destroy();
    return true;
  }
  
  async createUser(userData) {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const user = await User.create(userData);
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;
    
    return userWithoutPassword;
  }
}

module.exports = new UserService();