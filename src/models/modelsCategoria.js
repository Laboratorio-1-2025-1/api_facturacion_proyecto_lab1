/*
necesaria para la tabla item
cada item tiene una categoria

CATEGORIA {
    id
    descripcion
    tipo
    estado
}

*/

import db from '../utils/db.js';

export const selectAllCategorias = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM categoria';
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

// requiere un id de categoria
export const selectCategoriaById = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM categoria WHERE id = $1';
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

// requiere un objeto c:{descripcion, tipo}
export const insertCategoria = async (c) => {
    const connect = await db.connect();
    let sql = 'INSERT INTO categoria (descripcion, tipo, estado) VALUES ($1, $2, $3) RETURNING *';
    try {
        const result = await connect.query(sql, [c.descripcion, c.tipo, '1']);
        console.log('Categoria creada');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

// requiere un objeto c:{id, descripcion, tipo, estado}
export const updateCategoria = async (c) => {
    // se verifica que la categoria exista
    const categoriaAux = await selectCategoriaById(c.id);
    if(categoriaAux.length === 0){
        return 'Categoria no encontrada';
    } else {
        // se verifica el objeto categoria para que no se pierdan los datos
        c.descripcion = c.descripcion || categoriaAux[0].descripcion;
        c.tipo = c.tipo || categoriaAux[0].tipo;
        c.estado = c.estado || categoriaAux[0].estado;
    }

    // se actualiza la categoria
    const connect = await db.connect();
    let sql = 'UPDATE categoria SET descripcion = $1, tipo = $2, estado = $3 WHERE id = $4 RETURNING *';
    try {
        const result = await connect.query(sql, [c.descripcion, c.tipo, c.estado, c.id]);
        console.log('Categoria actualizada');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}

// requiere un id de categoria
export const deleteCategoria = async (id) => {
    // se verifica que la categoria exista
    const categoriaAux = await selectCategoriaById(id);
    if(categoriaAux.length === 0){
        return 'Categoria no encontrada';
    }

    // se elimina la categoria
    const connect = await db.connect();
    let sql = 'UPDATE categoria SET estado = $1 WHERE id = $2 RETURNING *';
    try {
        const result = await connect.query(sql, ['2', id]);
        console.log('Categoria eliminada');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
}