const { Router } = require("express")
const transactionController = require("../controllers/transaction")
const { checkCompanyToken } = require("../middlewares/company-token-check")
const router = Router()

router.get("/", transactionController.cget)
router.get("/:token", transactionController.get)
router.post("/psp-confirm/:token",transactionController.pspConfirm)

// check company token for transaction process
router.use(checkCompanyToken)
router.post("/", transactionController.post)
router.post("/confirm/:token", transactionController.confirm)
router.post("/cancel/:token", transactionController.cancel)

module.exports = router
