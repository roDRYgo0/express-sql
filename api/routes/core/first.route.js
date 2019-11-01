const router = require("express").Router();
const { UsersController } = require("../../controllers");

router.get("/", UsersController.getFirstUser);
router.post("/", UsersController.createFirstUser);

module.exports = router;
