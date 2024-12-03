
const express = require('express')
const router = express.Router();



const { getAllTransactions } = require('../controllers/transaction.controller');


// Route to create a new transaction
router.get('/transactions', getAllTransactions);



module.exports = router;




