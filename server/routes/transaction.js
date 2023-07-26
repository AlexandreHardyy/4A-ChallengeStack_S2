const { Router } = require("express")
const transactionController = require("../controllers/transaction")
const { checkCompanyApiToken } = require("../middlewares/company-token-check")
const { adminAuth, userAuth } = require("../middlewares/auth")

const router = Router()

router.get("/:token/sdk", transactionController.sdk)

router.post("/web-hook", transactionController.pspConfirm)

// USER
router.get("/:id", userAuth, transactionController.get)
router.get("/company/:id", userAuth, transactionController.getByCompanyId)

// ADMIN
router.get("/", adminAuth,  transactionController.cget)

// SDK AUTH API TOKEN
router.post("/", checkCompanyApiToken, transactionController.post)
router.post("/:token/refund", checkCompanyApiToken, transactionController.refund)

router.post("/:token/confirm", transactionController.confirm)
router.post("/:token/cancel", transactionController.cancel)

module.exports = router
