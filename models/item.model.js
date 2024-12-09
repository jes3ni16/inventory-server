const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
        name:{
            type: String,
            required : [true, 'item name is required']
        },

      sku: {
        type: String,
      },

        description :{
            type: String,
        },
        condition :{
            type: String,
        },
        price :{
            type: String,
        },
        assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' } ,
        purchase_by : {
            type: String,
        },
        purchase_date : {
            type: Date,
        },
        invoice : {
            type: String,
        },
        serial_number : {
            type : String,
        },
        location : {
            type: String
        },
        status : {
            type:  String
        },
        stockOutReason: { type: String, default: null },
        stockOutTimestamp: { type: Date, default: null },
        tableUsed: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', default: null },

})

const Item = mongoose.model("Item", ItemSchema);



module.exports = Item;