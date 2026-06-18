import cors from 'cors';
import express from 'express';
import streamRouter from './routes/stream';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/stream', streamRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
