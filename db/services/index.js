const db = require("../models");

const UsersService = require("./users.service");

module.exports = {
  Users: new UsersService(db)
};
