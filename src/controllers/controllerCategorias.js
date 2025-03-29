const sql = require('../models/modelsCategoria');

// GET /api/categorias
exports.getAllCategorias = async (req, res) => {
    try {
        const result = await sql.selectAllCategorias();
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}


// GET /api/categorias/:id
exports.getCategoriaById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.selectCategoriaById(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// POST /api/categorias
exports.createCategoria = async (req, res) => {
    const { descripcion, tipo } = req.body;
    if (!descripcion || !tipo) {
        return res.status(400).json({ msg: 'descripcion y tipo son necesarios' });
    }
    const categoria = { descripcion, tipo };

    try {
        const result = await sql.insertCategoria(categoria);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// PUT /api/categorias:id
exports.updateCategoria = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { descripcion, tipo, estado } = req.body;
    const categoria = { id, descripcion, tipo, estado };

    try {
        const result = await sql.updateCategoria(categoria);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

// DELETE /api/categorias:id
exports.deleteCategoria = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteCategoria(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operacion' });
    }
}

/**
 * Validar categoria
 * @param {int} cat 
 * @returns 
 */
exports.validateCategoria = async (cat) => {
    cat = parseInt(cat, 10);
    let e = {}

    // Validamos formato de categoria_id
    if (isNaN(cat) || cat <= 0) {
        e.cat = 'Categoria Invalida'
    } else if (await sql.selectCategoriaById(cat).length === 0) {
        e.cat = 'Categoria no existe'
    }

    // Verificamos que no hayan errores
    if (Object.keys(e).length > 0) {
        return e;
    } else {
        return true;
    }
}