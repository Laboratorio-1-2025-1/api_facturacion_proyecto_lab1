const sqlPr = require('../models/modelsProducto');
const sqlItems = require('../models/modelsItem');

const controllerCat = require('../controllers/controllerCategorias')
const controllerAjustes = require('../controllers/controllerAjustePrecio')

/** GET /api/products
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

/** GET /api/products/:id
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

/** POST /api/products/new
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

        // validamos la categoria
        const c = await controllerCat.validateCategoria(item.categoria_id)
        if (c !== true){
            errores.push(c)
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
        const ajustes = await controllerAjustes.validarAjustesPrecio(idsAjustesPrecios)
        if (ajustes !== true){
            errores.push(ajustes)
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
        const newItem = await sqlItems.insertItem(i);   
        result.item = newItem[0];

        // Creamos los ajustes de precio
        const ajust = await controllerAjustes.newAjustesPrecioForItem(idsAjustesPrecios, newItem[0].id);
        result.ajustesPrecio = ajust;

        // Creamos el producto
        const p = {
            item_id: parseInt(newItem[0].id, 10),
            stock: parseInt(stock, 10),
            precio: parseFloat(precio),
            coste: parseFloat(coste)
        }
        const newProducto = await sqlPr.insertProducto(p);
        result.producto = newProducto[0];

        return res.json(result);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ "Error": error.message, msg: 'Error al realizar la operacion' });
    }
}

/** PUT /api/products/modify/:id
 * @param {{item:{nombre:string, descripcion:string, categoria_id:number}, idsAjustesPrecios:number[], stock:number, precio:number, coste:number}} req
 * @returns Producto Modificado
 * @descripcion Modifica un producto
*/

exports.updateProduct = async (req, res) => {
    const idProduct = parseInt(req.params.id, 10);
    const oldProduct = await this.getProductById(idProduct)
    
    let { item, idsAjustesPrecios, stock, precio, coste } = req.body;

    try{
        // arreglo para manejar posibles errores de validacion de datos
        let errores = [];

        // Validamos formato del item

        if (item.nombre === undefined){
            item.nombre = oldProduct.item_nombre
        }

        if (item.descripcion === undefined){
            item.descripcion = oldProduct.item_descripcion
        }

        // validamos la categoria
        if (item.categoria_id === undefined){
            item.categoria_id = oldProduct.categoria_id
        } else if (item.categoria_id != oldProduct.categoria_id){
            const c = await controllerCat.validateCategoria(item.categoria_id)
            if (c !== true){
                errores.push(c)
            }
        }

        // Validar stock ingresado
        if(stock === undefined){
            stock = oldProduct.producto_stock
        } else if (isNaN(stock) || stock < 0){
            errores.push({ msg: 'stock invalido' });
        }

        // Validar formato de los precios
        if(precio === undefined){
            precio = oldProduct.producto_precio
        }else if (isNaN(precio) || precio < 0){
            errores.push({ msg: 'Precio debe ser numeros validos' });
        }
        
        if(coste === undefined){
            coste = oldProduct.producto_coste
        }else if (isNaN(coste) || coste < 0) {
            errores.push({ msg: 'Coste debe ser numeros validos' });
        }

        // Validar los ajustes de precios
        if (idsAjustesPrecios !== undefined){
            const ajustes = await controllerAjustes.validarAjustesPrecio(idsAjustesPrecios)
            if (ajustes !== true){
                errores.push(ajustes)
            }
        }

        // Si hay errores, se envian
        if (errores.length > 0) {
            return res.status(400).json({ errores });
        }

        let result = {};

        // Creamos el item
        const i = {
            id : oldProduct.item_id,
            nombre: item.nombre,
            descripcion: item.descripcion,
            categoria_id: parseInt(item.categoria_id, 10),
            tipo: 'PRODUCTO',
            estado: 1
        }
        const newItem = await sqlItems.updateItem(i);   
        result.item = newItem[0];

        // Creamos los ajustes de precio
        const ajust = await controllerAjustes.newAjustesPrecioForItem(idsAjustesPrecios, oldProduct.item_id);
        result.ajustesPrecio = ajust;

        // Creamos el producto
        const p = {
            id: idProduct,
            item_id: parseInt(oldProduct.item_id, 10),
            stock: parseInt(stock, 10),
            precio: parseFloat(precio),
            coste: parseFloat(coste)
        }
        const newProducto = await sqlPr.updateProducto(p);
        result.producto = newProducto[0];

        return res.json(result);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ "Error": error.message, msg: 'Error al realizar la operacion' });
    }
}