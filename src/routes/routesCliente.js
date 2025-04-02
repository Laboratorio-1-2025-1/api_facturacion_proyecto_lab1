const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerCliente');

// GET /api/cliente
routes.get('/', controller.getAllCliente);

// GET /api/cliente/:id
routes.get('/:id', controller.getClienteById);

// POST /api/cliente
routes.post('/', controller.createCliente);

// PUT /api/cliente:id
routes.put('/:id', controller.updateCliente);

// DELETE /api/cliente:id
routes.delete('/:id', controller.deleteCliente);

module.exports = routes;
