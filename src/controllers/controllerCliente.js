const sql = require('../models/modelsCliente');

// GET /api/cliente
exports.getAllCliente = async (req, res) => {
    try {
        const result = await sql.selectAllCliente();
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// GET /api/cliente/:id
exports.getCLienteById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.selectClienteById(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// POST /api/clientes 
exports.createCliente = async (req, res) => {
    const { dni, razon_social } = req.body;
    if (!dni || !razon_social) {
        return res.status(400).json({ msg: 'dni y razon social son necesarios' });
    }
    const cliente = { dni, razon_social };

    try {
        const result = await sql.insertCliente(cliente);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// PUT /api/cliente:id
exports.updateCliente = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { dni, razon_social, estado } = req.body;
    const cliente = { id, dni, razon_social, estado };

    try {
        const result = await sql.updateCliente(cliente);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// DELETE /api/cliente:id
exports.deleteCliente = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteCliente(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

/**
 * Validar cliente
 * @param {int} cli
 * @returns 
 */

exports.validateCliente = async (cli) => {
    cli = parseInt(cli, 10);
    let e = {}

    // Validamos formato de cliente_id
    if (isNaN(cli) || cli <= 0) {
        e.cli = 'Cliente invalido'
    } else if (await sql.selectClienteById(cli).length === 0) {
        e.cli = 'Cliente no existe'
    }

    // Verificamos que no hayan errores
    if (Object.keys(e).length > 0) {
        return e;
    } else {
        return true;
    }
}
