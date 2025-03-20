/*
necesita una categoria_id
tiene varios ajustes de precio por item
relaciona con la tabla item_ajuste_precio
tabla superTipo para productos y servicios
relaciona con las tablas subTipo producto y subTipo servicio


ITEM{
    id
    nombre
    descripcion
    categoria_id
    tipo (1: producto, 2: servicio)
    estado (1: activo, 2: inactivo)
}
    
 */

import db from '../utils/db.js';
import { selectCategoriaById } from './modelsCategoria.js';

export const selectAllItems = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM item';
    try {
        const result = await connect.query(sql);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

// requiere un id de item
export const selectItemById = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM item WHERE id = $1';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

// requiere un id de categoria
export const selectItemByCategoriaId = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM item WHERE categoria_id = $1';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

// requiere un tipo de item
export const selectItemByTipo = async (tipo) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM item WHERE tipo = $1';
    try {
        const result = await connect.query(sql, [tipo]);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

// requiere un nombre de item
export const selectItemByNombre = async (nombre) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM item WHERE nombre = $1';
    try {
        const result = await connect.query(sql, [nombre]);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

// requiere un nombre de item y una categoria
export const selectItemByNombreCategoria = async (nombre, categoria) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM item WHERE nombre = $1 AND categoria_id = $2';
    try {
        const result = await connect.query(sql, [nombre, categoria]);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

// requiere un nombre de item y un tipo
export const selectItemByNombreTipo = async (nombre, tipo) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM item WHERE nombre = $1 AND tipo = $2';
    try {
        const result = await connect.query(sql, [nombre, tipo]);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

// requiere un nombre de item, una categoria y un tipo
export const selectItemByNombreCategoriaTipo = async (nombre, categoria, tipo) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM item WHERE nombre = $1 AND categoria_id = $2 AND tipo = $3';
    try {
        const result = await connect.query(sql, [nombre, categoria, tipo]);
        console.log('Resultados encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

// requiere un objeto i:{nombre, descripcion, categoria_id, tipo}
export const insertItem = async (i) => {
    const categoria = await selectCategoriaById(i.categoria_id);
    if(categoria.length === 0){
        console.error('Categoria no encontrada');
        return;
    }
    const connect = await db.connect();
    let sql = 'INSERT INTO item (nombre, descripcion, categoria_id, tipo, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    try {
        const result = await connect.query(sql, [i.nombre, i.descripcion, i.categoria_id, i.tipo, '1']);
        console.log('Item creado');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

// requiere un objeto i:{id, nombre, descripcion, categoria_id, tipo, estado}
export const updateItem = async (i) => {
    const itemAux = await selectItemById(i.id);
    if(itemAux.length === 0){
        console.error('Item no encontrado');
        return;
    } else if(i.categoria_id){
        const categoria = await selectCategoriaById(i.categoria_id);
        if(categoria.length === 0){
            console.error('Categoria no encontrada');
            return;
        }
    }
        i.nombre = i.nombre || itemAux[0].nombre;
        i.descripcion = i.descripcion || itemAux[0].descripcion;
        i.categoria_id = i.categoria_id || itemAux[0].categoria_id;
        i.tipo = i.tipo || itemAux[0].tipo;
        i.estado = i.estado || itemAux[0].estado;
    
    const connect = await db.connect();
    let sql = 'UPDATE item SET nombre = $1, descripcion = $2, categoria_id = $3, tipo = $4, estado = $5 WHERE id = $6 RETURNING *';
    try {
        const result = await connect.query(sql, [i.nombre, i.descripcion, i.categoria_id, i.tipo, i.estado, i.id]);
        console.log('Item actualizado');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

// requiere un id de item
export const deleteItem = async (id) => {
    const connect = await db.connect();
    let sql = 'UPDATE item SET estado = $1 WHERE id = $2 RETURNING *';
    try {
        const result = await connect.query(sql, ['2', id]);
        console.log('Item eliminado');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}