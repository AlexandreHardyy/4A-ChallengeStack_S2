const { TransactionHistory } = require("../db")

module.exports = {
  findAll: async function () {
    return TransactionHistory.findAll()
  },
  findById: async function (id) {
    return TransactionHistory.findByPk(id)
  },
  create: async function (data) {
    return TransactionHistory.create(data)
  },
  update: async function (criteria, data) {
    const [nb, transactionHistorys = []] = await TransactionHistory.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true,
    })
    return transactionHistorys
  },
  remove: async function (criteria) {
    return TransactionHistory.destroy({
      where: criteria,
    })
  },
}
