const BaseController = require("./core/base.controller");
const Models = require("../models");

const objectMapper = require("object-mapper");
const util = require("../util");
const bcrypt = require("bcrypt");

class UsersController extends BaseController{
  constructor () {
    super(
      "Users",
      ["id", "name", "lastName", "email", "rol", "createdAt", "updatedAt"],
      null
    );

    // method declaration
    this.auth = this.auth.bind(this);
    this.getFirstUser = this.getFirstUser.bind(this);
    this.createFirstUser = this.createFirstUser.bind(this);
  }

  async auth (req, res, next) {
    try {
      const body = objectMapper(req.body, Models.AuthModel);
      const validate = await util.handlerRequest(body, req.body, Models.AuthModel);
      if (validate) {
        return res.status(400).send({ message: validate });
      }
      let user = await this.service.findOne({ where: { email: body.email}});
      if (user) {
        let authorization = await bcrypt.compare(body.password, user.password);
        if (authorization) {
          delete user.dataValues.password;
          res.send({user, token: util.createToken(user)});
        } else {
          next(404);
        }
      } else {
        next(404);
      }
    } catch (e) {
      next(e);
    }
  }

  async getFirstUser (req, res, next) {
    try {
      let entities = await this.service.fetch();
      res.send({create: !entities.length});
    } catch (e) {
      next(e);
    }
  }

  async createFirstUser (req, res, next) {
    try {
      let entities = await this.service.fetch();
      if (entities.length !== 0) {
        return next(401);
      }
      const body = objectMapper(req.body, this.getModel());
      await this.deletePromise(body);
      const validate = await util.handlerRequest(body, req.body, this.getModel());
      if (validate) {
        return res.status(400).send({ message: validate });
      }
      let entity = await this.service.create({...body});
      delete entity.dataValues.password;
      res.send(entity);
    } catch (e) {
      next(e);
    }
  }

}

module.exports = UsersController;
