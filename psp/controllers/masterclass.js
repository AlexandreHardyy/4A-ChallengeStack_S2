module.exports = {
    post: async (req, res) => {

        res.sendStatus(202)

        const { operationId } = req.body

        setTimeout(async () => {
            try {
                await fetch(`http://server:3000/transaction/web-hook`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                      },
                    body: JSON.stringify({operationId})
                })
            } catch (err) {
                console.log(err)
            }
        }, 30000)
    }
}