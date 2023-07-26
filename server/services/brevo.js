const URL_BREVO = 'https://api.brevo.com/v3'

const API_KEY = process.env.API_KEY_BREVO ?? ''

const sendMail = async ({ firstname, lastname, email, templateId }) => {
    console.log({ firstname, lastname, email, templateId })
    return fetch(`${URL_BREVO}/smtp/email` , {
        method: 'POST',
        headers: {
            'accept': 'application/json', 
            'content-type': 'application/json',
            'api-key': API_KEY
        },
        body: JSON.stringify({
            templateId,
            params: {
                firstname,
                lastname
            },
            sender: {
                email: 'noepigeau@gmail.com',
            },
            to: [{
                email
            }]
        })

    }).then(res => {
        res.status
        return res.json()
    })
    .then(res => console.log(res)).catch(err => {
        console.log(err)
    })
}

const BrevoMail = {
    async mailCreation(user) {
        return sendMail({ ...user, templateId: 1 })
    },
    async mailValidationAccount(user) {
        return sendMail({ ...user, templateId: 2 })
    }
}

module.exports = BrevoMail