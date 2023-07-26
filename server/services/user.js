const { User, Company, Role } = require("../db/models")

module.exports = {
  findAll: async function (criteria, options = {}) {
    return User.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
      include: [{
        model: Company,
        attributes: { exclude: ['clientSecret', 'clientToken', 'urlDirectionCancel', 'urlDirectionConfirm'] },
        required: true
      },{
        model: Role
      }],
      /*attributes: { exclude: ['password'] },*/
    })
  },
  findById: async function (id) {
    return User.findByPk(id, {
      include: [{
        model: Company,
        attributes: {  },
        required: true
      }],
      /*attributes: { exclude: ['password'] },*/
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
