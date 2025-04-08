const sql = require('../models/modelsDetallesOrden');
const sqlItem = require('../models/modelsItem');
const sqlProducto = require('../models/modelsProducto');
const sqlServicio = require('../models/modelsServicio');
const sqlAjustePrecio = require('../models/modelsAjustePrecio');
const sqlOrden = require('../models/modelsOrden');

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
    const {orden_id, items} = req.body; // Se espera un arreglo de objetos

    try {
        const result = [];

        for (const i of items) {
        //items.forEach(async (i) => {
            const aux = {}
            // obtenemos el item de la orden
            let item = await sqlItem.selectItemById(i.item_id);
            item = item[0];

            // obtenemos el precio filtrando si es producto o servicio
            if (item.tipo === 'PRODUCTO') {
                const producto = await sqlProducto.selectProducto_ByItemId(i.item_id);

                if (producto[0].stock < i.cantidad) {
                    console.log('No hay suficiente stock para el producto:', producto[0].nombre);
                    i.cantidad = producto[0].stock; // Ajustamos la cantidad al stock disponible
                }

                // calculamos el subtotal
                aux.subtotal = producto[0].precio * i.cantidad;

                // actualizamos el stock del producto
                await sqlProducto.updateStock(i.item_id, producto[0].stock - i.cantidad);

            } else if (item.tipo === 'SERVICIO') {
                const servicio = await sqlServicio.selectServicio_ByItemId(i.item_id);
                aux.subtotal = servicio[0].precio * i.cantidad;
            }

            // si hay ajustes de precio, obtenemos su valor y los acumulamos
            if(i.ajustePreciosIds.length > 0) {
                aux.impuesto_aplicado = 0;
                aux.descuento_aplicado = 0;

                for (const ajusteId of i.ajustePreciosIds) {
                //i.ajustePreciosIds.forEach(async (ajusteId) => {
                    let ajuste = await sqlAjustePrecio.selectAjustePrecioById(ajusteId);
                    ajuste = ajuste[0];
                    if (ajuste.tipo === 'IMPUESTO') {
                        aux.impuesto_aplicado += parseFloat(ajuste.valor);
                    }
                    if (ajuste.tipo === 'DESCUENTO') {
                        aux.descuento_aplicado += parseFloat(ajuste.valor);
                    }
                }//);
            }

            aux.orden_id = orden_id;
            aux.item_id = i.item_id;
            aux.cantidad = i.cantidad;
            aux.subtotal = aux.subtotal || 0;
            aux.impuesto_aplicado = aux.impuesto_aplicado || 0;
            aux.descuento_aplicado = aux.descuento_aplicado || 0;

            const nuevoDetalle = await sql.insertDetalleOrden(aux);
            result.push(nuevoDetalle);
        }//);

        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// PUT /api/detalles-orden/:id
exports.updateDetalleOrden = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { cantidad, ajustePreciosIds } = req.body;
    
    try {
        // Obtener el detalle de orden existente
        const detalleExistente = await sql.selectDetalleOrdenById(id);
        if (!detalleExistente) {
            return res.status(404).json({ msg: 'Detalle de orden no encontrado' });
        }

        const updatedDetalle = {
            cantidad: cantidad || detalleExistente.cantidad,
            impuesto_aplicado: detalleExistente.impuesto_aplicado,
            descuento_aplicado: detalleExistente.descuento_aplicado,
            subtotal: detalleExistente.subtotal,
        };

        // Si se proporciona una nueva cantidad, recalcular el subtotal
        if (cantidad) {
            const item = await sqlItem.selectItemById(detalleExistente.item_id);

            if (item.tipo === 'PRODUCTO') {
                const producto = await sqlProducto.selectProducto_ByItemId(detalleExistente.item_id);
                updatedDetalle.subtotal = producto[0].precio * cantidad;

                // Actualizar el stock del producto
                const nuevoStock = producto[0].stock - (cantidad - detalleExistente.cantidad);
                await sqlProducto.updateStock(detalleExistente.item_id, nuevoStock);

            } else if (item.tipo === 'SERVICIO') {
                const servicio = await sqlServicio.selectServicio_ByItemId(detalleExistente.item_id);
                updatedDetalle.subtotal = servicio[0].precio * cantidad;
            }
        }

        // Si se proporcionan nuevos ajustes de precio, recalcular impuestos y descuentos
        if (ajustePreciosIds && ajustePreciosIds.length > 0) {
            updatedDetalle.impuesto_aplicado = 0;
            updatedDetalle.descuento_aplicado = 0;

            ajustePreciosIds.forEach(async (ajusteId) => {
                const ajuste = await sqlAjustePrecio.selectAjustePrecioById(ajusteId);
                if (ajuste.tipo === 'IMPUESTO') {
                    updatedDetalle.impuesto_aplicado += parseFloat(ajuste.valor);
                }
                if (ajuste.tipo === 'DESCUENTO') {
                    updatedDetalle.descuento_aplicado += parseFloat(ajuste.valor);
                }
            });
        }

        // Actualizar el detalle de orden en la base de datos
        const result = await sql.updateDetalleOrden(id, updatedDetalle);
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