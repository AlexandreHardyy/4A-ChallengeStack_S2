const { OperationHistory } = require("../db/models")

module.exports = {
  findAll: async function () {
    return OperationHistory.findAll()
  },
  findById: async function (id) {
    return OperationHistory.findByPk(id)
  },
  create: async function (data) {
    return OperationHistory.create(data)
  },
  update: async function (criteria, data) {
    const [nb, operationHistorys = []] = await OperationHistory.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true,
    })
    return operationHistorys
  },
  remove: async function (criteria) {
    return OperationHistory.destroy({
      where: criteria,
    })
  },
}
