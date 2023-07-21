const { User, Company } = require("../db")

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
      }],
      attributes: { exclude: ['password'] },
    })
  },
  findById: async function (id) {
    return User.findByPk(id, {
      include: [{
        model: Company,
        attributes: { exclude: ['clientSecret', 'clientToken', 'urlDirectionCancel', 'urlDirectionConfirm'] },
        required: true
      }],
      attributes: { exclude: ['password'] },
    })
  },
  create: async function (data) {
    return User.create(data)
  },
  update: async function (criteria, data) {
    const [nb, users = []] = await User.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true,
    })
    console.log(nb, users)
    return users
  },
  remove: async function (criteria) {
    return User.destroy({
      where: criteria,
    })
  },
}
