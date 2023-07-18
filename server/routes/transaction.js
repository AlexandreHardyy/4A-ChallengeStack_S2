const { Router } = require("express")
const transactionController = require("../controllers/transaction")
const { checkCompanyApiToken, checkCompanyClientToken } = require("../middlewares/company-token-check")
const { adminAuth, userAuth } = require("../middlewares/auth")

const router = Router()

router.get("/:token", transactionController.get)
router.post("/psp-confirm/:token",transactionController.pspConfirm)

// USER
router.get("/company/:id", userAuth, transactionController.getByCompanyId)

// ADMIN
router.get("/", adminAuth,  transactionController.cget)

// SDK AUTH API TOKEN
router.post("/", checkCompanyApiToken, transactionController.post)
router.post("/refund/:token", checkCompanyApiToken, transactionController.refund)

// SDK AUTH CLIENT TOKEN
router.post("/confirm/:token", checkCompanyClientToken, transactionController.confirm)
router.post("/cancel/:token", checkCompanyClientToken, transactionController.cancel)

module.exports = router
