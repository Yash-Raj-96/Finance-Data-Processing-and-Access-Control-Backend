const permissions = {
  viewer: {
    transaction: ['read'],
    user: ['read']
  },
  analyst: {
    transaction: ['read', 'create'],
    user: ['read']
  },
  admin: {
    transaction: ['read', 'create', 'update', 'delete'],
    user: ['read', 'create', 'update', 'delete']
  }
};

module.exports = permissions;
