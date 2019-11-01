class BaseService {
  constructor (db, entity) {
    this._db = db;
    this._entity = entity;
  }

  fetch (options = {}) {
    return this._db[this._entity].findAll(options);
  }

  show (id, options = {}) {
    return this._db[this._entity].findByPk(id, options);
  }

  async create (entity, options = {}) {
    let result = await this._db[this._entity].create(entity);
    if (result.id) {
      return this.show(result.id, options);
    } else {
      return result;
    }
  }

  async update (id, entity, options = {}) {
    // MySQL
    let status = (await this._db[this._entity].update(entity, { where: { id } } ))[0];
    if (status) {
      return this.show(id, options);
    } else {
      return null;
    }

    // PostgreSQL
    // return await this._db[this._entity].update(entity, { returning: true, where: { id }, options } );
  }

  destroy (id) {
    return this._db[this._entity].destroy({ where: { id } } );
  }

}

module.exports = BaseService;
