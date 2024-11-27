const express = require('express')
const app = express()
const cors = require('cors');

const port = 3000
const mongoose = require('mongoose');
const itemRoutes = require("./routes/item.route")
const tableRoutes = require('./routes/table.route');
const transactionRoutes = require('./routes/transaction.route');

app.use(express.json())

app.use(cors());

app.use("/api/items", itemRoutes)
app.use("/api/tables", tableRoutes); 
app.use("/api/transactions", transactionRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!')
  }),



  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


  mongoose.connect("mongodb+srv://cenixInventory:cenixInventory@inventory.vhw5z.mongodb.net/?retryWrites=true&w=majority&appName=inventory")
  .then(()=>{
    console.log('database connected')
  })
  .catch(() => {
    console.log('Connection Failed')
  })