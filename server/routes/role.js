const { Router } = require("express")
const roleController = require("../controllers/role")
const { adminAuth } = require("../middlewares/auth")
const router = Router()

router.use(adminAuth)
router.post("/", roleController.post)
router.get("/", roleController.cget)
router.get("/:id", roleController.get)
router.patch("/:id", roleController.patch)
router.delete("/:id", roleController.delete)

module.exports = router
