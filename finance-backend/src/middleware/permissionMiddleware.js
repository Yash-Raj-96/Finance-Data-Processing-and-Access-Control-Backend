const permissions = require('../config/permissions');

const checkPermission = (resource, action) => {
  return (req, res, next) => {
    const role = req.user.role;

    const rolePermissions = permissions[role];

    if (!rolePermissions || !rolePermissions[resource]) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!rolePermissions[resource].includes(action)) {
      return res.status(403).json({
        success: false,
        message: `Permission denied: ${role} cannot ${action} ${resource}`
      });
    }

    next();
  };
};

module.exports = { checkPermission };
