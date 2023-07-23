const httpMocks = require('node-mocks-http')

const transactionController = require("../controllers/transaction")
const transactionService = require("../services/transaction")
const operationService = require('../services/operation')

const baseURL = "http://localhost:3000"

describe("Transaction Controller", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Transaction cget', () => {
    it("Should retrieve all transaction", async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: `${baseURL}/transaction`
      })
  
      const result = [
        { 
          id: 1,
          token: 'abcd-1234',
          name: 'José',
          email: 'jose@gmail.com',
          amount: 50,
          currency: 'EUR',
          urlDirectionConfirm: 'lala',
          urlDirectionCancel: 'lolo'
        },
        { 
          id: 1,
          token: 'efgh-5678',
          name: 'Phillipe',
          email: 'phillipe@gmail.com',
          amount: 50,
          currency: 'EUR',
          urlDirectionConfirm: 'lala',
          urlDirectionCancel: 'lolo'
        },
      ]
    
      const res = httpMocks.createResponse()
    
      const next = jest.fn()
      jest.spyOn(transactionService, 'findAll').mockResolvedValue(result)
  
      await transactionController.cget(req, res, next)
  
      expect(res.statusCode).toBe(200)
      
      expect(res._getJSONData()).toEqual(result)
      expect(transactionService.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('Transaction get', () => {
    it("Should retrieve one transaction", async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: `${baseURL}/transaction/abcd-1234`,
        params: {
          token: 'abcd-1234'
        }
      })
  
      const result = [{ 
        id: 1,
        token: 'abcd-1234',
        name: 'José',
        email: 'jose@gmail.com',
        amount: 50,
        currency: 'EUR',
        urlDirectionConfirm: 'lala',
        urlDirectionCancel: 'lolo'
      }]
    
      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findTransactionByTokenSpy =  jest.spyOn(transactionService, 'findByToken').mockResolvedValue(result)
  
      await transactionController.get(req, res, next)
  
      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('abcd-1234')
      expect(res.statusCode).toBe(200)
      expect(res._getJSONData()).toEqual(result)
      expect(transactionService.findByToken).toHaveBeenCalledTimes(1)
    })

    it('Should return status 404 if the transaction is not found', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: `${baseURL}/transaction/wrong-token`,
        params: {
          token: 'wrong-token'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()
      
      const findTransactionByTokenSpy =  jest.spyOn(transactionService, 'findByToken').mockResolvedValue(null)

      await transactionController.get(req, res, next)

      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('wrong-token')
      expect(res.statusCode).toBe(404)
      expect(transactionService.findByToken).toHaveBeenCalledTimes(1)
    })
  })

  describe('Transaction post', () => {
    it('should create a transaction and return it', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/`,
        body: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          amount: 100,
          currency: 'USD',
          company: {
            id: 1,
            urlDirectionConfirm: 'https://example.com/confirm',
            urlDirectionCancel: 'https://example.com/cancel',
          },
        }
      })
    
      const res = httpMocks.createResponse()
      const next = jest.fn()
  
      const createTransactionSpy = jest.spyOn(transactionService, 'create').mockResolvedValue({ id: 1 })
      const createOperationSpy = jest.spyOn(operationService, 'create').mockResolvedValue()
  
      await transactionController.post(req, res, next)
  
      expect(createTransactionSpy).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john.doe@example.com',
        amount: 100,
        currency: 'USD',
        companyId: 1,
        urlDirectionConfirm: 'https://example.com/confirm',
        urlDirectionCancel: 'https://example.com/cancel',
      })
      expect(createOperationSpy).toHaveBeenCalledWith({
        transactionId: 1,
        status: 'created',
      })
      expect(res.statusCode).toBe(201)
      expect(res._getJSONData()).toEqual({transaction: { id: 1 }})
      expect(transactionService.create).toHaveBeenCalledTimes(1)
      expect(operationService.create).toHaveBeenCalledTimes(1)
    })

    it('Should throw with status 422 id required fields are missing', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/`,
        body: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          //amount is missing
          currency: 'USD',
          company: {
            id: 1,
            urlDirectionConfirm: 'https://example.com/confirm',
            urlDirectionCancel: 'https://example.com/cancel',
          },
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()

      await transactionController.post(req, res, next)

      expect(res.statusCode).toBe(422)
    })
  })

  describe('Transaction confirm', () => {
    it('Should confirm a transaction and return it', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/confirm/abcd-1234`,
        params: {
          token: 'abcd-1234'
        },
        body: {
          cbNumber: '1111 2222 3333 4444',
          cbName: 'José'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findTransactionByTokenSpy = jest.spyOn(transactionService, 'findByToken').mockResolvedValue({ id: 1, token: 'abcd-1234', amount: 100, currency: 'EUR', Operations: [{ status: 'created' }] })
      const findTransactionByIdSpy = jest.spyOn(transactionService, 'findById').mockResolvedValue({ id: 1 })
      const createOperationSpy = jest.spyOn(operationService, 'create').mockResolvedValue()
      const fetchPostSpy = jest.spyOn(global, 'fetch').mockResolvedValue({ status: 202 })

      await transactionController.confirm(req, res, next)

      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('abcd-1234')
      expect(findTransactionByIdSpy).toHaveBeenCalledWith(1)
      expect(createOperationSpy).toHaveBeenCalledWith({
        transactionId: 1,
        status: 'waiting-psp-validation',
      })
      expect(fetchPostSpy).toHaveBeenCalledWith('http://psp:3001/transaction-approuval', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          {
            transactionToken: 'abcd-1234',
            cbNumber: '1111 2222 3333 4444',
            cbName: 'José',
            price: 100,
            currency: 'EUR',
          }
        )
      })

      expect(res.statusCode).toBe(201)
      expect(res._getJSONData()).toEqual({ id: 1 })
      expect(transactionService.findByToken).toHaveBeenCalledTimes(1)
      expect(transactionService.findById).toHaveBeenCalledTimes(1)
      expect(operationService.create).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
    it('Should throw with status 422 id required fields are missing', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/confirm/abcd-1234`,
        params: {
          token: 'abcd-1234'
        },
        body: {
          //missing CbNumber
          cbName: 'José'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()

      await transactionController.confirm(req, res, next)

      expect(res.statusCode).toBe(422)
    })

    it('Should throw with status 4O4 if the transaction is not found', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/confirm/wrong-token`,
        params: {
          token: 'wrong-token'
        },
        body: {
          cbNumber: '1111 2222 3333 4444',
          cbName: 'José'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()
      
      const findTransactionByTokenSpy =  jest.spyOn(transactionService, 'findByToken').mockResolvedValue(null)

      await transactionController.confirm(req, res, next)

      expect(res.statusCode).toBe(404)
      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('wrong-token')
      expect(findTransactionByTokenSpy).toHaveBeenCalledTimes(1)
    })
    it('Should throw with status 4O0 if the last operation status is not created', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/confirm/abcd-1234`,
        params: {
          token: 'abcd-1234'
        },
        body: {
          cbNumber: '1111 2222 3333 4444',
          cbName: 'José'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findTransactionByTokenSpy = jest.spyOn(transactionService, 'findByToken').mockResolvedValue({ id: 1, token: 'abcd-1234', amount: 100, currency: 'EUR', Operations: [{ status: 'canceled' }] })

      await transactionController.confirm(req, res, next)

      expect(res.statusCode).toBe(400)
      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('abcd-1234')
      expect(findTransactionByTokenSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Transaction cancel', () => {
    it('Should cancel a transaction and return it', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/cancel/abcd-1234`,
        params: {
          token: 'abcd-1234'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findTransactionByTokenSpy = jest.spyOn(transactionService, 'findByToken').mockResolvedValue({ id: 1, Operations: [{ status: 'created' }] })
      const createOperationSpy = jest.spyOn(operationService, 'create').mockResolvedValue()

      await transactionController.cancel(req, res, next)

      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('abcd-1234')
      expect(createOperationSpy).toHaveBeenCalledWith({
        transactionId: 1,
        status: 'canceled',
      })
      expect(res.statusCode).toBe(201)
      expect(res._getJSONData()).toEqual({ id: 1 })
      expect(transactionService.findByToken).toHaveBeenCalledTimes(1)
      expect(operationService.create).toHaveBeenCalledTimes(1)
    })
    it('Should throw with status 4O4 if the transaction is not found', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/cancel/wrong-token`,
        params: {
          token: 'wrong-token'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()
      
      const findTransactionByTokenSpy =  jest.spyOn(transactionService, 'findByToken').mockResolvedValue(null)

      await transactionController.cancel(req, res, next)

      expect(res.statusCode).toBe(404)
      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('wrong-token')
      expect(findTransactionByTokenSpy).toHaveBeenCalledTimes(1)
    })
    it('Should throw with status 4O0 if the last operation status is not created', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/cancel/abcd-1234`,
        params: {
          token: 'abcd-1234'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findTransactionByTokenSpy = jest.spyOn(transactionService, 'findByToken').mockResolvedValue({ id: 1, Operations: [{ status: 'finished' }] })

      await transactionController.cancel(req, res, next)

      expect(res.statusCode).toBe(400)
      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('abcd-1234')
      expect(findTransactionByTokenSpy).toHaveBeenCalledTimes(1)
    })
  })
  describe('Transaction pspConfirm', () => {
    it('should update the transaction status to finished', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/psp-confirm/abcd-1234`,
        params: {
          token: 'abcd-1234'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findTransactionByTokenSpy = jest.spyOn(transactionService, 'findByToken').mockResolvedValue({ id: 1, amount: 55, Operations: [{ status: 'waiting-psp-validation' }] })
      const updateTransactionByTokenSpy = jest.spyOn(transactionService, 'update').mockResolvedValue()
      const createOperationSpy = jest.spyOn(operationService, 'create').mockResolvedValue()

      await transactionController.pspConfirm(req, res, next)

      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('abcd-1234')
      expect(updateTransactionByTokenSpy).toHaveBeenCalledWith({ id: 1 }, { commission: 55 * 0.011 })
      expect(createOperationSpy).toHaveBeenCalledWith({
        transactionId: 1,
        status: 'finished',
      })
      expect(res.statusCode).toBe(201)
      expect(transactionService.findByToken).toHaveBeenCalledTimes(1)
      expect(transactionService.update).toHaveBeenCalledTimes(1)
      expect(operationService.create).toHaveBeenCalledTimes(1)
    })
    it('Should throw with status 4O4 if the transaction is not found', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/psp-confirm/wrong-token`,
        params: {
          token: 'wrong-token'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()
      
      const findTransactionByTokenSpy =  jest.spyOn(transactionService, 'findByToken').mockResolvedValue(null)

      await transactionController.pspConfirm(req, res, next)

      expect(res.statusCode).toBe(404)
      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('wrong-token')
      expect(findTransactionByTokenSpy).toHaveBeenCalledTimes(1)
    })
    it('Should throw with status 4O0 if the last operation status is not created', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/psp-confrim/abcd-1234`,
        params: {
          token: 'abcd-1234'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findTransactionByTokenSpy = jest.spyOn(transactionService, 'findByToken').mockResolvedValue({ id: 1, Operations: [{ status: 'created' }] })

      await transactionController.pspConfirm(req, res, next)

      expect(res.statusCode).toBe(400)
      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('abcd-1234')
      expect(findTransactionByTokenSpy).toHaveBeenCalledTimes(1)
    })
  })
})  
