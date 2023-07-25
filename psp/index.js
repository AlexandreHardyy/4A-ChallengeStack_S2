const express = require("express");
const app = express();

app.use(express.json());

app.use("/operation", require("./routes/masterclass"))

app.get("/", (req, res) => {
  res.send("PSP response !");
});
app.listen(3001, () => console.log("Server is running on port 3001"));
