import db from "../utils/db";

/**
 * Busca a todos los clientes
 * @returns Todas los clientes
 */

export const selectAllCliente = async () => {
    const connet = db.connet();
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
 