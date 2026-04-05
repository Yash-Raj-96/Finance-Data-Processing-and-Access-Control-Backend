// src/middleware/roleMiddleware.js

const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      //  No user attached (auth middleware missing)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized. No user found'
        });
      }

      //  Role not allowed
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Role (${req.user.role}) is not allowed to access this resource`
        });
      }

      //  Allowed
      next();
    } catch (error) {
      console.error('Role Middleware Error:', error.message);

      return res.status(500).json({
        success: false,
        message: 'Server error in role authorization'
      });
    }
  };
};

module.exports = { authorize };
