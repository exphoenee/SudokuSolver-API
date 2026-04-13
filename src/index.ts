import 'dotenv/config';
import { createApp } from './app.js';
import { config } from './config/index.js';

const PORT = config.get<number>('api.port') || 3000;
const HOST = config.get<string>('api.host') || '0.0.0.0';
const app = createApp();

app.listen(PORT, HOST, () => {
  process.stdout.write(`Sudoku Solver API running on ${HOST}:${PORT}\n`);
});

export default app;
