class BaseService {
  constructor (db, entity) {
    this._db = db;
    this._entity = entity;
  }

  fetch () {
    return this._db[this._entity].findAll();
  }

  show (id) {
    return this._db[this._entity].findByPk(id);
  }

  create (entity) {
    return this._db[this._entity].create(entity);
  }

  async update (id, entity) {
    // MySQL
    let status = (await this._db[this._entity].update(entity, { where: { id } } ))[0];
    if (status) {
      return this.show(id);
    } else {
      return null;
    }

    // PostgreSQL
    // return await this._db[this._entity].update(entity, { returning: true, where: { id } } );
  }

  destroy (id) {
    return this._db[this._entity].destroy({ where: { id } } );
  }

}

module.exports = BaseService;
