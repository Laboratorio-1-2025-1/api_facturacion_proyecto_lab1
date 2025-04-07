import db from '../utils/db.js';

export const selectAllCorreo = async () => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM correo';
    try {
        const result = await connect.query(sql);
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

export const selectCorreoById = async (id) => {
    const connect = await db.connect();
    let sql = 'SELECT * FROM correo WHERE pk_id = $1';
    try {
        const result = await connect.query(sql, [id]);
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

export const insertCorreo = async (correo) => {
    const connect = await db.connect();
    let sql = 'INSERT INTO correo (cliente, descripcion, dominio, estado) VALUES ($1, $2, $3, $4) RETURNING *';
    try {
        const result = await connect.query(sql, [correo.cliente, correo.descripcion, correo.dominio, '1']);
        return result.rows[0];
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

export const updateCorreo = async (correo) => {
    const connect = await db.connect();
    let sql = 'UPDATE correo SET cliente = $1, descripcion = $2, dominio = $3, estado = $4 WHERE pk_id = $5 RETURNING *';
    try {
        const result = await connect.query(sql, [correo.cliente, correo.descripcion, correo.dominio, correo.estado, correo.pk_id]);
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};

export const deleteCorreo = async (id) => {
    const connect = await db.connect();
    let sql = 'UPDATE correo SET estado = $1 WHERE pk_id = $2 RETURNING *';
    try {
        const result = await connect.query(sql, ['2', id]);
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) { connect.release(); }
    }
};