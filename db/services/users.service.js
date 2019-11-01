const BaseService = require("./base.service");

class UsersService extends BaseService {
  constructor (db) {
    super(db, "Users");
    this._db = db;
  }

  findOne (config) {
    return this._db[this._entity].findOne(config);
  }
}

module.exports = UsersService;
