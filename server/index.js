const express = require("express")
const { Router } = require("express")
const app = express()
const userService = require("./services/user")
const errorHandler = require("./middlewares/errorHandler");

const twig = require("twig")
const cors = require('cors')

require('dotenv').config();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.set("twig options", {
  allowAsync: true, // Allow asynchronous compiling
  strict_variables: false
});

const baseList = [
  process.env.BASEURL_SERVER,
  process.env.BASEURL_CLIENT,
  process.env.BASEURL_MERCHANT_SERVER
]

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  console.log(req.headers, baseList)
  if (baseList.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
      corsOptions = { origin: false } // disable CORS for this request
  }

  callback(null, {
      origin: baseList
  })
}

app.use(require("./routes/security")(userService))

app.use(cors(corsOptionsDelegate))

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
