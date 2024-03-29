const { Company } = require("../db/models")

module.exports = {
  findAll: async function (criteria, options = {}) {
    return Company.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    })
  },
  findById: async function (id) {
    return Company.findByPk(id)
  },
  findByApiToken: async function (apiToken) {
    return Company.findOne({
      where: {
        apiToken
      }
    })
  },
  findByClientToken: async function (clientToken) {
    return Company.findOne({
      where: {
        clientToken
      }
    })
  },
  create: async function (data) {
    return Company.create({ 
        ...data, 
        clientToken: Company.generateToken(), 
        apiToken: Company.generateToken(),
        isValid: false
    })
  },
  update: async function (criteria, data) {
    const [nb, companies = []] = await Company.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true,
    })
    return companies
  },
  remove: async function (criteria) {
    return Company.destroy({
      where: criteria,
    })
  },
}
