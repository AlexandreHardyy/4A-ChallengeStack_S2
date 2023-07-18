const transactionService = require("../services/transaction")
const operationService = require("../services/operation")

const TransactionController = {
  post: async (req, res, next) => {
    if (!req.body) { return res.sendStatus(422) }

    const { company } = ( req.body )

    try {
      const newTransaction = {
        ...req.body,
        companyId: company.id,
        urlDirectionConfirm: company.urlDirectionConfirm,
        urlDirectionCancel: company.urlDirectionCancel
      }

      delete newTransaction.company
      const transaction = await transactionService.create(newTransaction)
      await operationService.create({
        transactionId: transaction.id,
        status: 'created'
      })

      // TODO: Need to return the both confirm and cancel urls and Operation ??
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
      const transaction = await transactionService.findByToken(req.params.token)
      if (!transaction) return res.sendStatus(404)
      res.json(transaction)
    } catch (err) {
      next(err)
    }
  },
  getByCompanyId: async (req, res, next) => {
    if (!req.params.id) {
      return res.sendStatus(422)
    }
    if (!req.params.id !== req.user.companyId) {
      return res.sendStatus(403)
    }
    req.query.companyId = req.params.id 

    return TransactionController.cget(req, res, next)
  },
  confirm: async (req, res, next) => {
    if (!req.body) { return res.sendStatus(422) }
    
    const transaction = await transactionService.findByToken(req.params.token)

    if (!transaction) { return res.sendStatus(404) }

    if (transaction.operations[0].status !== 'created') { return res.sendStatus(400) }

    const { cbNumber, cbName, expirationDate, cvc } = req.body

    if (!cbNumber || !cbName || !expirationDate || !cvc) { return res.sendStatus(422) }

    try {
      await fetch('http://psp:3001/transaction-approuval', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          {
            transactionToken: transaction.token,
            cbNumber,
            cbName,
            expirationDate,
            cvc,
            price: parseInt(transaction.amount),
            currency: transaction.currency
          }
        )
      }).then(async (response) => {
        if (response.status === 202) {
          await operationService.create({
            transactionId: transaction.id,
            status: 'waiting-psp-validation'
          })
          return res.status(201).json(await transactionService.findById(parseInt(transaction.id)))
        } else {
          await operationService.create({
            transactionId: transaction.id,
            status: 'psp-validation-failure'
          })
          
          // Another HTTP code ?
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

    if (!transaction) { return res.sendStatus(404) }

    if (transaction.operations[0].status !== 'created') { return res.sendStatus(400) }

    try {
      await operationService.create({
        transactionId: transaction.id,
        status: 'canceled'
      })          
      return res.status(201).json(await transactionService.findById(parseInt(transaction.id)))
    } catch (err) {
      next(err)
    }
  },
  pspConfirm: async (req, res, next) => {
    const transaction = await transactionService.findByToken(req.params.token)

    if (!transaction) { return res.sendStatus(404) }

    if (transaction.operations[0].status !== 'waiting-psp-validation') { return res.sendStatus(400) }

    const commission = transaction.amount * 0.011

    try {
      await operationService.create({
        transactionId: transaction.id,
        status: 'finished'
      })
      await transactionService.update({ id: transaction.id }, { commission })         
      return res.status(201)
    } catch (err) {
      next(err)
    }
  },
  refund: async (req, res, next) => {
    const transaction = await transactionService.findByToken(req.params.token)

    if (!transaction) return res.sendStatus(404)

    //check if last operation is finished
    if (transaction.operations[0].status !== 'finished') return res.sendStatus(400)
    
    //create operation with status refund
    try {
      await operationService.create({
        transactionId: transaction.id,
        status: 'refund'
      })
    } catch (err) {
      next(err)
    }

    return res.status(200).json(
      await transactionService.findById(parseInt(transaction.id))
    )
  }
}

module.exports = TransactionController