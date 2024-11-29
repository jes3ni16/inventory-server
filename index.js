const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const itemRoutes = require("./routes/item.route");
const tableRoutes = require('./routes/table.route');
const transactionRoutes = require('./routes/transaction.route');
require('dotenv').config();

// Create a Redis client
const { createClient } = require('@redis/client');
const client = createClient();

// Connect to Redis
async function connectRedis() {
  try {
    // Connect to Redis server
    await client.connect();
    console.log('Connected to Redis!');
    
    // Set a key-value pair in Redis with an expiration time (3600 seconds = 1 hour)
    await client.set('my_key', 'Hello, Redis!', { EX: 3600 });
    console.log('Data set in Redis');
    
    // Get the value of 'my_key' from Redis
    const value = await client.get('my_key');
    console.log('Value from Redis:', value); // Should print "Hello, Redis!"
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
}

// Disconnect from Redis gracefully
async function disconnectRedis() {
  try {
    await client.quit();
    console.log('Disconnected from Redis!');
  } catch (err) {
    console.error('Error disconnecting from Redis:', err);
  }
}

// Call the functions to connect, perform operations, and disconnect
async function run() {
  await connectRedis();
  await disconnectRedis();
}

run().catch(err => console.error('Error in Redis operations:', err));

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
