const { Router } = require("express")
const eventController = require("../controllers/event")
const { userAuth, adminAuth } = require("../middlewares/auth")
const router = Router()

router.get("/subscribe", userAuth, eventController.subscribe)

module.exports = router
