// src/query/query.router.js
import express from 'express';
import { handleQueryRequest, handleConversationStart } from './query.controller.js';

const router = express.Router();

router.post('/', handleQueryRequest);
router.post('/conversation', handleConversationStart);

export default router;
