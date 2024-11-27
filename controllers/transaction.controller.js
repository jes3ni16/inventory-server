// controllers/transactionController.js
const Transaction = require('../models/transaction.model');
const Item = require('../models/item.model');
const Table = require('../models/table.model'); // Assuming you may still want to track transactions by tables or areas

// Create a new transaction (stock movement)
const createTransaction = async (req, res) => {
  try {
    const { itemId, quantity, transaction_type, tableId } = req.body;

    // Find the item being transacted
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Handle stock changes based on the transaction type
    if (transaction_type === 'stock-out') {
      // Ensure there is enough stock for the stock-out transaction
      if (item.quantity < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }

      // Decrease the stock by the transaction quantity
      item.quantity -= quantity;
      if (item.quantity === 0) {
        item.status = 'out of stock'; // Mark item as out of stock if quantity reaches 0
      }
    } else if (transaction_type === 'restock') {
      // Increase the stock when restocking
      item.quantity += quantity;
      if (item.status === 'out of stock') {
        item.status = 'in stock'; // Mark item as in stock again
      }
    } else if (transaction_type === 'adjustment') {
      // Modify the stock manually, such as correcting errors or handling damaged parts
      item.quantity += quantity; // Can be positive or negative
      // Optional: Adjust item status based on the final quantity (this is up to your use case)
      if (item.quantity === 0) {
        item.status = 'out of stock';
      } else if (item.quantity > 0) {
        item.status = 'in stock';
      }
    } else {
      return res.status(400).json({ message: 'Invalid transaction type. Use "stock-out", "restock", or "adjustment"' });
    }

    // Save the item changes
    await item.save();

    // Create the transaction record
    const transaction = new Transaction({
      item: item._id,
      quantity,
      transaction_type,
      table: tableId, // Assuming tableId is used to track where the stock movement happened (could be a warehouse or section)
    });

    // Save the transaction to the database
    await transaction.save();

    res.status(201).json({ message: 'Transaction completed successfully', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all transactions (stock movements)
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('item').populate('table');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('item').populate('table');
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transactions for a specific table (optional, based on use case)
const getTransactionsByTable = async (req, res) => {
  try {
    const transactions = await Transaction.find({ table: req.params.tableId }).populate('item');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTransaction, getAllTransactions, getTransactionsByTable, getTransactionById };
