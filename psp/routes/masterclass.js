const { Router } = require("express");
const masterclassController = require("../controllers/masterclass");
const router = Router()

router.post('/transactionApprouval', masterclassController.post)

module.exports = router