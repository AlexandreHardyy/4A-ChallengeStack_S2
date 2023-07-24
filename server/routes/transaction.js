const { Router } = require("express")
const transactionController = require("../controllers/transaction")
const { checkCompanyApiToken, checkCompanyClientToken } = require("../middlewares/company-token-check")
const { adminAuth, userAuth } = require("../middlewares/auth")

const router = Router()

router.get("/:token", transactionController.get)
router.post("/psp-confirm/:operationId",transactionController.pspConfirm)

// USER
router.get("/company/:id", userAuth, transactionController.getByCompanyId)

// ADMIN
router.get("/", adminAuth,  transactionController.cget)

// SDK AUTH API TOKEN
router.post("/", checkCompanyApiToken, transactionController.post)
router.post("/:token/refund", checkCompanyApiToken, transactionController.refund)

// SDK AUTH CLIENT TOKEN
router.post("/:token/confirm", checkCompanyClientToken, transactionController.confirm)
router.post("/:token/cancel", checkCompanyClientToken, transactionController.cancel)

module.exports = router
