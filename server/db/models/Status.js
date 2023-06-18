const { Model, DataTypes } = require("sequelize")

module.exports = function (connection) {
  class Status extends Model {}

  Status.init(
    {
      name: DataTypes.STRING
    },
    {
      sequelize: connection,
      tableName: "status",
    }
  )

  return Status
}
