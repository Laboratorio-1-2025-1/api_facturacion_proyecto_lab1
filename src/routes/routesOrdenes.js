const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerOrden');

// GET /api/ordenes
router.get('/', controller.getAllOrdenes);

// GET /api/ordenes/:id
router.get('/:id', controller.getOrdenById);

// POST /api/ordenes
router.post('/', controller.createOrden);

// PUT /api/ordenes/:id
router.put('/:id', controller.updateOrden);

// DELETE /api/ordenes/:id
router.delete('/:id', controller.deleteOrden);

module.exports = router;