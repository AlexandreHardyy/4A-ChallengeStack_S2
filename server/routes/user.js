const { Router } = require("express")
const userController = require("../controllers/user")
const { userAuth, adminAuth } = require("../middlewares/auth")
const router = Router()

router.patch("/:id", userAuth, userController.patch)
router.get("/current", userAuth, userController.getCurrent)

router.get("/", adminAuth, userController.cget)
router.get("/:id", adminAuth, userController.get)
router.delete("/:id", adminAuth, userController.delete)
router.post("/", adminAuth, userController.post) // add admin user

module.exports = router
