const { Router } = require("express")
const transactionController = require("../controllers/transaction")
const { checkCompanyToken } = require("../middlewares/company-token-check")
const router = Router()

router.get("/", transactionController.cget)
router.get("/:id", transactionController.get)
router.get("/psp-confirm/:id",transactionController.pspConfirm)

// check company token for transaction process
router.use(checkCompanyToken)
router.post("/", transactionController.post)
router.post("/confirm/:id", transactionController.confirm)
router.post("/cancel/:id", transactionController.cancel)

module.exports = router
