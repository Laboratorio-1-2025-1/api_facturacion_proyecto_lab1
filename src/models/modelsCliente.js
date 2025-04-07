import db from '../utils/db.js';
//const db = require('../utils/db');



/**
 * Busca a todos los clientes
 * @returns Todas los clientes
 */

export const selectAllCliente = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM cliente';
    try {
        const result = await connect.query(sql);
        console.log('Resultados encontrados');
        return result.rows;
    }  catch (error) {
        console.error(error.message);
    } finally {
        if(connect){ connect.release(); }
    }
};

/**
 * busca a un cliente por su id
 * @param {number} id
 * @returns al cliente que tenga el id solicitado
 */

export const selectClienteById = async (id)  => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM  cliente WHERE id = $1';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Resultados Encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){connect.release(); }
    }
}

/**
 * Busca un cliente por su dni
 * @param {number} dni
 * @returns al cliente que tenga el dni solicitado
 */
export const selectCliente_ByDni = async (dni)  => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM  cliente WHERE dni = $1';
    try {
        const result = await connect.query(sql, [dni]);
        console.log('Resultados Encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect){connect.release(); }
    }
}

/**
 * Para hacer incersiones en la tabla cliente
 * @param {{dni:number, razon_social:string}} cli
 * @returns nuevos clientes registrados
 */

export const insertCliente = async (cli) => {
    const connect = await db.connect();
    let sql = 'INSERT INTO cliente (dni, razon_social, estado) VALUES ($1, $2, $3) RETURNING *';
    try {
        const result = await connect.query(sql, [cli.dni, cli.razon_social, '1']);
        console.log('Resultado de la base de datos:', result.rows);

        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if(connect) { connect.release(); }
    }
}

/**
 * Actualiza a un cliente
 * @param {{id:number, dni:number, razon_social:string, estado:[1,2]}} cli
 * @returns al cliente actualizado
 */

export const updateCliente = async (cli) => {
    //Se verifica que el cliente exista
    const clienteAux = await selectClienteById(cli.id);
    if(clienteAux.length === 0){
        console.log('Cliente no Encontrado');
        return
    } else {
        // se verifica el objeto cliente para que no se pierdan los datos
        cli.dni = cli.dni || clienteAux[0].dni;
        cli.razon_social = cli.razon_social || clienteAux[0].razon_social
        cli.estado = cli.estado || clienteAux[0].estado;
    }
    //Se actualiza al cliente
    const connect = await db.connect();
    let sql = 'UPDATE cliente SET dni = $1, razon_social = $2, estado = $3 WHERE id = $4 RETURNING *';
    try {
        const result = await connect.query(sql, [cli.dni, cli.razon_social, cli.estado, cli.id]);
        console.log('Cliente Actualizado');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    }finally{
        if (connect){connect.release();}
    }
}

/**
 * Elimina a un cliente
 * @param {number} id 
 * @returns el cliente eliminado
 */

export const deleteCliente = async (id) => {
    // se verifica que el cliente exista
    const clienteAux = await selectClienteById(id);
    if(clienteAux.length === 0){
        console.log('Cliente no Encontrado');
        return 
    }
    // se elimina al cliente
        const connect = await db.connect();
        let sql = 'UPDATE cliente SET estado = $1 WHERE id = $2 RETURNING *';
        try {
            const result = await connect.query(sql, ['2', id]);
            console.log('Cliente Eliminado');
            return result.rows;
        } catch (error) {
            console.error(error.message);
        } finally {
            if(connect){ connect.release(); }
        }
 }
