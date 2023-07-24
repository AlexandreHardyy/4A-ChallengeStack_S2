const { Router } = require("express")
const companyController = require("../controllers/company")
const { userAuth, adminAuth } = require("../middlewares/auth")
const router = Router()

// no auth on post
router.post("/", companyController.post)

router.get("/:id", userAuth, companyController.get)
router.put("/:id", userAuth, companyController.put)
router.patch("/:id", userAuth, companyController.patch)
router.delete("/:id", userAuth, companyController.delete)
router.get("/regenerateToken/:id/:name", userAuth, companyController.regenerateToken)

router.get("/", companyController.cget, adminAuth)


module.exports = router
