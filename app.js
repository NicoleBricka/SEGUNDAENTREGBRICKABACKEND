const express = require('express');
const productsRouter = require('./src/routes/products.Router.js');
const cartsRouter = require('./src/routes/carts.Router.js');

const app = express();
const PORT = 8081;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});