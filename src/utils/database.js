import mysql from 'mysql2/promise';
import dbConfig from '../config/database.js';
import logger from './logger.js';

let pool = null;

// Crear pool de conexiones
export function createPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    logger.info('MySQL connection pool created', {
      host: dbConfig.host,
      database: dbConfig.database,
    });
  }
  return pool;
}

// Obtener pool de conexiones
export function getPool() {
  if (!pool) {
    return createPool();
  }
  return pool;
}

// Ejecutar query simple
export async function query(sql, params = []) {
  const connection = getPool();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    logger.error('Database query error', { sql, error: error.message });
    throw error;
  }
}

// Insertar un registro
export async function insert(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
  
  try {
    const [result] = await getPool().execute(sql, values);
    logger.info('Record inserted', { table, insertId: result.insertId });
    return result.insertId;
  } catch (error) {
    logger.error('Database insert error', { table, error: error.message });
    throw error;
  }
}

// Insertar múltiples registros
export async function insertMany(table, dataArray) {
  if (!dataArray || dataArray.length === 0) {
    return [];
  }

  const keys = Object.keys(dataArray[0]);
  const placeholders = keys.map(() => '?').join(', ');
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

  const connection = getPool();
  const insertedIds = [];

  try {
    for (const data of dataArray) {
      const values = Object.values(data);
      const [result] = await connection.execute(sql, values);
      insertedIds.push(result.insertId);
    }
    
    logger.info('Multiple records inserted', { table, count: insertedIds.length });
    return insertedIds;
  } catch (error) {
    logger.error('Database insertMany error', { table, error: error.message });
    throw error;
  }
}

// Actualizar registros
export async function update(table, data, where) {
  const setClause = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(', ');
  
  const whereClause = Object.keys(where)
    .map((key) => `${key} = ?`)
    .join(' AND ');

  const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
  const values = [...Object.values(data), ...Object.values(where)];

  try {
    const [result] = await getPool().execute(sql, values);
    logger.info('Records updated', { table, affectedRows: result.affectedRows });
    return result.affectedRows;
  } catch (error) {
    logger.error('Database update error', { table, error: error.message });
    throw error;
  }
}

// Buscar registros
export async function find(table, where = {}, options = {}) {
  let sql = `SELECT * FROM ${table}`;
  const values = [];

  if (Object.keys(where).length > 0) {
    const whereClause = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(' AND ');
    sql += ` WHERE ${whereClause}`;
    values.push(...Object.values(where));
  }

  if (options.orderBy) {
    sql += ` ORDER BY ${options.orderBy}`;
  }

  if (options.limit) {
    sql += ` LIMIT ${options.limit}`;
  }

  try {
    const rows = await query(sql, values);
    return rows;
  } catch (error) {
    logger.error('Database find error', { table, error: error.message });
    throw error;
  }
}

// Cerrar pool de conexiones
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('MySQL connection pool closed');
  }
}

export default {
  createPool,
  getPool,
  query,
  insert,
  insertMany,
  update,
  find,
  closePool,
};
