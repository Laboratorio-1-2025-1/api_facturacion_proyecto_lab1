const sql = require('../models/modelsDetallesOrden');

// GET /api/detalles-orden
exports.getAllDetallesOrden = async (req, res) => {
    try {
        const result = await sql.selectAllDetallesOrden();
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// GET /api/detalles-orden/:ordenId
exports.getDetallesOrdenByOrdenId = async (req, res) => {
    const ordenId = parseInt(req.params.ordenId, 10);
    try {
        const result = await sql.selectDetallesOrdenByOrdenId(ordenId);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// POST /api/detalles-orden
exports.createDetallesOrden = async (req, res) => {
    const detalles = req.body; // Se espera un arreglo de objetos
    if (!Array.isArray(detalles) || detalles.length === 0) {
        return res.status(400).json({ msg: 'Se requiere un arreglo de detalles de orden' });
    }

    try {
        const result = [];
        for (const detalle of detalles) {
            const nuevoDetalle = await sql.insertDetalleOrden(detalle);
            result.push(nuevoDetalle);
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// PUT /api/detalles-orden/:id
exports.updateDetalleOrden = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { orden_id, item_id, cantidad, subtotal, impuesto_aplicado, descuento_aplicado } = req.body;
    const detalle = { id, orden_id, item_id, cantidad, subtotal, impuesto_aplicado, descuento_aplicado };

    try {
        const result = await sql.updateDetalleOrden(detalle);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// DELETE /api/detalles-orden/:id
exports.deleteDetalleOrden = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteDetalleOrden(id);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};