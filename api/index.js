const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const itemRoutes = require("../routes/item.route");
const tableRoutes = require('../routes/table.route');
const transactionRoutes = require('../routes/transaction.route');
require('dotenv').config();

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/items", itemRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/transactions", transactionRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// MongoDB connection (make sure to avoid reconnecting on every request)
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Connection failed', err);
  });

// Export the app as a serverless function for Vercel
module.exports = app;
