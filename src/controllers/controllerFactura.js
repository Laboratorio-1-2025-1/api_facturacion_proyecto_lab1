const sql = require('../models/modelsFactura');
const sqlOrden = require('../models/modelsOrden');
const sqlCliente = require('../models/modelsCliente');
const sqlCorreo = require('../models/modelsCorreo');
const sgMail = require('@sendgrid/mail');

// Configurar SendGrid con la API Key desde las variables de entorno
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// GET /api/facturas
exports.getAllFacturas = async (req, res) => {
    try {
        const result = await sql.selectAllFacturas();
        result.forEach(factura => {
            factura.fecha = new Date(factura.fecha).toISOString().split('T')[0]; // Formatear fecha
        });
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// GET /api/facturas/:id
exports.getFacturaById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.selectFacturaById(id);
        if (!result) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }
        result.fecha = new Date(result.fecha).toISOString().split('T')[0]; // Formatear fecha
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// POST /api/facturas
exports.createFactura = async (req, res) => {
    const { orden_id, serie, numero, fecha } = req.body;
    if (!orden_id || !serie || !numero) {
        return res.status(400).json({ msg: 'orden_id, serie, numero son necesarios' });
    }
    const factura = { orden_id, serie, numero, fecha: new Date(), estado: 'ACTIVO' };

    try {
        const result = await sql.insertFactura(factura);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// PUT /api/facturas/:id
exports.updateFactura = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { orden_id, serie, numero, fecha, estado } = req.body;
    const factura = { id, orden_id, serie, numero, fecha, estado };

    try {
        const result = await sql.updateFactura(factura);
        if (!result) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// DELETE /api/facturas/:id
exports.deleteFactura = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sql.deleteFactura(id);
        if (!result) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// POST /api/facturas/send/:id
exports.sendFacturaById = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        // Obtener la factura por ID
        const factura = await sql.selectFacturaById(id);
        if (!factura) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }

        //Obtener la orden asociada a la factura
        const orden = await sqlOrden.selectOrdenById(factura.orden_id);
        if (!orden) {
            return res.status(404).json({ msg: 'Orden no encontrada' });
        }

        // Obtener el cliente asociado a la factura
        const cliente = await sqlCliente.selectClienteById(orden.cliente_id);
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        // Obtener los correos del cliente
        const correos = await sqlCorreo.selectCorreoByClienteId(cliente[0].id);
        if (!correos || correos.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron correos para el cliente' });
        }
        correos.forEach(correo => {
            correo.email = correo.descripcion + '@' + correo.dominio; // Crear el email completo
        });

        // Obtener el detalle de la orden
        const detalleOrden = await sqlOrden.selectDetallesOrdenById(orden.id);
        let subtotal = 0;
        let impuesto = 0;
        let descuento = 0;
        for (detalle of detalleOrden) {
            subtotal += parseFloat(detalle.subtotal);
            impuesto += parseFloat(detalle.impuesto);
            descuento += parseFloat(detalle.descuento);
        }
        // Calcular el total de la factura
        const total = subtotal + (subtotal * (impuesto / 100)) - (subtotal * (descuento / 100));
        

        // Crear el contenido del correo
        const msg = {
            to: correos.map(correo => correo.email), // Lista de correos del cliente
            from: process.env.SENDGRID_FROM_EMAIL, // Correo del remitente (configurado en variables de entorno)
            subject: `Factura ${factura.serie}-${factura.numero}`,
            text: `Estimado ${cliente[0].razon_social}, adjuntamos la factura ${factura.serie}-${factura.numero}.`,
            html: `<p>Estimado <strong>${cliente[0].razon_social}</strong>,</p>
                   <p>Adjuntamos la factura <strong>${factura.serie}-${factura.numero}</strong>.</p>
                     <p>Factura:</p>
                     ${Object.entries(factura).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')}
                   <p>Orden:</p>
                     ${Object.entries(orden).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')}
                     <p>Detalles de la orden:</p>
                        <table border="1" style="border-collapse: collapse;">
                            <tr>
                                <th>Item</th>
                                <th>Cantidad</th>
                                <th>Monto</th>
                                <th>Impuesto</th>
                                <th>Descuento</th>
                            </tr>
                            ${detalleOrden.map(detalle => `
                                <tr>
                                    <td>${detalle.Item}</td>
                                    <td>${detalle.cantidad}</td>
                                    <td>${detalle.subtotal}</td>
                                    <td>${detalle.impuesto}</td>
                                    <td>${detalle.descuento}</td>
                                </tr>`).join('')}
                        </table>
                        <p>Totales:</p>

                        <tr>
                            <td colspan="2" style="text-align: right;"><strong>Total Subtotal:</strong></td>
                            <td colspan="3">${subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="text-align: right;"><strong>Total Impuestos:</strong></td>
                            <td colspan="3">${impuesto.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="text-align: right;"><strong>Total Descuentos:</strong></td>
                            <td colspan="3">-${descuento.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="text-align: right;"><strong>Total:</strong></td>
                            <td colspan="3">${total.toFixed(2)}</td>
                        </tr>

                   <p>Gracias por su preferencia.</p>`,
        };

        // Enviar el correo
        await sgMail.send(msg);

        res.json({ 
                msg: `Factura ${factura.serie}-${factura.numero} enviada correctamente`, 
                correos: correos.map(correo => correo.email) 
            });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al enviar la factura', error: error.message });
    }
};