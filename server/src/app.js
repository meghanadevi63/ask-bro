import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index.js';
import cors from 'cors';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(cors());

// Mount routes
app.use('/api', router);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
