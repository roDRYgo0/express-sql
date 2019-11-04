class BaseService {
  constructor (db, model) {
    this._db = db;
    this._model = model;
  }

  fetch (options = {}) {
    return this._db[this._model].findAll(options);
  }

  show (id, options = {}) {
    return this._db[this._model].findByPk(id, options);
  }

  async create (model, options = {}) {
    let result = await this._db[this._model].create(model);
    if (result.id) {
      return this.show(result.id, options);
    } else {
      return result;
    }
  }

  async update (id, model, options = {}) {
    // MySQL
    let status = (await this._db[this._model].update(model, { where: { id } } ))[0];
    if (status) {
      return this.show(id, options);
    } else {
      return null;
    }

    // PostgreSQL
    // return await this._db[this._model].update(model, { returning: true, where: { id }, options } );
  }

  findOne (config) {
    return this._db[this._model].findOne(config);
  }

  destroy (id) {
    return this._db[this._model].destroy({ where: { id } } );
  }

}

module.exports = BaseService;
