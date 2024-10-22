const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    price: { type: Number, required: true }, 
    category: { type: String, required: true }, 
    status: { type: Boolean, default: true }, 
});


const Product = mongoose.model('Product', productSchema);


module.exports = Product;