
const Item = require('../models/item.model');
const Table = require('../models/table.model');

const getItems = async (req, res) => {
  try {
    const { assigned_to } = req.query; // Get the 'assigned_to' value from the query
    
    // If assigned_to is provided, filter items by assigned_to
    const filter = assigned_to ? { assigned_to } : {};
    
    // Fetch items based on the filter
    const items = await Item.find(filter).populate('assigned_to').exec();
    
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};




  const createItem = async (req, res) => {
    try {
      const newItem = new Item(req.body);
      await newItem.save();
      res.status(201).json(newItem); // Return the newly added item
    } catch (err) {
      res.status(500).json({ message: 'Error adding item' });
    }
  };
  

  const getItem = async (req, res) => {
    try {
      const { id } = req.params;  // Retrieve the item ID from the URL params
      
      if (!id) {
        return res.status(400).json({ message: 'Item ID is required' });
      }
  
      // Fetch a specific item by its ID without populating the assigned_to field
      const item = await Item.findById(id).exec();
      
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch item' });
    }
  };

  const updateItem = async (req, res) => {
    try {
      const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }  // This ensures the updated document is returned
      );
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(updatedItem);  // Send back the updated item as the response
    } catch (error) {
      res.status(500).send('Server Error');
    }
  };


  const deleteItem = async(req, res) => {
    try{
      const {id} = req.params;
      const item = await Item.findByIdAndDelete(id, req.body);
      
      if(!item){
        return res.status(404).json({message: error.message})
      }
      res.status(200).json({message: "item successfully deleted"});

    }catch(error){
      res.status(500).json({message: error.message})
    }
  }

  const stockOutItem = async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity, reason, tableId } = req.body; // Reason for stock-out and tableId (if the part is used)
  
      // Find the item
      const item = await Item.findById(id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Find the table (only for stock-out reason 'use')
      if (reason === 'use') {
        const table = await Table.findById(tableId);
        if (!table) {
          return res.status(404).json({ message: 'Table not found' });
        }
        // Set the tableUsed to the table being used
        item.tableUsed = table._id;
      }
  
      // Check if enough stock is available
      if (item.quantity < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
  
      // Reduce the stock by the quantity
      item.quantity -= quantity;
  
      // Update status if stock runs out
      if (item.quantity === 0) {
        item.status = 'out of stock';
      }
  
      // Update stock-out reason and timestamp
      item.stockOutReason = reason || 'Used/Disposed';
      item.stockOutTimestamp = new Date();
  
      // Save the updated item
      await item.save();
  
      res.status(200).json({
        message: `Stock-out successful. ${quantity} items removed.`,
        item,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  module.exports = {getItems, createItem, getItem, updateItem, deleteItem, stockOutItem}