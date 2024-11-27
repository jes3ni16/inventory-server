
const express = require('express')
const router = express.Router();



const {createTransaction, getAllTransactions, getTransactionsByTable, getTransactionById } = require('../controllers/transaction.controller');


// Route to create a new transaction
router.post('/transactions', createTransaction);

// Route to get all transactions
router.get('/transactions', getAllTransactions);

// Route to get transactions for a specific table (by tableId)
router.get('/transactions/table/:tableId', getTransactionsByTable);

// Route to get a specific transaction by its ID
router.get('/transactions/:id', getTransactionById);

module.exports = router;




