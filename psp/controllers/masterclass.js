module.exports = {
    post: async (req, res) => {

        if (!req.body) { return res.sendStatus(404) }

        const { transactionToken, cbNumber, cbName, expirationDate, cvc, price, currency } = req.body

        if ( !transactionToken || !cbNumber || !cbName || !expirationDate || !cvc || !price || !currency) {
            return res.sendStatus(404)
        }

        if (typeof cbNumber !== 'string' || typeof cbName !== 'string' || typeof currency !== 'string') { 
            return res.sendStatus(400) 
        }

        const santizedCbNumber = cbNumber.trim().split('-').join('')
        const sanitizedCurrency = currency.trim().toUpperCase()

        if (santizedCbNumber.length !== 16 || sanitizedCurrency.length !== 3) { return res.sendStatus(400) }

        if (typeof price !== 'number' || price < 0) {
            return res.sendStatus(400)
        }

        res.sendStatus(202)

        setTimeout(async () => {
            fetch(`http://server:3000/transaction/psp-confirm/${transactionToken}`, {
                method: 'POST'
            })
        }, 100000)
    }
}