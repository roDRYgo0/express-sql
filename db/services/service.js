const BaseService = require("./base.service");

class Service extends BaseService {
  constructor (db, model) {
    super(db, model);
    this._db = db;
    this._op = db.Sequelize.Op;
  }
}

module.exports = Service;
