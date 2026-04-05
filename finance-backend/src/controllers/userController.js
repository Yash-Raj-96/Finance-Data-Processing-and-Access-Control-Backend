// src/controllers/userController.js
const userService = require('../services/userService');

//  GET ALL USERS (with filters + pagination)
const getUsers = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      role: req.query.role,
      search: req.query.search
    };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await userService.getAllUsers(filters, page, limit);

    res.status(200).json({
      success: true,
      count: result.users.length,
      total: result.total,
      page,
      totalPages: Math.ceil(result.total / limit),
      users: result.users
    });

  } catch (error) {
    console.error('Get Users Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

//  GET SINGLE USER
const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = user.toJSON();
    delete userData.password;

    res.status(200).json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Get User Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

//  UPDATE USER
const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = user.toJSON();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: userData
    });

  } catch (error) {
    console.error('Update User Error:', error.message);

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update user'
    });
  }
};

//  DELETE USER (with safety check)
const deleteUser = async (req, res) => {
  try {
    //  Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const deleted = await userService.deleteUser(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete User Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
