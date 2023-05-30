const express = require("express");
const app = express();
const userService = require("./services/user");

app.use(express.json());

app.use(require("./routes/security")(userService));

app.use("/users", require("./routes/user"));

app.get("/", (req, res) => {
  res.send("API payment working !");
});

app.post("/", (req, res) => {
  res.json(req.body);
});

app.listen(3000, () => console.log("Server started on port 3000"));
