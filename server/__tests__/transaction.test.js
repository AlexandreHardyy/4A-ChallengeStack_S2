const httpMocks = require('node-mocks-http')

const transactionController = require("../controllers/transaction")
const transactionService = require("../services/transaction")
const operationService = require('../services/operation')
const transactionHistoryService = require("../services/transactionHistory")
const operationHistoryService = require("../services/operationHistory")

const baseURL = "http://localhost:3000"

describe("Transaction Controller", () => {

  beforeEach(() => {

    jest.spyOn(operationService, 'update').mockResolvedValue()
    jest.spyOn(transactionService, 'update').mockResolvedValue()
    jest.spyOn(transactionHistoryService, 'create').mockResolvedValue()
    jest.spyOn(transactionHistoryService, 'update').mockResolvedValue()
    jest.spyOn(operationHistoryService, 'create').mockResolvedValue()
    jest.spyOn(operationHistoryService, 'update').mockResolvedValue()
  })

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
          currency: 'EUR'
        },
        { 
          id: 1,
          token: 'efgh-5678',
          name: 'Phillipe',
          email: 'phillipe@gmail.com',
          amount: 50,
          currency: 'EUR'
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
          id: 1
        },
        user: {
          companyId: 1
        }
      })
  
      const result = [{ 
        id: 1,
        token: 'abcd-1234',
        name: 'José',
        email: 'jose@gmail.com',
        amount: 50,
        currency: 'EUR'
      }]
    
      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findTransactionByIdSpy =  jest.spyOn(transactionService, 'findById').mockResolvedValue(result)
  
      await transactionController.get(req, res, next)
  
      expect(findTransactionByIdSpy).toHaveBeenCalledWith(1)
      expect(res.statusCode).toBe(200)
      expect(res._getJSONData()).toEqual(result)
      expect(transactionService.findById).toHaveBeenCalledTimes(1)
    })

    it('Should return status 404 if the transaction is not found', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: `${baseURL}/transaction/wrong-token`,
        params: {
          id: 1
        },
        user: {
          companyId: 1
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()
      
      const findTransactionByTokenSpy =  jest.spyOn(transactionService, 'findById').mockResolvedValue(null)

      await transactionController.get(req, res, next)

      expect(findTransactionByTokenSpy).toHaveBeenCalledWith(1)
      expect(res.statusCode).toBe(404)
      expect(transactionService.findById).toHaveBeenCalledTimes(1)
    })
  })

  describe('Transaction post', () => {
    it('should create a transaction and return it', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction`,
        body: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          amount: 100,
          commission: 1.1,
          currency: 'USD',
          status: 'created',
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
  
      await transactionController.post(req, res, next)
  
      expect(createTransactionSpy).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john.doe@example.com',
        amount: 100,
        commission: 1.1,
        currency: 'USD',
        companyId: 1,
        status: 'created'
      })
      expect(res.statusCode).toBe(201)
      expect(res._getJSONData()).toEqual({transaction: { id: 1 }})
      expect(transactionService.create).toHaveBeenCalledTimes(1)
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
          cbName: 'José',
          expirationDate: '2025-06',
          cvc: '123'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findTransactionByTokenSpy = jest.spyOn(transactionService, 'findByToken').mockResolvedValue({ id: 1, token: 'abcd-1234', amount: 100, commission: 1.1, currency: 'EUR', operations: [{ status: 'created' }] })
      const findTransactionByIdSpy = jest.spyOn(transactionService, 'findById').mockResolvedValue({ id: 1 })
      const createOperationSpy = jest.spyOn(operationService, 'create').mockResolvedValue({ id: 1 })
      jest.spyOn(global, 'fetch').mockResolvedValue(Promise.resolve({
        status: 202,
        json: () => Promise.resolve({}),
      }))

      await transactionController.confirm(req, res, next)

      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('abcd-1234')
      expect(findTransactionByIdSpy).toHaveBeenCalledWith(1)
      expect(createOperationSpy).toHaveBeenCalledWith({
        transactionId: 1,
        status: 'waiting-psp-validation',
        amount: 100,
        status: 'created',
        type: 'capture'
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
          cbName: 'José',
          expirationDate: '2025-06',
          cvc: '123'
        }
      })

      jest.spyOn(global, 'fetch').mockResolvedValue(Promise.resolve({
        status: 500,
        json: () => Promise.resolve({}),
      }))

      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findTransactionByTokenSpy = jest.spyOn(transactionService, 'findByToken').mockResolvedValue({ id: 1, token: 'abcd-1234', amount: 100, commission: 1.1, currency: 'EUR', operations: [{ status: 'canceled' }] })

      await transactionController.confirm(req, res, next)

      expect(res.statusCode).toBe(400)
      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('abcd-1234')
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

      const findTransactionByTokenSpy = jest.spyOn(transactionService, 'findByToken').mockResolvedValue({ id: 1, operations: [{ status: 'created' }] })

      await transactionController.cancel(req, res, next)

      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('abcd-1234')
      expect(res.statusCode).toBe(201)
      expect(transactionService.findByToken).toHaveBeenCalledTimes(1)
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
  })
  describe('Transaction pspConfirm', () => {
    it('should update the transaction status to finished', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/psp-confirm/1`,
        params: {
          operationId: 1
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findOperationByIdSpy = jest.spyOn(operationService, 'findById').mockResolvedValue({ id: 1, type: 'capture' })

      await transactionController.pspConfirm(req, res, next)

      expect(findOperationByIdSpy).toHaveBeenCalledWith(1)
      expect(operationService.update).toHaveBeenCalledTimes(1)
      expect(transactionService.update).toHaveBeenCalledTimes(1)

      expect(res.statusCode).toBe(201)
    })
    it('Should throw with status 4O4 if the transaction is not found', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/psp-confirm/0`,
        params: {
          token: '0'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()
      
      jest.spyOn(operationService, 'findById').mockResolvedValue(null)

      await transactionController.pspConfirm(req, res, next)

      expect(operationService.findById).toHaveBeenCalledTimes(1)
      expect(res.statusCode).toBe(404)
    })
  })

  //transaction refund
  describe('Transaction refund', () => {
    it('Should refund a transaction and return it', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/refund/abcd-1234`,
        params: {
          token: 'abcd-1234'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findTransactionByTokenSpy = jest.spyOn(transactionService, 'findByToken').mockResolvedValue({ id: 1, Operations: [{ status: 'finished' }] })
      const createOperationSpy = jest.spyOn(operationService, 'create').mockResolvedValue()

      await transactionController.refund(req, res, next)

      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('abcd-1234')
      expect(createOperationSpy).toHaveBeenCalledWith({
        transactionId: 1,
        status: 'refunded',
      })
      expect(res.statusCode).toBe(201)
      expect(res._getJSONData()).toEqual({ id: 1 })
      expect(transactionService.findByToken).toHaveBeenCalledTimes(1)
      expect(operationService.create).toHaveBeenCalledTimes(1)
    })
    it('Should throw with status 4O4 if the transaction is not found', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/refund/wrong-token`,
        params: {
          token: 'wrong-token'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findTransactionByTokenSpy =  jest.spyOn(transactionService, 'findByToken').mockResolvedValue(null)

      await transactionController.refund(req, res, next)

      expect(res.statusCode).toBe(404)
      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('wrong-token')
      expect(findTransactionByTokenSpy).toHaveBeenCalledTimes(1)
    })
    it('Should throw with status 4O0 if the last operation status is not created', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: `${baseURL}/transaction/refund/abcd-1234`,
        params: {
          token: 'abcd-1234'
        }
      })

      const res = httpMocks.createResponse()
      const next = jest.fn()

      const findTransactionByTokenSpy = jest.spyOn(transactionService, 'findByToken').mockResolvedValue({ id: 1, Operations: [{ status: 'finished' }] })

      await transactionController.pspConfirm(req, res, next)

      expect(res.statusCode).toBe(400)
      expect(findTransactionByTokenSpy).toHaveBeenCalledWith('abcd-1234')
      expect(findTransactionByTokenSpy).toHaveBeenCalledTimes(1)
    })
  })
})
