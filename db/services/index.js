const db = require("../models");
const service = require("./service");

var Services = {};

db.models.forEach(model => {
  Services[model] = new service(db, model);
});

module.exports = Services;
