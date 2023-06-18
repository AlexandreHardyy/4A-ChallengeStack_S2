const { Model, DataTypes } = require("sequelize")

module.exports = function (connection) {
  class Role extends Model {}

  Role.init(
    {
      name: DataTypes.STRING
    },
    {
      sequelize: connection,
      tableName: "role",
    }
  )

  return Role
}
