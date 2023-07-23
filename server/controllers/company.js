const companyService = require("../services/company")
const userService = require("../services/user")
const { Company } = require("../db")

module.exports = {
  cget: async (req, res, next) => {
    const {
      _page = 1,
      _itemsPerPage = 10,
      _sort = {},
      ...criteria
    } = req.query
    try {
      const companies = await companyService.findAll(criteria, {
        offset: (_page - 1) * _itemsPerPage,
        limit: _itemsPerPage,
        order: _sort,
      })
      res.json(companies)
    } catch (err) {
      next(err)
    }
  },
  post: async (req, res, next) => {
    let company;
    try {
      company = await companyService.create(req.body)
      const user = await userService.create({ ...req.body, companyId: company.id })
      res.status(201).json([company, user])
    } catch (err) {
      if (company && company.id) {
        await companyService.remove({ id: company.id })
      }
      next(err)
    }
  },
  get: async (req, res, next) => {
    try {
      const company = await companyService.findById(parseInt(req.params.id))
      if (!company) return res.sendStatus(404)
      res.json(company)
    } catch (err) {
      next(err)
    }
  },
  put: async (req, res, next) => {
    try {
      const nbRemoved = await companyService.remove({
        id: parseInt(req.params.id),
      })
      const company = await companyService.create({
        id: parseInt(req.params.id),
        ...req.body,
      })
      res.status(nbRemoved ? 200 : 201).json(company)
    } catch (err) {
      next(err)
    }
  },
  patch: async (req, res, next) => {
    const id = req.user.isAdmin ? req.params.id : req.user.companyId
    try {
      const [company] = await companyService.update(
        { id: parseInt(id) },
        req.body
      )
      if (!company) return res.sendStatus(404)
      res.json(company)
    } catch (err) {
      next(err)
    }
  },
  regenerateToken: async (req, res, next) => {
    const id = req.params.id
    try {
      const company = await companyService.update(
          { id: parseInt(id) },
          { apiToken: Company.generateToken() }
      )
      if (!company) return res.sendStatus(404)
      res.json(company)
    } catch (err) {
      next(err)
    }
  },
  delete: async (req, res, next) => {
    try {
      const nbRemoved = await companyService.remove({
        id: parseInt(req.params.id),
      })
      res.sendStatus(nbRemoved ? 204 : 404)
    } catch (err) {
      next(err)
    }
  },
}
