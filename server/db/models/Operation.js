const { Model, DataTypes } = require("sequelize")

module.exports = function (connection) {
  class Operation extends Model {}

  Operation.init(
    {
      status: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate : DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize: connection,
      tableName: "operation",
    }
  )

  return Operation
}
