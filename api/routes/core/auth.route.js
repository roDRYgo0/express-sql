const router = require("express").Router();
const { UsersController } = require("../../controllers");

router.post("/", UsersController.auth);

module.exports = router;
