const jwt = require('jsonwebtoken')

const userAuth = (...params) => {
  return authProcess(...params)
}

const adminAuth = (...params) => {
  return authProcess(...params, true)
}

const authProcess = (req, res, next, isAdmin = false) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.sendStatus(401)

  const type = authHeader.split(' ')[0]
  const token = authHeader.split(' ')[1]

  if (!token || type !== 'Bearer') return res.sendStatus(401)

  return jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) return res.sendStatus(403)
    req.user = user

    if (isAdmin && !req.user.isAdmin) return res.sendStatus(403)

    next()
  })
}

const checkCompanyApiToken = async (req, res, next) => {
  const companyService = require('../services/company')
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.sendStatus(401)

  const type = authHeader.split(' ')[0]
  const token = authHeader.split(' ')[1]

  if (!token || type !== 'Token') { return res.sendStatus(401) }

  const company =  await companyService.findByApiToken(token)

  if (!company) { return res.sendStatus(403) }

  req.user = {
    companyId: company.id
  }
  next()
}

const dualAuth = async (req, res, next) => {
  const companyService = require('../services/company')

  const authHeader = req.headers['authorization']
  if (!authHeader) return res.sendStatus(401)

  const type = authHeader.split(' ')[0]
  const token = authHeader.split(' ')[1]

  if (!token || !type) return res.sendStatus(401)

  if (type === 'Bearer') {
    return jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      } else {
        req.user = user
      }
  
      next()
    })
  } else if (type === 'Token') {
    const company = await companyService.findByApiToken(token)
    if (!company) return res.sendStatus(403)
    req.user = {
      companyId: company.id
    }
    next()
  } else {
    return res.sendStatus(401)
  }
}

module.exports = { userAuth, adminAuth, dualAuth, checkCompanyApiToken }