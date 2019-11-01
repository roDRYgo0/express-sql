const bcrypt = require("bcrypt");

module.exports = {
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
    require: true
  },
  email: {
    key: "email",
    transform: (email) => email ? email.toLowerCase() : undefined,
    require: true
  },
  rol: {
    key: "rol",
    default: "user",
    require: false
  }
};
