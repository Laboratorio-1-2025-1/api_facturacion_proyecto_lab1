import db from '../utils/db.js';

/**
 * Busca todas las órdenes
 * @returns Todas las órdenes
 */
export const selectAllOrdenes = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM orden';
    try {
        const result = await connect.query(sql);
        console.log('Órdenes encontradas');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Busca una orden por su ID
 * @param {number} id
 * @returns La orden encontrada
 */
export const selectOrdenById = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM orden WHERE id = $1';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Orden encontrada');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Inserta una nueva orden
 * @param {{cliente_id: number, fecha: string, estado: string}} orden
 * @returns La orden creada
 */
export const insertOrden = async (orden) => {
    const connect = await db.connect();
    let sql = 'INSERT INTO orden (cliente_id, fecha, estado) VALUES ($1, $2, $3) RETURNING *';
    try {
        const result = await connect.query(sql, [orden.cliente_id, orden.fecha, orden.estado]);
        console.log('Orden creada');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Actualiza una orden
 * @param {{id: number, cliente_id: number, fecha: string, estado: string}} orden
 * @returns La orden actualizada
 */
export const updateOrden = async (orden) => {
    const connect = await db.connect();
    let sql = 'UPDATE orden SET cliente_id = $1, fecha = $2, estado = $3 WHERE id = $4 RETURNING *';
    try {
        const result = await connect.query(sql, [orden.cliente_id, orden.fecha, orden.estado, orden.id]);
        console.log('Orden actualizada');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

/**
 * Elimina una orden
 * @param {number} id
 * @returns La orden eliminada
 */
export const deleteOrden = async (id) => {
    const connect = await db.connect();
    let sql = 'DELETE FROM orden WHERE id = $1 RETURNING *';
    try {
        const result = await connect.query(sql, [id]);
        console.log('Orden eliminada');
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};