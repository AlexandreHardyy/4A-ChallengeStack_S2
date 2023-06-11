const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const connection = new Sequelize(process.env.DATABASE_URL);
const db = {
  connection,
};

fs.readdirSync(path.join(__dirname, "models")).forEach((file) => {
  const model = require(path.join(__dirname, "models", file))(connection);
  console.log(model.name, model.prototype.constructor.name);
  db[model.name] = model;
});

module.exports = db;
