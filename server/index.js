const express = require("express")
const app = express()
const userService = require("./services/user")
const errorHandler = require("./middlewares/errorHandler");
const corsOptionsDelegate = require("./middlewares/corsConfig");
const cors = require('cors')
const twig = require("twig")

require('dotenv').config();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptionsDelegate));

app.set("twig options", {
  allowAsync: true, // Allow asynchronous compiling
  strict_variables: false
});

app.use(require("./routes/security")(userService))

app.use("/user", require("./routes/user"))
app.use("/company", require("./routes/company"))
app.use("/transaction", require("./routes/transaction"))
app.use("/event", require("./routes/event"))

app.get("/", (req, res) => {
  return res.send("API payment working !")
})

app.use(function(req, res, next) {
  return res.status(404).json({ error: 'this route doesn\'t exist.' })
});

app.use(errorHandler);

app.listen(3000, () => console.log("Server started on port 3000"))
