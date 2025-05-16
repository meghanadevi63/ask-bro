import pool from '../db.js';

export const queryDatabase = async (sql) => {
    const res = await pool.query(sql);
    return res.rows;
};