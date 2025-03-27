import { Pool } from 'pg';

/*
relaciona los ajustes de precio con con los items
cada item tiene varios ajustes de precio
necesita un item_id y un ajuste_id

ITEM_AJUSTE{
    id
    item_id
    ajuste_precio_id (Impuesto)
}

*/
const modelsAjustePrecio = requiere ('./modelsAjustePrecio');
const modelsItem = require ('./modelsItem');

//Obtener todos los registros de itemAjuste
export const selectAllItemsAjuste = async () => {
    const connect = await Pool.connect();
    let sql = 'SELECT * FROM item_ajuste';
    try {
        const result = await connect.query(sql);
        console.log('Resultados encontrados');
        return result.rows;
     } catch (error) {
        console.error(error.message);
     } finally {
        if (connect) {
            connect.release();
        }
     }
};
// Obtener un registro por ID 
export const selectAllItemsAjusteById = async (id) => {
    const connect = await Pool.connect();
    let sql = 'SELECT * FROM item_ajuste WHERE id = $1'
    try{
        const result = await connect.query(sql, [id]);
        console.log('Resultados Encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) {
            connect.release();
        }
    }
};

// Obtener registros por ID de Item
export const selectItemAjustesByItemId = async (item_id) => {
    const connect = await Pool.connect();
    let sql = 'SELECT * FROM item_ajuste WHERE item_id = $1';
    try {
        const result = await connect.query(sql, [item_id]);
        console.log('Resultados Encontrados');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) {
            connect.release();
        }
    }
}

// Obtener registros por ID de AJUSTE_PRECIO
export const selectItemAjustesByAjustePrecioId = async (ajuste_Precio_Id) => {
    const connect = await pool.connect();
    let sql = 'SELECT * FROM item_ajuste WHERE ajuste_precio_id = $1';
    try {
      const result = await connect.query(sql, [ajuste_Precio_Id]);
      console.log('Resultados encontrados');
      return result.rows;
    } catch (error) {
      console.error(error.message);
    } finally {
      if (connect) {
        connect.release();
      }
    }
  };

//Insertar un nuevo registro
export const insertItemAjuste = async (itemAjuste) => {
    try {
        const ajustePrecio = await modelsAjustePrecio.selectAjustePrecioId(itemAjuste.ajuste_Precio_Id);
        const item = await midelsItem.selectItemById(itemAjuste.item_id);

        if (!ajustePrecio || !item) {
            throw new Error('ID de ajuste de precio o ID de item no validos');
        }
        const connect = await pool.connect();
        let sql = 'INSERT INTO item_ajuste (item_id, ajuste_precio_id, impuesto) VALUES ($1, $2, $3) RETURNING *';
        const result = await connect.query(sql, [itemAjuste.item_id, itemAjuste.ajuste_precio_id, itemAjuste.impuesto]);
        console.log('ItemAjuste creado');
        return result.rows;
    } catch (error) {
        console.error(error.message);
    } finally {
        if (connect) {
            connect.release();
        }
    }
};

// Actualizar un registro
export const updateItemAjuste = async (itemAjuste) => {
    try {
      const ajustePrecio = await modelsAjustePrecio.selectAjustePrecioById(itemAjuste.ajuste_precio_id);
      const item = await modelsItem.selectItemById(itemAjuste.item_id);
  
      if (!ajustePrecio || !item) {
        throw new Error('ID de ajuste de precio o ID de ítem no válidos');
      }
  
      const connect = await pool.connect();
      let sql = 'UPDATE item_ajuste SET item_id = $1, ajuste_precio_id = $2, impuesto = $3 WHERE id = $4 RETURNING *';
      const result = await connect.query(sql, [itemAjuste.item_id, itemAjuste.ajuste_precio_id, itemAjuste.impuesto, itemAjuste.id]);
      console.log('ItemAjuste actualizado');
      return result.rows;
    } catch (error) {
      console.error(error.message);
    } finally {
      if (connect) {
        connect.release();
      }
    }
  };

  // Eliminar un registro por ID
  export const deleteItemAjuste = async (id) => {
    const connect = await pool.connect();
    let sql = 'DELETE FROM item_ajuste WHERE id = $1 RETURNING *';
    try {
      const result = await connect.query(sql, [id]);
      console.log('ItemAjuste eliminado');
      return result.rows;
    } catch (error) {
      console.error(error.message);
    } finally {
      if (connect) {
        connect.release();
      }
    }
  }; 