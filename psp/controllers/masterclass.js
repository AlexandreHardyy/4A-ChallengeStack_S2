module.exports = {
    post: async (req, res) => {

        res.sendStatus(202)

        const { operationId } = req.body

        setTimeout(async () => {
            try {
                await fetch(`http://server:3000/transaction/psp-confirm/${operationId}`, {
                    method: 'POST'
                })
            } catch (err) {
                console.log(err)
            }
        }, 100000)
    }
}