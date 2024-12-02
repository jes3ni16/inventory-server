const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const itemRoutes = require("./routes/item.route");
const tableRoutes = require('./routes/table.route');
const transactionRoutes = require('./routes/transaction.route');
const authRoutes = require('./routes/user.route');
require('dotenv').config();


// MongoDB connection string
const mongoURI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Allow your frontend domain
  methods: ['GET', 'POST','PATCH','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Routes
app.use("/api/items", itemRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/transactions", transactionRoutes);
app.use('/api/auth', authRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};


connectToDatabase();
// Export the app as a serverless function for Vercel
module.exports = app;
