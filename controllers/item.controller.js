
const Item = require('../models/item.model');
const Table = require('../models/table.model');
const AuditLog = require('../models/transaction.model')

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
      const allowedFields = [
        'name',
        'serial_number',
        'sku',
        'description',
        'condition',
        'price',
        'assigned_to',
        'purchase_by',
        'purchase_date',
        'invoice',
        'location',
        'status',
      ];
      
      const filteredBody = {};
      allowedFields.forEach(field => {
        if (req.body[field]) filteredBody[field] = req.body[field];
      });
  
      const newItem = new Item(filteredBody);
      await newItem.save();
      await AuditLog.create({
        action: 'create',
        model: 'Item',
        modelId: newItem._id,
        user: req.user._id, // Assuming req.user is correctly set from middleware
      });
  
      res.status(201).json(newItem); // Return the newly added item
    } catch (err) {
      console.error("Error creating item:", err); // Detailed logging
      res.status(500).json({ message: 'Error adding item', error: err.message });
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
      // Update the item using the item ID from the request params
      const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,   // ID from URL params
        req.body,         // Data from the request body
        { new: true }     // Ensures the updated document is returned
      );
  
      if (!updatedItem) {
        // If no item is found with the given ID, return a 404 error
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Log the update action to the AuditLog
      await AuditLog.create({
        action: 'update',
        model: 'Item',
        modelId: updatedItem._id,
        user: req.user._id, // Attach the user who performed the action
      });
  
      // Send the updated item as a response
      res.json(updatedItem); 
  
    } catch (error) {
      // If an error occurs, log the error and return a 500 server error
      console.error('Error updating item:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };


  const deleteItem = async(req, res) => {
    try{
      const {id} = req.params;
      const item = await Item.findById(id);
      if(!item){
        return res.status(404).json({message: error.message})
      }
      await AuditLog.create({
        action: 'delete',
        model: 'Item',
        modelId: item._id,
        user: req.user._id, // Now req.user is attached by the middleware
      });
  await Item.findByIdAndDelete(id, req.body);
      

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