const BaseController = require("./base.controller");
const { Users } = require("../../../db/services");

const objectMapper = require("object-mapper");

class ProfileController extends BaseController {
  constructor () {
    super(Users);
  }

  // Overwrite
  async show (req, res, next) {
    try {
      let entity = await this._entity.show(this.getId(req));
      if (entity) {
        res.send(entity);
      } else {
        next(404);
      }
    } catch (e) {
      next(e);
    }
  }

  // Overwrite
  async update (req, res, next) {
    try {
      var body = await objectMapper(req.body, this.getModel());
      await this.deletePromise(body);
      let entity = await this._entity.update(this.getId(req), {...body});
      if (entity) {
        res.send(entity);
      } else {
        next(404);
      }
    } catch (e) {
      next(e);
    }
  }

}

module.exports = ProfileController;
