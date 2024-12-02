const express = require('express')
const app = express();
const authenticateUser = require('../middlewares/authMiddleware');
const router = express.Router();


const {getItems, createItem, getItem, updateItem, deleteItem ,stockOutItem} = require("../controllers/item.controller")


router.get('/',getItems)

  router.post('/', authenticateUser,createItem )

  router.get('/:id' ,getItem)

  router.patch('/:id', updateItem )

  router.delete('/:id', deleteItem)

  router.put('/items/:id/stock-out', stockOutItem);

module.exports = router;