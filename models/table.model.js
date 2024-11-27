// models/Table.js
const mongoose = require('mongoose');

// Define the Table schema
const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  // The name of the table (e.g., "Table 1")
  },
  location: {
    type: String,
    required: true,  // The location of the table (e.g., "Room A")
  },
  employee : {
    type: String,
  },
  
  items_assigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item', // This links back to the Item model
  }]  // An array of item ObjectIds assigned to the table
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
