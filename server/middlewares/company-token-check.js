const companyService = require("../services/company")

// TODO: I think that is not the good way to check that !!!!
const checkCompanyToken = async (req, res, next) => {
    const token = req.body.clientToken

    if (!token) { return res.sendStatus(422) }

    const company =  await companyService.findByToken(token)

    if (!company) { return res.sendStatus(403) }

    req.body.company = company

    next()
}

module.exports = { checkCompanyToken }