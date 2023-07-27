const { Router } = require("express")
const transactionController = require("../controllers/transaction")
const { dualAuth, checkCompanyApiToken } = require("../middlewares/auth")

const router = Router()

router.post("/web-hook", transactionController.pspConfirm)
router.get("/:token/sdk", transactionController.sdk)
router.post("/:token/confirm", transactionController.confirm)
router.post("/:token/cancel", transactionController.cancel)

// ROUTE WITH JWT OR API TOKEN AUTHORIZATION
router.get("/:id", dualAuth, transactionController.get)
router.get("/", dualAuth,  transactionController.cget)

// SDK AUTH API TOKEN
router.post("/", checkCompanyApiToken, transactionController.post)
router.get("/refund", checkCompanyApiToken, transactionController.refund)
router.get("/orders", checkCompanyApiToken, transactionController.refund)


module.exports = router
