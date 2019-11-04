const router = require("express").Router();
const { UsersController } = require("../controllers");

// console.log(UsersController.fetch);

router.get("/", UsersController.fetch);
router.get("/:id", UsersController.show);
router.post("/", UsersController.store);
router.put("/:id", UsersController.update);
router.delete("/:id", UsersController.destroy);

module.exports = router;
