const express = require('express');
const routes = express.Router();
const controller = require('../controllers/controllerCategorias');

// GET /api/categorias
routes.get('/', controller.getAllCategorias);

// GET /api/categorias/:id
routes.get('/:id', controller.getCategoriaById);

// POST /api/categorias
routes.post('/', controller.createCategoria);

// PUT /api/categorias:id
routes.put('/:id', controller.updateCategoria);

// DELETE /api/categorias:id
routes.delete('/:id', controller.deleteCategoria);

module.exports = routes;
