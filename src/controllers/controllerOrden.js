const sql = require('../models/modelsOrden');

// GET /api/ordenes
exports.getAllOrdenes = async (req, res) => {
    try {
        const result = await sql.selectAllOrdenes();
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// GET /api/ordenes/:id
exports.getOrdenById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.selectOrdenById(id);
        if (!result) {
            return res.status(404).json({ msg: 'Orden no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// POST /api/ordenes
exports.createOrden = async (req, res) => {
    const { cliente_id, fecha, estado } = req.body;
    if (!cliente_id || !fecha || !estado) {
        return res.status(400).json({ msg: 'cliente_id, fecha y estado son necesarios' });
    }
    const orden = { cliente_id, fecha, estado };

    try {
        const result = await sql.insertOrden(orden);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// PUT /api/ordenes/:id
exports.updateOrden = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { cliente_id, fecha, estado } = req.body;
    const orden = { id, cliente_id, fecha, estado };

    try {
        const result = await sql.updateOrden(orden);
        if (!result) {
            return res.status(404).json({ msg: 'Orden no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// DELETE /api/ordenes/:id
exports.deleteOrden = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteOrden(id);
        if (!result) {
            return res.status(404).json({ msg: 'Orden no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};