import pool from '../../db.js';
import { fetchMetadata } from './metadata.service.js';

export async function testConnection(req, res) {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'connected' });
  } catch (error) {
    console.error('DB connection test failed:', error);
    res.status(500).json({ status: 'failed', error: error.message });
  }
}

export async function getMetadata(req, res) {
  try {
    const metadata = await fetchMetadata();
    res.json(metadata);
  } catch (error) {
    console.error('Failed to fetch metadata:', error);
    res.status(500).json({ error: 'Failed to retrieve database metadata' });
  }
}
