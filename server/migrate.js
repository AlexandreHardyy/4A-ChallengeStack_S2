const { sequelize } = require("./db/models")

sequelize.sync({ force: true }).then(() => {
  console.log("Database synchronized")
  sequelize.close()
})