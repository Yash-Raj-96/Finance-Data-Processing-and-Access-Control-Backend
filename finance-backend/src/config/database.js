// src/config/database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

//  Custom SQL logger (clean & readable)
const sqlLogger = (query) => {
  console.log(`
 ================= SQL QUERY =================
 ${query}
 ============================================\n`);
};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',

    //  Use custom logger
    logging: process.env.NODE_ENV === 'development' ? sqlLogger : false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
