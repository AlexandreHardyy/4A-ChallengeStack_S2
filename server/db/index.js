const fs = require("fs")
const path = require("path")
const Sequelize = require("sequelize")
const connection = new Sequelize(process.env.DATABASE_URL)

const db = { connection }

fs.readdirSync(path.join(__dirname, "models")).forEach((file) => {
  const model = require(path.join(__dirname, "models", file))(connection)
  db[model.name] = model
})

db.User.belongsTo(db.Company, {
  foreignKey: 'companyId'
})
db.User.belongsTo(db.Role)
db.Role.hasMany(db.User)
db.Company.hasMany(db.User)

db.Company.hasMany(db.Transaction, {
  foreignKey: 'companyId'
})

db.Transaction.hasMany(db.Operation, {
  foreignKey: 'transactionId'
})

// db.Status.hasMany(db.Operation, {
//   foreignKey: 'statusId'
// })

module.exports = db
