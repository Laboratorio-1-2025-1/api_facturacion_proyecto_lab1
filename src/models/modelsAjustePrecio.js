/*
 necesaria para aplicar los impuestos y descuentos
 cada item puede tener varios ajustes
 relaciona con la tabla intermedia item_ajuste_precio

 ajustePrecio{
    id
    descripcion
    aplicable_a (1: producto, 2: servicio)
    tipo (1: impuesto, 2: descuento)
    valor
    estado (1: activo, 2: inactivo)
 }

 */

import db from '../utils/db.js';

export const selectAllAjustePrecio = async () => {
      const connect = await db.connect();
      let sql = 'SELECT * FROM ajuste_precio';
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

//requiere un tipo de ajuste
export const selectAjustePrecioByTipo = async (tipo) => {
      const connect = await db.connect();
      let sql = 'SELECT * FROM ajuste_precio WHERE tipo = $1';
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

//requiere un aplicable_a
export const selectAjustePrecioByaplicable_a = async (aplicable_a) => {
      const connect = await db.connect();
      let sql = 'SELECT * FROM ajuste_precio WHERE aplicable_a = $1';
      try {
         const result = await connect.query(sql, [aplicable_a]);
         console.log('Resultados encontrados');
         return result.rows;
      } catch (error) {
         console.error(error.message);
      } finally {
         if(connect){ connect.release(); }
      }
   }

//requiere un tipo de ajuste y un aplicable_a
export const selectAjustePrecioByTipoaplicable_a = async (tipo, aplicable_a) => {
      const connect = await db.connect();
      let sql = 'SELECT * FROM ajuste_precio WHERE tipo = $1 AND aplicable_a = $2';
      try {
         const result = await connect.query(sql, [tipo, aplicable_a]);
         console.log('Resultados encontrados');
         return result.rows;
      } catch (error) {
         console.error(error.message);
      } finally {
         if(connect){ connect.release(); }
      }
   }

// requiere un id de ajuste
export const selectAjustePrecioById = async (id) => {
      const connect = await db.connect();
      let sql = 'SELECT * FROM ajuste_precio WHERE id = $1';
      try {
         const result = await connect.query(sql, [id]);
         console.log('Resultados encontrado');
         return result.rows;
      } catch (error) {
         console.error(error.message);
      } finally {
         if(connect){ connect.release(); }
      }
   }

// requiere un objeto a:{descripcion, aplicable_a, tipo, valor}
export const insertAjustePrecio = async (a) => {
      const connect = await db.connect();
      let sql = 'INSERT INTO ajuste_precio (descripcion, aplicable_a, tipo, valor, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      try {
         const result = await connect.query(sql, [a.descripcion, a.aplicable_a, a.tipo, a.valor, '1']);
         console.log('Ajuste de precio creado');
         return result.rows;
      } catch (error) {
         console.error(error.message);
      } finally {
         if(connect){ connect.release(); }
      }
   }

// requiere un objeto a:{id, descripcion, aplicable_a, tipo, valor, estado}
export const updateAjustePrecio = async (a) => {
      // se verifica que el ajuste exista
      const ajusteAux = await selectAjustePrecioById(a.id);
      if(ajusteAux.length === 0){
         console.error('El ajuste de precio no existe');
         return;
      } else {
         a.descripcion = a.descripcion || ajusteAux[0].descripcion;
         a.aplicable_a = a.aplicable_a || ajusteAux[0].aplicable_a;
         a.tipo = a.tipo || ajusteAux[0].tipo;
         a.valor = a.valor || ajusteAux[0].valor;
         a.estado = a.estado || ajusteAux[0].estado;
      }

      const connect = await db.connect();
      let sql = 'UPDATE ajuste_precio SET descripcion = $1, aplicable_a = $2, tipo = $3, valor = $4, estado = $5 WHERE id = $6 RETURNING *';
      try {
         const result = await connect.query(sql, [a.descripcion, a.aplicable_a, a.tipo, a.valor, a.estado, a.id]);
         console.log('Ajuste de precio actualizado');
         return result.rows;
      } catch (error) {
         console.error(error.message);
      } finally {
         if(connect){ connect.release(); }
      }
   }

// requiere un id de ajuste
export const deleteAjustePrecio = async (id) => {
      // se verifica que el ajuste exista
      const ajusteAux = await selectAjustePrecioById(id);
      if(ajusteAux.length === 0){
         console.error('El ajuste de precio no existe');
         return null;
      }
      const connect = await db.connect();
      let sql = 'UPDATE ajuste_precio SET estado = $1 WHERE id = $2 RETURNING *';
      try {
         const result = await connect.query(sql, ['2', id]);
         console.log('Ajuste de precio eliminado');
         return result.rows;
      } catch (error) {
         console.error(error.message);
      } finally {
         if(connect){ connect.release(); }
      }
   }