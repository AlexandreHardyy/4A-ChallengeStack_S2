const express = require("express")
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors());

app.get("/", (req, res) => { return res.send("Merchant Server working !") })

app.post("/", async (req, res, next) => {
	const { name, email, amount } = req.body

	if ( !name || !email || !amount ) {
		return res.sendStatus(422) 
	}

	try {
		await fetch('http://server:3000/transaction/', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				name,
				email,
				amount,
				currency: 'EUR',
				apiToken: process.env.API_TOKEN
			})
		}).then(async (response) => {
			if (response.status === 201) {
				return res.status(201).json(await response.json())
			}
		}).catch(() => {
			return res.sendStatus(500)
		})
	} catch (err) {
		next(err)
	}
})


app.use(function(req, res, next) {
  return res.status(404).json({ error: 'this route doesn\'t exist.' })
});

app.listen(3009, () => console.log("Server started on port 3009"))
