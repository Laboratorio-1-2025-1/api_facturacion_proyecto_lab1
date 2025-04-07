const sql = require('../models/modelsFactura');
const sqlCliente = require('../models/modelsCliente');
const sqlCorreo = require('../models/modelsCorreo');
const sgMail = require('@sendgrid/mail');

// Configurar SendGrid con la API Key desde las variables de entorno
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// GET /api/facturas
exports.getAllFacturas = async (req, res) => {
    try {
        const result = await sql.selectAllFacturas();
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
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al realizar la operación' });
    }
};

// POST /api/facturas
exports.createFactura = async (req, res) => {
    const { orden_id, serie, numero, fecha, estado } = req.body;
    if (!orden_id || !serie || !numero || !estado) {
        return res.status(400).json({ msg: 'orden_id, serie, numero y estado son necesarios' });
    }
    const factura = { orden_id, serie, numero, fecha, estado };

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

        // Obtener el cliente asociado a la factura
        const cliente = await sqlCliente.selectClienteById(factura.orden_id);
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        // Obtener los correos del cliente
        const correos = await sqlCorreo.selectCorreosByClienteId(cliente.id);
        if (!correos || correos.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron correos para el cliente' });
        }

        // Crear el contenido del correo
        const msg = {
            to: correos.map(correo => correo.dominio), // Lista de correos del cliente
            from: process.env.SENDGRID_FROM_EMAIL, // Correo del remitente (configurado en variables de entorno)
            subject: `Factura ${factura.serie}-${factura.numero}`,
            text: `Estimado ${cliente.razon_social}, adjuntamos la factura ${factura.serie}-${factura.numero}.`,
            html: `<p>Estimado <strong>${cliente.razon_social}</strong>,</p>
                   <p>Adjuntamos la factura <strong>${factura.serie}-${factura.numero}</strong>.</p>
                   <p>Gracias por su preferencia.</p>`,
        };

        // Enviar el correo
        await sgMail.send(msg);

        res.json({ msg: 'Factura enviada correctamente', correos: correos.map(correo => correo.dominio) });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al enviar la factura', error: error.message });
    }
};