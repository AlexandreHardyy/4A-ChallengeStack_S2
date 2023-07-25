const { Router } = require("express")
const userController = require("../controllers/user")
const { userAuth, adminAuth } = require("../middlewares/auth")
const router = Router()


router.get("/", adminAuth, userController.cget)
router.get("/current", userAuth, userController.getCurrent)
router.get("/:id", adminAuth, userController.get)
router.patch("/:id", userAuth, userController.patch)
router.delete("/:id", userAuth, userController.delete)
router.post("/", adminAuth, userController.post) // add admin user


module.exports = router
