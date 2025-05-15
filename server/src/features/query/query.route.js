import express from 'express';
import { handleUserQuery } from './query.controller.js';

const router = express.Router();

router.post('/', handleUserQuery); // POST /api/query

export default router;
