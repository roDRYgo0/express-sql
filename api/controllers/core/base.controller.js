const Models = require("../../models");
const Services = require("../../../db/services");

const util = require("../../util");
const objectMapper = require("object-mapper");

class BaseController {
  constructor (entity, attributes = null, include = null) {
    this.service = Services[entity];
    this.entity = entity;
    this.Op = this.service._op;
    // options
    this._attributes = attributes;
    this._include = include;
    this.options = {
      attributes: this._attributes,
      include: this._include
    };

    // methods
    this.fetch = this.fetch.bind(this);
    this.show = this.show.bind(this);
    this.destroy = this.destroy.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
  }

  async fetch (req, res, next) {
    try {
      // All entities are obtained and sent
      let entities = await this.service.fetch(this.options);
      res.send(entities);
    } catch (e) {
      next(e);
    }
  }

  async show (req, res, next) {
    try {
      // An entity is obtained by its id
      let entity = await this.service.show(req.params.id, this.options);
      if (entity) {
        res.send(entity);
      } else {
        next(404);
      }
    } catch (e) {
      next(e);
    }
  }

  async store (req, res, next) {
    try {
      // The data sent by the user is mapped with the model
      const body = objectMapper(req.body, this.getModel());
      // If there are async processes in the model transform, they are resolved
      await this.deletePromise(body);
      // All data sent by the user is validated
      const validate = await util.handlerRequest(body, req.body, this.getModel());
      if (validate) {
        return res.status(400).send({ message: validate });
      }
      // The entity is created
      let entity = await this.service.create({...body}, this.options);
      res.send(entity);
    } catch (e) {
      next(e);
    }
  }

  async update (req, res, next) {
    try {
      // The data sent by the user is mapped with the model
      var body = await objectMapper(req.body, this.getModel());
      // If there are async processes in the model transform, they are resolved
      await this.deletePromise(body);
      // The entity is updated
      let entity = await this.service.update(req.params.id, {...body}, this.options);
      if (entity) {
        res.send(entity);
      } else {
        next(404);
      }
    } catch (e) {
      next(e);
    }
  }

  async destroy (req, res, next) {
    try {
      // The entity is deleted
      let admin = await this.service.destroy(req.params.id);
      if (admin) {
        res.status(201).send({ message: `${this.entity} eliminado` });
      } else {
        next(404);
      }
    } catch (e) {
      next(e);
    }
  }

  getModel () {
    let name = `${this.entity}Model`;
    return Models[name];
  }

  getId (req) {
    return util.decoded(req.headers.authorization).id;
  }

  async deletePromise (body) {
    // Keys are obtained
    const keys = Object.keys(body);
    // The values are searched for an unresolved promise
    await Promise.all(Object.values(body).map(async (attr, index) => {
      if (attr.constructor.name === "Promise") {
        // If he finds it, he solves it
        body[keys[index]] = await Promise.resolve(attr);
        // If undefined, delete the object attribute
        if (body[keys[index]] === undefined) {
          delete body[keys[index]];
        }
      }
    }));
    return body;
  }

}

module.exports = BaseController;
