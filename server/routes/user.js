const { Router } = require("express")
const userController = require("../controllers/user")
const { userAuth } = require("../middlewares/auth")
const router = Router()

router.get("/", userAuth, userController.cget)
router.get("/current", userAuth, userController.getCurrent)
router.get("/:id", userAuth, userController.get)
router.put("/:id", userAuth, userController.put)
router.patch("/:id", userAuth, userController.patch)
router.delete("/:id", userAuth, userController.delete)

module.exports = router
