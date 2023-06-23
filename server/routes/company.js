const { Router } = require("express")
const companyController = require("../controllers/company")
const { userAuth, adminAuth } = require("../middlewares/auth")
const router = Router()

// no auth on post
router.post("/", companyController.post)

router.use(userAuth)
router.get("/:id", companyController.get)
router.put("/:id", companyController.put)
router.patch("/:id", companyController.patch)
router.delete("/:id", companyController.delete)

router.use(adminAuth)
router.get("/", companyController.cget)


module.exports = router
