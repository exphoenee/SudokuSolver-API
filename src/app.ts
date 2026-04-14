import express, { type Application, type Request, type Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import {
  validateSolveRequest,
  validateGenerateRequest,
  type SolveRequest,
  type GenerateRequest,
} from './utils/validation.js';
import { successResponse, formatSolveResponse, formatGenerateResponse } from './utils/response.js';
import { swaggerSpec } from './docs/swagger.js';
import { cache } from './utils/cache.js';
import { handleRoute } from './utils/handleRoute.js';
import { sudokuService } from './services/SudokuService.js';
import { getHomeHtml } from './services/HtmlService.js';

/**
 * Creates and configures the Express application.
 * @returns {Application}
 */
export function createApp(): Application {
  const app = express();
  app.use(express.json());
  app.use(cache.middleware({ ttl: 60000, enabled: true }));

  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: { message: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' },
    },
  });
  app.use(limiter);

  app.get('/', (_req: Request, res: Response) => {
    res.type('html').send(getHomeHtml());
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/health', (_req: Request, res: Response) => {
    const usage = process.memoryUsage();
    res.json(
      successResponse({
        status: 'healthy',
        uptime: Math.round(process.uptime()),
        memory: {
          rss: Math.round(usage.rss / 1024 / 1024),
          heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
          heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
          external: Math.round(usage.external / 1024 / 1024),
        },
      })
    );
  });

  app.get('/cache', (_req: Request, res: Response) => {
    res.json(successResponse(cache.stats()));
  });

  app.delete('/cache', (_req: Request, res: Response) => {
    cache.clear();
    res.json(successResponse({ cleared: true }));
  });

  app.post('/solve', (req: Request, res: Response) => {
    const body = validateSolveRequest(req.body) as SolveRequest;
    handleRoute(
      req,
      res,
      () => sudokuService.solve(body),
      (result, duration) =>
        formatSolveResponse((result as { solution: string }).solution, { durationMs: duration })
    );
  });

  app.get('/generate/:level', (req: Request, res: Response) => {
    const params = validateGenerateRequest(req.params) as GenerateRequest;
    handleRoute(
      req,
      res,
      () => sudokuService.generate(params.level as 'easy' | 'medium' | 'hard' | 'evil'),
      (result, duration) => formatGenerateResponse(result as object, { durationMs: duration })
    );
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, error: { message: 'Not found', code: 'NOT_FOUND' } });
  });

  app.use((err: Error, _req: Request, res: Response, _next: unknown) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error', code: 'INTERNAL_ERROR' },
    });
  });

  return app;
}

export default createApp;
