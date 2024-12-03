// controllers/transactionController.js
const AuditLog = require('../models/transaction.model');
const Item = require('../models/item.model');
const Table = require('../models/table.model'); // Assuming you may still want to track transactions by tables or areas


// Get all transactions (stock movements)
const getAllTransactions = async (req, res) => {
  try {
    const auditLogs = await AuditLog.find().populate('user', 'username'); // You can populate user info if needed
    res.json(auditLogs); 
  } catch (err) {
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
};

// Get a specific transaction by ID




module.exports = { createTransaction, getAllTransactions, getTransactionsByTable, getTransactionById };
