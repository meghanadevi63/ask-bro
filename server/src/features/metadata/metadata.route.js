import express from 'express';
import { getMetadata, testConnection } from './metadata.controller.js';

const router = express.Router();

router.get("/", getMetadata);
router.get('/test-connection', testConnection);

export default router;
