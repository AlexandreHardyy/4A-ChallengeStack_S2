const { Router } = require("express")
const transactionController = require("../controllers/transaction")
const { checkCompanyToken } = require("../middlewares/company-token-check")
const { adminAuth, userAuth } = require("../middlewares/auth")

const router = Router()

router.get("/:token", transactionController.get)
router.post("/psp-confirm/:token",transactionController.pspConfirm)

// USER
router.get("/company/:id", userAuth, transactionController.getByCompanyId)

// ADMIN
router.get("/", adminAuth,  transactionController.cget)

// SDK AUTH TOKEN
router.post("/", transactionController.post)
router.post("/confirm/:token", checkCompanyToken, transactionController.confirm)
router.post("/cancel/:token", checkCompanyToken, transactionController.cancel)
router.post("/refund/:token", checkCompanyToken, transactionController.refund)

module.exports = router
