import 'dotenv/config';
import { createApp } from './app.js';
import { config } from './config/index.js';

const PORT = config.get<number>('api.port') || 3000;
const HOST = config.get<string>('api.host') || '0.0.0.0';
const app = createApp();

let server: ReturnType<typeof app.listen> | null = null;

function shutdown(signal: string) {
  if (!server) return;
  process.stdout.write(`\n[${signal}] Starting graceful shutdown...\n`);

  server.close(() => {
    process.stdout.write('[Graceful shutdown complete]\n');
    process.exit(0);
  });

  setTimeout(() => {
    process.stdout.write('[Force exit - timeout]\n');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

server = app.listen(PORT, HOST, () => {
  process.stdout.write(`Sudoku Solver API running on ${HOST}:${PORT}\n`);
});

export default app;
