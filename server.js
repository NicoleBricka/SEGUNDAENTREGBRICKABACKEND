const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); 
const productsRouter = require('./src/routes/products.Router.js');
const cartsRouter = require('./src/routes/carts.Router.js');
const viewsRouter = require('./src/routes/views.Router.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home'); 
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

let products = [];

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.emit('updateProducts', products);

    socket.on('addProduct', (newProduct) => {
        const product = {
            id: String(Date.now()),
            title: newProduct.title,
            price: parseFloat(newProduct.price),
            status: true
        };
        products.push(product);
        io.emit('updateProducts', products); 
    });
});

const PORT = 8081;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});
