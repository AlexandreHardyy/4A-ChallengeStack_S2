const companyService = require("../services/company")

// TODO: I think that is not the good way to check that !!!!
const checkCompanyApiToken = async (req, res, next) => {
    const token = req.body.apiToken

    if (!token) { return res.sendStatus(422) }

    const company =  await companyService.findByApiToken(token)

    if (!company) { return res.sendStatus(403) }

    req.body.company = company

    next()
}

const checkCompanyClientToken = async (req, res, next) => {
    const token = req.body.clientToken

    if (!token) { return res.sendStatus(422) }

    const company =  await companyService.findByClientToken(token)

    if (!company) { return res.sendStatus(403) }

    req.body.company = company

    next()
}

module.exports = { checkCompanyApiToken, checkCompanyClientToken }