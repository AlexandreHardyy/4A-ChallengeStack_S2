const { Transaction, ...db } = require("../db")
const { Op } = require('sequelize');
const TransactionMongo = require('../db/aggregates/Transaction')

module.exports = {
  findAll: async function (criteria, options = {}) {
    const where = criteria.from !== undefined && criteria.to !== undefined ? 
    { createdAt: { $gte: new Date(criteria.from), $lte: new Date(criteria.to) } } : {}

    if (criteria.companyId) {
      where.companyId = criteria.companyId
    }

    return TransactionMongo.find(where)
      .sort(options.order ? { [options.order]: 'desc' } : {})
      .skip(options.offset)
      .limit(options.limit)
  
  },
  findById: async function (id) {
    return TransactionMongo.findOne({ id })
  },
  findByToken: async function (token) {
    return TransactionMongo.findOne({ token })
  },
  create: async function (data) {
    return Transaction.create({
      ...data,
      token: Transaction.generateToken()
    })
  },
  remove: async function (criteria) {
    return Transaction.destroy({
      where: criteria,
    })
  },
}
