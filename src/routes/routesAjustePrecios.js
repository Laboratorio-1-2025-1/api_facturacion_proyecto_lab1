const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerAjustePrecio');

// GET /api/ajusteprecio
routes.get('/', controller.getAllAjustePrecio);

// GET /api/ajusteprecio/:id
routes.get('/:id', controller.getAjustePrecioById);

// POST /api/ajusteprecio
routes.post('/', controller.createAjustePrecio);

// PUT /api/ajusteprecio:id
routes.put('/:id', controller.updateAjustePrecio);

// DELETE /api/ajusteprecio:id
routes.delete('/:id', controller.deleteAjustePrecio);

module.exports = routes;