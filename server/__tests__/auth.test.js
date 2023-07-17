const { userAuth, adminAuth } = require("../middlewares/auth")

const res = {
    sendStatus: (status) => {
        return status
    }
}

const next = () => true
describe("Auth User", () => {  
    it("Should be 401", () => {
        const req = { headers: {} }
        expect(userAuth(req, res, next)).toEqual(401)
    })

    it("Should be 403", () => {
        const req = { headers: { authorization: 'Bearer 1234' } }
        expect(userAuth(req, res, next)).toEqual(403)
    })
})

describe("Auth Admin", () => { 
    it("Should be 401", () => {
        const req = { headers: {} }
        expect(adminAuth(req, res, next)).toEqual(401)
    })

    it("Should be 403", () => {
        const req = { headers: { authorization: 'Bearer 1234' } }
        expect(adminAuth(req, res, next)).toEqual(403)
    })
})
