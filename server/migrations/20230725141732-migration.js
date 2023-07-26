'use strict';

const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      return queryInterface.sequelize.transaction(t => {
          return Promise.all([
              queryInterface.createTable('role', {
                  id: {
                      type: Sequelize.INTEGER,
                      primaryKey: true,
                      autoIncrement: true,
                  },
                  name: Sequelize.STRING,
                  createdAt: {
                      type: Sequelize.DATE,
                      defaultValue: Sequelize.NOW,
                      field: 'createdAt',
                  },
                  updatedAt: {
                      type: Sequelize.DATE,
                      defaultValue: Sequelize.NOW,
                      onUpdate : Sequelize.NOW,
                      field: 'updatedAt',
                  },
              }, { transaction: t }),
              queryInterface.createTable('company', {
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
                  url: Sequelize.STRING,
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
              queryInterface.createTable('user', {
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
                              tableName: 'company'
                          },
                          key: 'id'
                      },
                  },
                  CompanyId: {
                      type: Sequelize.DataTypes.INTEGER,
                      references: {
                          model: {
                              tableName: 'company'
                          },
                          key: 'id'
                      },
                  },
                  roleId: {
                      type: Sequelize.DataTypes.INTEGER,
                      references: {
                          model: {
                              tableName: 'role'
                          },
                          key: 'id'
                      },
                  },
                  RoleId: {
                      type: Sequelize.DataTypes.INTEGER,
                      references: {
                          model: {
                              tableName: 'role'
                          },
                          key: 'id'
                      },
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
              queryInterface.createTable('transaction', {
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
                companyId: {
                    type: Sequelize.DataTypes.INTEGER,
                    references: {
                        model: {
                            tableName: 'company'
                        },
                        key: 'id'
                    },
                    allowNull: false
                },
              }, { transaction: t }),
              queryInterface.createTable('operation', {
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
                transactionId: {
                    type: Sequelize.DataTypes.INTEGER,
                    references: {
                        model: {
                            tableName: 'transaction'
                        },
                        key: 'id'
                    },
                    allowNull: false
                },
              }, { transaction: t }),
              queryInterface.createTable('transactionHistory', {
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
                },
                Date: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                     field: 'createdAt',
                },
                updateAt: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                    field: 'updatedAt',
                },
                transactionId: {
                    type: Sequelize.DataTypes.INTEGER,
                    references: {
                        model: {
                            tableName: 'transaction'
                        },
                        key: 'id'
                    },
                },
              }, { transaction: t }),
              queryInterface.createTable('operationHistory', {
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
                  },
                  Date: {
                      type: Sequelize.DATE,
                      defaultValue: Sequelize.NOW,
                      field: 'createdAt',
                  },
                  updateAt: {
                      type: Sequelize.DATE,
                      defaultValue: Sequelize.NOW,
                      field: 'updatedAt',
                  },
                  operationId: {
                      type: Sequelize.DataTypes.INTEGER,
                      references: {
                          model: {
                              tableName: 'operation'
                          },
                          key: 'id'
                      },
                  },
              }, { transaction: t })
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
