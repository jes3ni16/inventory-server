const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
        name:{
            type: String
        },
        serial_number : {
            type : String,
            required: false,
        },
      sku: {
        type: String,
        default: null,
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

        location : {
            type: String
        },
        status : {
            type:  String
        },
        stockOutReason: { type: String, default: null },
        stockOutTimestamp: { type: Date, default: null },
     
},   { timestamps: true })

const Item = mongoose.model("Item", ItemSchema);



module.exports = Item;