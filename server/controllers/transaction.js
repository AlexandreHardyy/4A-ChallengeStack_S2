const transactionService = require("../services/transaction")
const operationService = require("../services/operation")
const transactionHistoryService = require("../services/transactionHistory")
const operationHistoryService = require("../services/operationHistory")
const event = require("../controllers/event")

const TransactionController = {
  post: async (req, res, next) => {
    if (!req.body) return res.sendStatus(422)

    const { company, amount } = ( req.body )

    if (!company || !amount) return res.sendStatus(422)
    
    const commission = amount * 0.011

    try {
      const newTransaction = {
        ...req.body,
        commission,
        status: 'created',
        companyId: company.id,
      }

      delete newTransaction.company
      const transaction = await transactionService.create(newTransaction)
      await transactionHistoryService.create({ transactionId: transaction.id, status: 'created'})
      await event.send(company.id, {
        name: "transaction-created",
        data: {
          transaction
        }
      })
      res.status(201).json({transaction})
    } catch (err) {
      next(err)
    }
  },
  cget: async (req, res, next) => {
    const {
      _page = 1,
      _itemsPerPage = 10,
      _sort = {},
      ...criteria
    } = req.query
    try {
      const transactions = await transactionService.findAll(criteria, {
        offset: (_page - 1) * _itemsPerPage,
        limit: _itemsPerPage,
        order: _sort,
      })
      res.json(transactions)
    } catch (err) {
      next(err)
    }
  },
  get: async (req, res, next) => {
    try {
      const transaction = await transactionService.findById(req.params.id)
      if (!transaction) return res.sendStatus(404)
      if (req.user.companyId !== transaction.company.id && !req.user.isAdmin) { return res.sendStatus(403) }
      res.json(transaction)
    } catch (err) {
      next(err)
    }
  },
  getByCompanyId: async (req, res, next) => {
    if (!req.params.id) return res.sendStatus(422)
    if (Number(req.params.id) !== req.user.companyId) return res.sendStatus(403)

    req.query.companyId = req.params.id

    return TransactionController.cget(req, res, next)
  },
  confirm: async (req, res, next) => {
    if (!req.body) return res.sendStatus(422)
    
    const transaction = await transactionService.findByToken(req.params.token)

    if (!transaction) return res.sendStatus(404)

    const { amount, currency } = transaction
    const price = parseInt(amount)
    const { cbNumber, cbName, expirationDate, cvc } = req.body

    if (!cbNumber || !cbName || !expirationDate || !cvc) return res.sendStatus(422)

    if (typeof cbNumber !== 'string' || typeof cbName !== 'string' || typeof currency !== 'string') return res.sendStatus(400)

    const sanitizedCbNumber = cbNumber.trim().split('-').join('')
    const sanitizedCurrency = currency.trim().toUpperCase()

    if (sanitizedCbNumber.length !== 16 || sanitizedCurrency.length !== 3) return res.sendStatus(400)

    if (price < 0) return res.sendStatus(400)

    try {
      const operation = await operationService.create({
        transactionId: transaction.id,
        amount: price,
        status: 'created',
        type: 'capture'
      })

      await operationHistoryService.create({
        operationId: operation.id,
        status: 'created'
      })

      await fetch('http://psp:3001/operation', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          {
            operationId: operation.id,
            cbNumber,
            cbName,
            expirationDate,
            cvc,
            price,
            currency
          }
        )
      }).then(async (response) => {
        if (response.status === 202) {
          await operationService.update({ id: operation.id }, { status: 'processing' })
          await operationHistoryService.create({ operationId: operation.id, status: 'processing'})
          return res.status(201).json(await transactionService.findById(parseInt(transaction.id)))
        } else {
          await operationService.update({ id: operation.id }, { status: 'psp-error' })
          await operationHistoryService.create({ operationId: operation.id, status: 'psp-error'})
          await transactionService.update({ id: transaction.id }, { status: 'failed' })
          await transactionHistoryService.create({transactionId: transaction.id, status: 'failed'})
          return res.status(400).json(await transactionService.findById(parseInt(transaction.id)))
        }
      }).catch(() => {
        return res.sendStatus(500)
      })
    } catch (err) {
      next(err)
    }
  },
  cancel: async (req, res, next) => {
    const transaction = await transactionService.findByToken(req.params.token)

    if (!transaction) return res.sendStatus(404)

    try {
      const updatedTransaction = await transactionService.update({ id: transaction.id }, { status: 'canceled' })         
      return res.status(201).json(updatedTransaction)
    } catch (err) {
      next(err)
    }
  },
  pspConfirm: async (req, res, next) => {
    const operation = await operationService.findById(req.params.operationId)

    if (!operation) return res.sendStatus(404)

    try {
      await operationService.update({ id: operation.id}, { status: 'done' })
      await operationHistoryService.create({ operationId: operation.id, status: 'done'})

      if (operation.type === 'capture') {
        await transactionService.update({ id: operation.transactionId }, { status: 'captured' })
        await transactionHistoryService.create({transactionId: operation.transactionId, status: 'captured'})
      } else if (operation.type === 'refund'){
        const operations = await operationService.findAll({transactionId: operation.transactionId})

        const refundableAmount = operations.reduce((acc, operation) => {
          if (operation.type === 'refund') {
            return acc - operation.amount
          } else {
            return acc + operation.amount
          }
        }, 0)

        if (refundableAmount === 0) {
          await transactionService.update({ id: operation.transactionId }, { status: 'refunded' })
          await transactionHistoryService.create({transactionId: operation.transactionId, status: 'refunded'})
        } else {
          await transactionService.update({ id: operation.transactionId }, { status: 'partially-refunded' })
          await transactionHistoryService.create({transactionId: operation.transactionId, status: 'partially-refunded'})
        }
      }
      return res.sendStatus(201)
    } catch (err) {
      next(err)
    }
  },
  refund: async (req, res, next) => {
    if (!req.body) return res.sendStatus(422)

    const transaction = await transactionService.findByToken(req.params.token)

    const { amount } = req.body

    if (amount <= 0) return res.sendStatus(400)

    if (!transaction) return res.sendStatus(404)

    try {
      //get all the operations of the transaction
      const operations = await operationService.findAll({transactionId: transaction.id})

      //calculate the refundable amount. if the operation.type === 'refund' then add the amount to the operation.amount else if the operation.type === 'capture' then subtract the amount from the operation.amount
      const refundableAmount = operations.reduce((acc, operation) => {
        if (operation.type === 'refund' && (operation.status === 'done' || operation.status === 'processing')) {
          return acc - operation.amount
        } else {
          return acc + operation.amount
        }
      }, 0)

      //check if the request amount is not superior to the transaction amount
      if (refundableAmount >= amount) {

        const operation = await operationService.create({
          transactionId: transaction.id,
          amount,
          status: 'created',
          type: 'refund'
        })

        await operationHistoryService.create({
          operationId: operation.id,
          status: 'created'
        })

        await fetch('http://psp:3001/operation', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            {
              operationId: operation.id,
              price: parseInt(operation.amount),
              currency: transaction.currency
            }
          )
        }).then(async (response) => {
          if (response.status === 202) {
            await operationService.update({ id: operation.id }, { status: 'processing' })
            await operationHistoryService.create({ operationId: operation.id, status: 'processing'})
            return res.status(201).json(await transactionService.findById(parseInt(transaction.id)))
          } else {
            await operationService.update({ id: operation.id }, { status: 'psp-error' })
            await operationHistoryService.create({ operationId: operation.id, status: 'psp-error'})
            await transactionService.update({ id: transaction.id }, { status: 'failed' })
            await transactionHistoryService.create({transactionId: transaction.id, status: 'failed'})
            return res.status(400).json(await transactionService.findById(parseInt(transaction.id)))
          }
        }).catch(() => {
          return res.sendStatus(500)
        })

      } else {
        return res.sendStatus(400)
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = TransactionController