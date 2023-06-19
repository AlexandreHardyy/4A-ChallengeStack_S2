module.exports = {
    post: (req, res) => {
        if (!req.body) { res.sendStatus(404) }

        const { cbNumber, cbName, price, currency } = req.body

        if (!cbNumber || !cbName || !price || !currency) {
            res.sendStatus(404)
        }

        if (typeof cbNumber !== 'string' || typeof cbName !== 'string' || typeof currency !== 'string') { 
            res.sendStatus(400) 
        }

        const santizedCbNumber = cbNumber.trim().split(' ').join('')
        const sanitizedCurrency = currency.trim().toUpperCase()

        if (santizedCbNumber.length !== 16 || sanitizedCurrency.length !== 3) { res.sendStatus(400) }

        if (typeof price !== 'number' || price < 0) {
            res.sendStatus(400)
        }

        setTimeout(() => {res.sendStatus(200)}, 5000)
    }
}