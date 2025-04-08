const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerProducts');

// GET /api/products
routes.get('/', controller.getAllProducts);

// GET /api/products/:id
routes.get('/:id', controller.getProductById);

// POST /api/products/new
routes.post('/new', controller.createProduct);

// PUT /api/products/:id
routes.put('/:id', controller.updateProduct)

module.exports = routes;