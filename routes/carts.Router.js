const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();


const cartsFilePath = path.join(__dirname, '../api/carts.json');


function readCartsFile() {
    const data = fs.readFileSync(cartsFilePath, 'utf8');
    return JSON.parse(data);
}


function writeCartsFile(data) {
    fs.writeFileSync(cartsFilePath, JSON.stringify(data, null, 2));
}


router.post('/', (req, res) => {
    const carts = readCartsFile();
    const newCart = {
        id: String(Date.now()),
        products: [] 
    };
    carts.push(newCart);
    writeCartsFile(carts);
    res.status(201).json(newCart);
});


router.get('/:cid', (req, res) => {
    const carts = readCartsFile();
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});


router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCartsFile();
    const cartIndex = carts.findIndex(c => c.id === req.params.cid);
    if (cartIndex === -1) {
        return res.status(404).send('Carrito no encontrado');
    }

    const productIndex = carts[cartIndex].products.findIndex(p => p.product === req.params.pid);
    if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity += 1;
    } else {
        carts[cartIndex].products.push({ product: req.params.pid, quantity: 1 });
    }

    writeCartsFile(carts);
    res.json(carts[cartIndex]);
});

module.exports = router;