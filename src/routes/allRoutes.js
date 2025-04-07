const categorias = require('./routesCategorias');
const ajusteprecio = require('./routesAjustePrecios');
const items = require('./routesItems');
const productos = require('./routesProducts');
const cliente = require('./routesCliente');
const direccion = require('./routesDireccion');
const clienteDireccion = require('./routesClienteDireccion');
const telefono = require('./routesTelefono');
const correo = require('./routesCorreo');

module.exports = {
    categorias,
    ajusteprecio,
    items,
    productos,
    cliente,
    direccion,
    clienteDireccion,
    telefono,
    correo
}