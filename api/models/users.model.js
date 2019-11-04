const util = require("../util");

const bcrypt = require("bcrypt");

module.exports = {
  serviceName: "Users",
  name: {
    key: "name",
    require: true
  },
  lastName: {
    key: "lastName",
    require: true
  },
  password: {
    key: "password",
    transform: (password) => password ? bcrypt.hash(password, 10) : undefined,
    validate: (password) => util.validatePassword(password),
    require: true
  },
  email: {
    key: "email",
    transform: (email) => email ? email.toLowerCase() : undefined,
    unique: true,
    require: true
  },
  rol: {
    key: "rol",
    default: "user",
    require: false
  }
};
