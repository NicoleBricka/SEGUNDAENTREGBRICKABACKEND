const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();


const productsFilePath = path.join(__dirname, '../api/products.json');


function readProductsFile() {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
}


function writeProductsFile(data) {
    fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
}


router.get('/', (req, res) => {
    const products = readProductsFile();
    const limit = parseInt(req.query.limit, 10);
    if (limit) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
});


router.get('/:pid', (req, res) => {
    const products = readProductsFile();
    const product = products.find(p => p.id === req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});


router.post('/', (req, res) => {
    const { title, descripcion, precio, categoria, stock } = req.body;


    if (!title || !descripcion || precio === undefined || !categoria || stock === undefined) {
        return res.status(400).json({ error: 'Faltan campos requeridos: title, descricion, precio, categoria, stock' });
    }

    const products = readProductsFile();
    const newProduct = {
        id: String(Date.now()),
        title,
        descripcion,
        precio: parseFloat(price),
        categoria,
        stock: parseInt(stock),
        status: true
    };

    products.push(newProduct);
    writeProductsFile(products);
    res.status(201).json(newProduct);
});


router.put('/:pid', (req, res) => {
    const products = readProductsFile();
    const productIndex = products.findIndex(p => p.id === req.params.pid);
    if (productIndex !== -1) {
        const updatedProduct = { ...products[productIndex], ...req.body };
        products[productIndex] = updatedProduct;
        writeProductsFile(products);
        res.json(updatedProduct);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});


router.delete('/:pid', (req, res) => {
    let products = readProductsFile();
    const initialLength = products.length;
    products = products.filter(p => p.id !== req.params.pid);
    if (products.length < initialLength) {
        writeProductsFile(products);
        res.send('Producto eliminado');
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

module.exports = router;
