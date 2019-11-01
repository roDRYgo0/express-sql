const router = require("express").Router();
const { ProfileController } = require("../../controllers");

router.get("/", ProfileController.show);
router.put("/", ProfileController.update);

module.exports = router;
