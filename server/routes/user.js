const { Router } = require("express")
const userController = require("../controllers/user")
const { userAuth } = require("../middlewares/auth")
const router = Router()

// no auth on post
router.post("/", userController.post)

router.use(userAuth)
router.get("/", userController.cget)
router.get("/:id", userController.get)
router.put("/:id", userController.put)
router.patch("/:id", userController.patch)
router.delete("/:id", userController.delete)

module.exports = router
