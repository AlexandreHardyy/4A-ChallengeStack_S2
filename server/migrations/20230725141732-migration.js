'use strict';

const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      return queryInterface.sequelize.transaction(t => {
          return Promise.all([
              queryInterface.createTable('Role', {
                  id: {
                      type: Sequelize.INTEGER,
                      primaryKey: true,
                      autoIncrement: true,
                  },
                  name: Sequelize.STRING
              }),
              queryInterface.createTable('Company', {
                  id: {
                      type: Sequelize.INTEGER,
                      primaryKey: true,
                      autoIncrement: true,
                  },
                  name: DataTypes.STRING,
                  kbis: {
                      type: Sequelize.STRING,
                      unique: true,
                      allowNull: false
                  },
                  address: Sequelize.STRING,
                  urlDirectionConfirm: Sequelize.STRING,
                  urlDirectionCancel: Sequelize.STRING,
                  clientToken: Sequelize.STRING,
                  apiToken: Sequelize.STRING,
                  createdAt: {
                      type: Sequelize.DATE,
                      defaultValue: Sequelize.NOW,
                      field: 'created_at',
                  },
                  updatedAt: {
                      type: Sequelize.DATE,
                      defaultValue: Sequelize.NOW,
                      onUpdate: Sequelize.NOW,
                      field: 'updated_at',
                  },
              }, { transaction: t }),
              queryInterface.createTable('User', {
                  id: {
                      type: Sequelize.INTEGER,
                      primaryKey: true,
                      autoIncrement: true,
                  },
                  lastname: Sequelize.STRING,
                  firstname: Sequelize.STRING,
                  email: {
                      type: Sequelize.STRING,
                      unique: true,
                      allowNull: false,
                  },
                  password: {
                      type: Sequelize.STRING,
                      allowNull: false,
                  },
                  isValid: {
                      type: Sequelize.BOOLEAN,
                      defaultValue: false,
                  },
                  companyId: {
                      type: Sequelize.DataTypes.INTEGER,
                      references: {
                          model: {
                              tableName: 'Company'
                          },
                          key: 'id'
                      },
                      allowNull: false
                  },
                  createdAt: {
                      type: Sequelize.DATE,
                      defaultValue: Sequelize.NOW,
                      field: 'created_at',
                  },
                  updatedAt: {
                      type: Sequelize.DATE,
                      defaultValue: Sequelize.NOW,
                      onUpdate: Sequelize.NOW,
                      field: 'updated_at',
                  }
              }, { transaction: t }),
              queryInterface.createTable('Transaction', {
                  id: {
                      type: Sequelize.INTEGER,
                      primaryKey: true,
                      autoIncrement: true,
                  },
                token: Sequelize.STRING,
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                amount: Sequelize.FLOAT,
                commission: Sequelize.FLOAT,
                currency: Sequelize.STRING,
                status: Sequelize.STRING,
                createdAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                    field: 'created_at',
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                    onUpdate : Sequelize.NOW,
                    field: 'updated_at',
                },
              }),
              queryInterface.createTable('Operation', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                type: Sequelize.STRING,
                status: Sequelize.STRING,
                amount: Sequelize.FLOAT,
                createdAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                    field: 'created_at',
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                    onUpdate : Sequelize.NOW,
                    field: 'updated_at',
                },
              }),
              queryInterface.createTable('OperationHistory', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                status: Sequelize.STRING,
                date: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                    field: 'created_at',
                }
              }),
              queryInterface.createTable('TransactionHistory', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                status: Sequelize.STRING,
                date: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                    field: 'created_at',
                }
              })
          ])
      })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
