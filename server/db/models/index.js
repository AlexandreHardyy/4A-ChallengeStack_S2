'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const mongoose = require("mongoose");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];
const db = {};

mongoose.connect(process.env.DATABASE_MONGO_URL).catch(err => {
  console.log(err)
  return
});

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js' &&
          file.indexOf('.test.js') === -1
      );
    })
    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });

db.User.belongsTo(db.Company, {
  foreignKey: 'companyId'
})
db.User.belongsTo(db.Role, {
  foreignKey: 'roleId'
})
db.Role.hasMany(db.User)
db.Company.hasMany(db.User)

db.Company.hasMany(db.Transaction, {
  foreignKey: 'companyId'
})

db.Transaction.hasMany(db.Operation, {
  foreignKey: 'transactionId'
})
db.Transaction.hasMany(db.TransactionHistory, {
  foreignKey: 'transactionId'
})

db.Operation.hasMany(db.OperationHistory, {
  foreignKey: 'operationId'
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
