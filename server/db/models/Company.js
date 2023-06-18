const { Model, DataTypes, literal } = require("sequelize")

module.exports = function (connection) {
  class Company extends Model {}

  Company.init(
    {
        name: DataTypes.STRING,
        kbis: DataTypes.STRING,
        address: DataTypes.STRING,
        urlDirectionConfirm: DataTypes.STRING,
        urlDirectionCancel: DataTypes.STRING,
        clientToken: DataTypes.STRING,
        clientSecret: DataTypes.STRING,
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
      tableName: "company",
    }
  )

  return Company
}
