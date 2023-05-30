const { Router } = require("express");
const userController = require("../controllers/user");
const router = Router();

router.get("/", userController.cget);
router.post("/", userController.post);
router.get("/:id", userController.get);
router.put("/:id", userController.put);
router.patch("/:id", userController.patch);
router.delete("/:id", userController.delete);

module.exports = router;
