const BaseController = require("./core/base.controller");
const { Users } = require("../../db/services");
const Models = require("../models");

const objectMapper = require("object-mapper");
const util = require("../util");
const bcrypt = require("bcrypt");

class UsersController extends BaseController{
  constructor () {
    super(Users);
    this.getFirstUser = this.getFirstUser.bind(this);
    this.createFirstUser = this.createFirstUser.bind(this);
    this.auth = this.auth.bind(this);
  }

  async auth (req, res, next) {
    try {
      const body = objectMapper(req.body, Models.AuthModel);
      const validate = util.handlerRequest(body, Models.AuthModel);
      if (validate) {
        return res.status(400).send({ message: validate });
      }
      console.log(body);
      let user = await this._entity.findOne({ where: { email: body.email} });
      if (user) {
        let authorization = await bcrypt.compare(body.password, user.password);
        if (authorization) {
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
      let entities = await this._entity.fetch();
      res.send({create: !entities.length});
    } catch (e) {
      next(e);
    }
  }

  async createFirstUser (req, res, next) {
    try {
      let entities = await this._entity.fetch();
      if (entities.length !== 0) {
        return next(401);
      }
      const body = objectMapper(req.body, this.getModel());
      await this.deletePromise(body);
      const validate = util.handlerRequest(body, this.getModel());
      if (validate) {
        return res.status(400).send({ message: validate });
      }
      let entity = await this._entity.create({...body});
      res.send(entity);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = UsersController;
