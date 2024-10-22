const express = require('express');
const Product = require('../../models/Product');
const router = express.Router();

router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;

    const queryObject = {};
    if (query) {
        queryObject.$or = [
            { category: new RegExp(query, 'i') }, 
            { title: new RegExp(query, 'i') },    
        ];
    }

    try {
        const totalProducts = await Product.countDocuments(queryObject);
        const totalPages = Math.ceil(totalProducts / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}` : null;
        const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${parseInt(page) + 1}` : null;

        const products = await Product.find(queryObject)
            .limit(Number(limit))
            .skip((page - 1) * limit)
            .sort(sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {});

        res.json({
            status: 'éxito', 
            payload: products, 
            totalPages, 
            prevPage: hasPrevPage ? page - 1 : null, 
            nextPage: hasNextPage ? page + 1 : null, 
            page: Number(page), 
            hasPrevPage, 
            hasNextPage, 
            prevLink, 
            nextLink, 
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message }); 
    }
});

module.exports = router;


