const BaseController = require("./base.controller");

const objectMapper = require("object-mapper");

class ProfileController extends BaseController {
  constructor () {
    super(
      "Users",
      null,
      null
    );
  }

  // Overwrite
  async show (req, res, next) {
    try {
      let entity = await this.service.show(this.getId(req));
      if (entity) {
        delete entity.dataValues.password;
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
      let entity = await this.service.update(this.getId(req), {...body});
      if (entity) {
        delete entity.dataValues.password;
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
