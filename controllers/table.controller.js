
const Item = require('../models/item.model');  // Assuming you have an Item model
const Table = require('../models/table.model');

// Create a new table with items assigned
const createTable = async (req, res) => {
  const newTable = new Table(req.body);

  newTable.save()
    .then(savedTable => {
      res.status(201).json(savedTable);  // Return the saved table with its generated ID
    })
    .catch(err => {
      res.status(400).json({ error: 'Error adding table', details: err });
    });
};

// Get all tables with populated items
const getAllTables = async (req, res) => {
  try {
    const tablesWithAssignedItems = await Table.aggregate([
      {
        $lookup: {
          from: "items", // Reference to the 'Item' collection
          localField: "name", // Field in the Table collection to match
          foreignField: "assigned_to", // Field in the Item collection to match
          as: "items_assigned" // The result will be stored in the 'items_assigned' array
        }
      }
    ]);
  
    res.json(tablesWithAssignedItems);
  } catch (error) {

    res.status(500).json({ message: error.message });
  }
};

// Get a single table with populated items by ID
const getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate('items_assigned');
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching table', error });
  }
};

const updateTable = async (req, res) => {
  try {
    const { name, location, employee } = req.body;
    const tableId = req.params.id;

    // Find the table by ID and update it
    const table = await Table.findByIdAndUpdate(
      tableId,
      { name, location, employee },
      { new: true }  // Return the updated table
    );

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
  
    res.status(200).json(table);  // Return the updated table
  } catch (error) {
    res.status(500).json({ message: 'Error updating table', error: error.message });
  }
};

// Add an item to a table
const addItemToTable = async (req, res) => {
  const { tableId } = req.params;
  const { itemId } = req.body;

  try {
    const table = await Table.findById(tableId);
    const item = await Item.findById(itemId);

    if (!table || !item) {
      return res.status(404).json({ message: 'Table or Item not found' });
    }

    // Add the item to the table
    table.items_assigned.push(item);
    await table.save();
    res.status(200).json({ message: 'Item added to table', table });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to table', error });
  }
};

const deleteTable = async (req, res) => {
  try {
    const tableId = req.params.id;

    // Find and delete the table by ID
    const deletedTable = await Table.findByIdAndDelete(tableId);

    // If no table is found with the given ID
    if (!deletedTable) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json({ message: 'Table deleted successfully', table: deletedTable });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting table', error });
  }
};

// Remove an item from a table
const removeItemFromTable = async (req, res) => {
  try {
    const { itemId } = req.params;  // The item ID passed in the URL
    const { tableId } = req.body;   // The table ID passed in the body

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Remove the item from the table's items_assigned array
    table.items_assigned.pull(itemId);  // Remove item from the array
    await table.save();  // Save the updated table

    res.status(200).json({ message: 'Item removed from table', table });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from table', error });
  }
};




module.exports = {
  createTable,
  updateTable,
  getAllTables,
  getTableById,
  addItemToTable,
  removeItemFromTable,
  deleteTable,
  
};
