const companyService = require('../services/company')

module.exports = async function (req, callback) {
    const companies = await companyService.findAll()

    const allowedUrls = companies.map(company => company.url).filter(url => url)
    allowedUrls.push(process.env.BASEURL_CLIENT)

    if (allowedUrls.indexOf(req.header('Origin')) !== -1) {
        callback(null, {origin: true})
    } else {
        callback(null, {origin: false})
    }
}