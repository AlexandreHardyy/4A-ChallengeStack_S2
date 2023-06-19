const fs = require("fs")
const path = require("path")
const Sequelize = require("sequelize")
const connection = new Sequelize(process.env.DATABASE_URL)

const db = { connection }

fs.readdirSync(path.join(__dirname, "models")).forEach((file) => {
  const model = require(path.join(__dirname, "models", file))(connection)
  db[model.name] = model
})

db.User.belongsTo(db.Company)
db.User.belongsTo(db.Role)
db.Role.hasMany(db.User)
db.Status.hasMany(db.Transaction)
db.Company.hasMany(db.User)
db.Transaction.belongsTo(db.Status)

module.exports = db
