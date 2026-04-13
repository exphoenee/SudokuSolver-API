import 'dotenv/config';
import { createApp } from './src/app.js';
import { config } from './src/config/index.js';

const PORT = config.get<number>('api.port') || 3000;
const HOST = config.get<string>('api.host') || '0.0.0.0';
const app = createApp();

app.listen(PORT, HOST, () => {
  console.log(`Sudoku Solver API running on ${HOST}:${PORT}`);
});

export default app;
