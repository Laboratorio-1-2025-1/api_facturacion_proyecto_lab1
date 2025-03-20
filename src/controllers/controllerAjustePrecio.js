const sql = require('../models/modelsAjustePrecio');

// GET /api/ajusteprecio
exports.getAllAjustePrecio = async (req, res) => {
    const { tipo, aplicableA } = req.body;
    try {
        const result = null
        if (tipo && aplicableA) {
            result = await sql.selectAjustePrecioByTipoAplicableA(tipo, aplicableA);
        } else if (tipo) {
            result = await sql.selectAjustePrecioByTipo(tipo);
        } else if (aplicableA) {
            result = await sql.selectAjustePrecioByAplicableA(aplicableA);
        } else {
            result = await sql.selectAllAjustePrecio();
        }
        
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// GET /api/ajusteprecio/:id
exports.getAjustePrecioById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.selectAjustePrecioById(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// POST /api/ajusteprecio
exports.createAjustePrecio = async (req, res) => {
    const { descripcion, aplicableA, tipo, valor } = req.body;
    if (!descripcion || !aplicableA || !tipo || !valor) {
        return res.status(400).json({ msg: '{descripcion, aplicableA, tipo, valor} son necesarios' });
    }
    const ajustePrecio = { descripcion, aplicableA, tipo, valor };

    try {
        const result = await sql.insertAjustePrecio(ajustePrecio);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// PUT /api/ajusteprecio:id
exports.updateAjustePrecio = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { descripcion, aplicableA, tipo, valor, estado } = req.body;
    const ajustePrecio = { id, descripcion, aplicableA, tipo, valor, estado };

    try {
        const result = await sql.updateAjustePrecio(ajustePrecio);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// DELETE /api/ajusteprecio:id
exports.deleteAjustePrecio = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteAjustePrecio(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}
