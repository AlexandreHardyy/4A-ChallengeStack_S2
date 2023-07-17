const request = require("supertest")
const baseURL = "http://localhost:3000"

describe("GET /", () => {
  it("should return 200", async () => {
    const response = await request(baseURL).get("/")
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('API payment working !')
  })
})
