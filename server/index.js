const express = require("express")
const app = express()
const userService = require("./services/user")

app.use(express.json())

app.use(require("./routes/security")(userService))

app.use("/role", require("./routes/role"))
app.use("/user", require("./routes/user"))
app.use("/company", require("./routes/company"))
app.use("/transaction", require("./routes/transaction"))

app.get("/", (req, res) => {
  return res.send("API payment working !")
})

app.use(function(req, res, next) {
  return res.status(404).json({ error: 'this route doesn\'t exist.' })
});

app.listen(3000, () => console.log("Server started on port 3000"))
