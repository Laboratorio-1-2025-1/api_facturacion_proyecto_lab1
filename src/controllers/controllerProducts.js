const sqlPr = require('../models/modelsProducto');
const sqlItems = require('../models/modelsItem');
const sqlAjusteP = require('../models/modelsAjustePrecio');
const sqlItemAjuste = require('../models/modelsItemAjuste');
const sqlCategoria = require('../models/modelsCategoria');

/**
 * GET /api/products
 * @returns Todos los productos
 * @descripcion Busca todos los productos
*/

exports.getAllProducts = async (req, res) => {
    try {
        const result = await sqlPr.selectAllProductos_joinItems();
        res.json(result);
    } catch (error) {
        console.error(error.message);
    }
};

/**
 * GET /api/products/:id
 * @param {number} id
 * @returns Un producto por su id
 * @descripcion Busca un producto por su id
*/

exports.getProductById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const result = await sqlPr.selectProducto_ById_joinItems(id);
        res.json(result[0]);
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * POST /api/products/new
 * @param {{item:{nombre:string, descripcion:string, categoria_id:number}, idsAjustesPrecios:number[], stock:number, precio:number, coste:number}} req
 * @returns Producto creado
 * @descripcion Crea un producto
*/

exports.createProduct = async (req, res) => {
    let { item, idsAjustesPrecios, stock, precio, coste } = req.body;

    try{
        // arreglo para manejar posibles errores de validacion de datos
        let errores = [];

        // Validamos formato del item
        if (!item.nombre || !item.descripcion || !item.categoria_id) {
            errores.push({msg: 'item:{nombre, descripcion, categoria_id} es necesario' });
        }

        // Validamos formato de categoria_id
        if (isNaN(item.categoria_id) || item.categoria_id <= 0) {
            errores.push({ msg: 'Categoria Invalida' });
        }

        // Validamos que la categoria exista
        if (await sqlCategoria.selectCategoriaById(parseInt(item.categoria_id,10)).length === 0) {
            errores.push({ msg: 'Categoria no existe' });
        }

        // Validar stock ingresado
        if (stock === undefined){
            stock = 0
        } else if(isNaN(stock) || stock < 0) {
            errores.push({ msg: 'stock invalido' });
        }

        // Validar formato de los precios
        if (!precio || !coste || isNaN(precio) || precio < 0 || isNaN(coste) || coste < 0) {
            errores.push({ msg: 'Precio y Coste deben ser numeros validos' });
        }

        // Validar los ajustes de precios
        if (idsAjustesPrecios != undefined && idsAjustesPrecios.length > 0) {
            for (let i = 0; i < idsAjustesPrecios.length; i++) {
                // Validar que sean numeros validos y que existan
                if (isNaN(idsAjustesPrecios[i]) || idsAjustesPrecios[i] <= 0) {
                    errores.push({ msg: 'Ajuste de precio '+ idsAjustesPrecios[i] +' invalido' });
                } else {
                    const ajuste = await sqlAjusteP.selectAjustePrecioById(parseInt(idsAjustesPrecios[i], 10));
                    if (ajuste.length === 0) {
                        errores.push({ msg: 'Ajuste de precio '+ idsAjustesPrecios[i] +' no existe' });
                    }
                }
            }
        }

        // Si hay errores, se envian
        if (errores.length > 0) {
            return res.status(400).json({ errores });
        }

        let result = {};

        // Creamos el item
        const i = {
            nombre: item.nombre,
            descripcion: item.descripcion,
            categoria_id: parseInt(item.categoria_id, 10),
            tipo: 'PRODUCTO'
        }
        let itemAux;
        try {
            itemAux = await sqlItems.insertItem(i);
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({msg: 'Error al realizar la operacion', "Error": error.message});
        }
        result.item = itemAux[0];
        

        // Creamos los ajustes de precio
        result.ajustesPrecio = [];
        for (let i = 0; i < idsAjustesPrecios.length; i++) {
            const i_A = {
                item_id: parseInt(itemAux[0].id, 10),
                ajuste_precio_id: parseInt(idsAjustesPrecios[i], 10)
            }

            const aux = await sqlItemAjuste.insertItemAjuste(i_A)
            const i_A_Aux = aux[0]
            const ajusteValores = await sqlItemAjuste.selectItemAjuste_byId_joinAjustePrecio(parseInt(i_A_Aux.id,10))

            
            result.ajustesPrecio.push(ajusteValores[0]);
        }

        // Creamos el producto
        const p = {
            item_id: parseInt(itemAux[0].id, 10),
            stock: parseInt(stock, 10),
            precio: parseFloat(precio),
            coste: parseFloat(coste)
        }
        const producto = await sqlPr.insertProducto(p);
        result.producto = producto[0];

        return res.json(result);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ "Error": error.message, msg: 'Error al realizar la operacion' });
    }
}