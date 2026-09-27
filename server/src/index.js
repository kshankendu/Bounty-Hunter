import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import groupsRouter from './routes/groups.js';
import avatarCluesRouter from './routes/avatarClues.js';
import bonusesRouter from './routes/bonuses.js';
import gameStateRouter from './routes/gameState.js';
import adminRouter from './routes/admin.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/groups', groupsRouter);
app.use('/api/avatar-clues', avatarCluesRouter);
app.use('/api/bonuses', bonusesRouter);
app.use('/api/game-state', gameStateRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('[db] connection failed', err);
    process.exit(1);
  });
