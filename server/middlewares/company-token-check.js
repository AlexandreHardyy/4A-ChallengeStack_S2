const companyService = require("../services/company")

// TODO: I think that is not the good way to check that !!!!
const checkCompanyApiToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) { return res.sendStatus(422) }

    const company =  await companyService.findByApiToken(token)

    if (!company) { return res.sendStatus(403) }

    req.body.company = company

    next()
}

module.exports = { checkCompanyApiToken }