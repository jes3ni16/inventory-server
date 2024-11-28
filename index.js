const express = require('express')
const app = express()
const cors = require('cors');


const mongoose = require('mongoose');
const itemRoutes = require("./routes/item.route")
const tableRoutes = require('./routes/table.route');
const transactionRoutes = require('./routes/transaction.route');
require('dotenv').config();

const port = process.env.PORT || 3000;  // Use the PORT from the environment variable, fallback to 3000 if not set
const mongoURI = process.env.MONGO_URI; 

app.use(express.json())

app.use(cors());

app.use("/api/items", itemRoutes)
app.use("/api/tables", tableRoutes); 
app.use("/api/transactions", transactionRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!')
  }),



  // app.listen(port, () => {
  //   console.log(`Example app listening on port ${port}`)
  // })


  mongoose.connect(mongoURI)
  .then(()=>{
    console.log('database connected')
  })
  .catch(() => {
    console.log('Connection Failed')
  })