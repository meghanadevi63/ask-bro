// src/query/query.router.js
import express from 'express';
import { handleQueryRequest } from './query.controller.js';

const router = express.Router();

router.post('/', handleQueryRequest);

export default router;
