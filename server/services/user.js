const { User, Company, Role } = require("../db/models")

module.exports = {
  findAll: async function (criteria, options = {}) {

    if (criteria.admin) {
      delete criteria.admin
      Object.assign(criteria, { "$Role.name$" : "admin" })
    }
    return User.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
      include: [{
        model: Company,
        attributes: { exclude: ['clientSecret', 'clientToken', 'urlDirectionCancel', 'urlDirectionConfirm'] }
      },{
        model: Role
      }],
      /*attributes: { exclude: ['password'] },*/
    })
  },
  findById: async function (id, options) {
    return User.findByPk(id, {
      include: [{
        model: Company,
        attributes: {  },
        required: true
      },{
        model: Role
      }],
      ...(options ?? {})
    })
  },
  create: async function (data) {
    return User.create(data)
  },
  update: async function (criteria, data) {
    const user = await User.findByPk(criteria.id)
    if (!user) {
      return []
    }
    const dataToUpdate = {
      ...data
    }
    const [nb, users = []] = await User.update(dataToUpdate, {
      where: criteria,
      returning: true,
      individualHooks: true,
    })
    return users
  },
  remove: async function (criteria) {
    return User.destroy({
      where: criteria,
    })
  },
}
