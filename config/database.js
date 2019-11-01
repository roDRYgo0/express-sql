require("dotenv").config();
module.exports = {
  "development": {
    "username": process.env.USER,
    "password": process.env.PASS,
    "database": process.env.DATABASE_DEV,
    "host": process.env.HOST,
    "dialect": process.env.DIALECT,
    "logging": false,
    "timestamps": false
  },
  "test": {
    "username": process.env.USER,
    "password": process.env.PASS,
    "database": process.env.DATABASE_TEST,
    "host": process.env.HOST,
    "dialect": process.env.DIALECT,
    "logging": false
  },
  "production": {
    "username": process.env.USER,
    "password": process.env.PASS,
    "database": process.env.DATABASE_PRO,
    "host": process.env.HOST,
    "dialect": process.env.DIALECT,
    "logging": false
  }
};
