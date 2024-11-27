const express = require('express')

const router = express.Router();


const { 
  createTable, 
  getAllTables, 
  updateTable,
  getTableById, 
  addItemToTable, 
  removeItemFromTable,
  deleteTable,
 
} = require('../controllers/table.controller');



// Create a new table
router.post('/', createTable);

// Get all tables
router.get('/', getAllTables);

// Get a single table by ID
router.get('/:id', getTableById);

router.put('/:id', updateTable);

router.delete('/:id', deleteTable);

// Add an item to a table
router.post('/:tableId/add-item', addItemToTable);

// Remove an item from a table
router.delete('/:tableId/items/:itemId', removeItemFromTable);

module.exports = router;
