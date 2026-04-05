// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const userService = require('../services/userService');

//  Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

//  REGISTER
const register = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    const token = generateToken(user.id);

    const userData = user.toJSON();
    delete userData.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Register Error:', error.message);

    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

//  LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Check input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    //  Find user
    const user = await User.findOne({ where: { email } });

    //  Invalid credentials
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    //  Inactive user
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Contact admin.'
      });
    }

    //  Update last login
    await user.update({ lastLogin: new Date() });

    //  Generate token
    const token = generateToken(user.id);

    const userData = user.toJSON();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

//  GET CURRENT USER
const getMe = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);

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
    console.error('GetMe Error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
