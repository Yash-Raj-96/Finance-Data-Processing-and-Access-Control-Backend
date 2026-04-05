// src/models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [2, 100],
        msg: 'Name must be between 2 and 100 characters'
      }
    }
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email already exists'
    },
    validate: {
      isEmail: {
        msg: 'Invalid email format'
      }
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    }
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: 'Password must be at least 6 characters'
      }
    }
  },

  role: {
    type: DataTypes.ENUM('viewer', 'analyst', 'admin'),
    allowNull: false,
    defaultValue: 'viewer'
  },

  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  },

  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  timestamps: true,

  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['role']
    },
    {
      fields: ['status']
    }
  ],

  hooks: {
    //  Hash password before create/update
    beforeSave: async (user) => {
      if (!user.changed('password')) return;

      const salt = await bcrypt.genSalt(
        parseInt(process.env.BCRYPT_ROUNDS) || 10
      );

      user.password = await bcrypt.hash(user.password, salt);
    }
  }
});

//  Compare password
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

//  Remove sensitive data automatically
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
