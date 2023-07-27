const { Model, DataTypes } = require("sequelize")

module.exports = function (connection) {
  class OperationHistory extends Model {}

  OperationHistory.init(
    {
      status: DataTypes.STRING
    },
    {
      sequelize: connection,
      tableName: "operationHistory",
    }
  )
  return OperationHistory
}