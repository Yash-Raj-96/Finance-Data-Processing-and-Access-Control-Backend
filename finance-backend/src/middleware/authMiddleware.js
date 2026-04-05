// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  try {
    let token;

    //  Extract token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    //  No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Not authorized'
      });
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Get user (exclude password for safety)
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    //  User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    //  Inactive user (IMPORTANT)
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Contact admin.'
      });
    }

    //  Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth Error:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = { protect };
