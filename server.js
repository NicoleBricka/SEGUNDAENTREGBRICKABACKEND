const express = require('express');
const app = express();
const productsRouter = require('./routes/products.Router.js');
const cartsRouter = require('./routes/carts.Router.js');
const PORT = 8081;

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});
app.use(express.json());


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});