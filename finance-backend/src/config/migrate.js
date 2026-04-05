// src/config/migrate.js
const { sequelize } = require('../models');

const migrate = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    await sequelize.sync({ force: true });
    console.log('Database synchronized with force option.');
    
    // Create default admin user
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin123!', salt);
    
    await sequelize.query(`
      INSERT INTO "Users" (id, name, email, password, role, status, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        'Admin User',
        'admin@finance.com',
        '${hashedPassword}',
        'admin',
        'active',
        NOW(),
        NOW()
      )
    `);
    
    console.log('Default admin user created (email: admin@finance.com, password: Admin123!)');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();