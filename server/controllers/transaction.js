const axios = require('axios');

const transactionService = require("../services/transaction")
const operationService = require("../services/operation")

module.exports = {
  post: async (req, res, next) => {

    if (!req.body) { return res.sendStatus(422) }

    const { name, email, amount, currency, company } = ( req.body )

    if ( !name || !email || !amount || !currency || !company ) { return res.sendStatus(422) }

    try {
      const transaction = await transactionService.create({
        ...req.body,
        companyId: company.id,
        urlDirectionConfirm: company.urlDirectionConfirm,
        urlDirectionCancel: company.urlDirectionCancel
      })
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
  confirm: async (req, res, next) => {
    if (!req.body) { return res.sendStatus(422) }
    
    const transaction = await transactionService.findByToken(req.params.token)

    if (!transaction) { return res.sendStatus(404) }

    const lastOperations = transaction.Operations.sort(function(a,b){
      return new Date(b.createdAt) - new Date(a.createdAt);
    })

    if (lastOperations[0].status !== 'created') { return res.sendStatus(400) }

    const { cbNumber, cbName } = req.body

    if (!cbNumber || !cbName) { return res.sendStatus(422) }

    try {
      axios.post('http://psp:3001/transaction-approuval', {
        transactionToken: transaction.token,
        cbNumber,
        cbName,
        price: parseInt(transaction.amount),
        currency: transaction.currency
      }).then(async (response) => {
        if (response.status === 202) {
          await operationService.create({
            transactionId: transaction.id,
            status: 'waiting-psp-validation'
          })          
          return res.status(200).json(await transactionService.findById(parseInt(transaction.id)))
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

    try {
      await operationService.create({
        transactionId: transaction.id,
        status: 'canceled'
      })          
      return res.status(200).json(await transactionService.findById(parseInt(transaction.id)))
    } catch (err) {
      next(err)
    }
  },
  pspConfirm: async (req, res, next) => {
    const transaction = await transactionService.findByToken(req.params.token)

    if (!transaction) { return res.sendStatus(404) }

    const lastOperations = transaction.Operations.sort(function(a,b){
      return new Date(b.createdAt) - new Date(a.createdAt);
    })

    if (lastOperations[0].status !== 'waiting-psp-validation') { return res.sendStatus(400) }

    const commission = transaction.amount * 0.011

    try {
      await operationService.create({
        transactionId: transaction.id,
        status: 'finished'
      })
      await transactionService.update({ id: transaction.id }, { commission })         
    } catch (err) {
      next(err)
    }
  },
  refund: async (req, res, next) => {
    //get transaction
    const transaction = await transactionService.findByToken(req.params.token)

    if (!transaction) return res.sendStatus(404)
    //check if last operation is finished
    const lastOperations = transaction.Operations.sort(function(a,b){
      return new Date(b.createdAt) - new Date(a.createdAt);
    })

    if (lastOperations[0].status !== 'finished') return res.sendStatus(400)
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