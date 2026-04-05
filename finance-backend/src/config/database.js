// src/config/database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Custom SQL logger (clean & readable)
const sqlLogger = (query) => {
  console.log(`
 ================= SQL QUERY =================
${query}
 ============================================\n`);
};

let sequelize;

if (process.env.DATABASE_URL) {
  //  CLOUD (Neon / Render / Production)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',

    logging: process.env.NODE_ENV === 'development' ? sqlLogger : false,

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // required for Neon/Render
      },
    },

    pool: {
      max: 10,        // slightly increased for production
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    retry: {
      max: 3,         // auto-retry connection (helps in cloud)
    },
  });

} else {
  //  LOCAL (development)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',

      logging: process.env.NODE_ENV === 'development' ? sqlLogger : false,

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Database connected successfully');
  } catch (error) {
    console.error(' Unable to connect to database:', error.message);
    process.exit(1); // stop app if DB fails
  }
};

module.exports = { sequelize, connectDB };
