const jwt = require('jsonwebtoken')
const companyService = require('../services/company')

const userAuth = (...params) => {
  return authProcess(...params)
}

const adminAuth = (...params) => {
  return authProcess(...params, true)
}

const authProcess = (req, res, next, isAdmin = false) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.sendStatus(401)

  return jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) return res.sendStatus(403)
    req.user = user

    if (isAdmin && !req.user.isAdmin) return res.sendStatus(403)

    next()
  })
}

const checkCompanyApiToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) { return res.sendStatus(422) }

  const company =  await companyService.findByApiToken(token)

  if (!company) { return res.sendStatus(403) }

  req.user = {
    companyId: company.id
  }
  next()
}

const dualAuth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.sendStatus(401)

  return jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      const company = await companyService.findByApiToken(token)
      req.user = {
        companyId: company.id
      }
    } else {
      req.user = user
    }
    next()
  })
}

module.exports = { userAuth, adminAuth, dualAuth, checkCompanyApiToken }