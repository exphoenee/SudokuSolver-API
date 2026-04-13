import express, { type Application, type Request, type Response } from 'express';
import SudokuSolver from './solver/SudokuSolver.js';
import SudokuBoard from './core/SudokuBoard/SudokuBoard.js';
import SudokuGenerator from './generator/SudokuGenerator.js';
import { config } from './config/index.js';
import {
  validateSolveRequest,
  validateGenerateRequest,
  throwIfErrors,
} from './utils/validation.js';
import {
  successResponse,
  errorResponse,
  formatSolveResponse,
  formatGenerateResponse,
} from './utils/response.js';
import { SudokuError, ValidationError } from './utils/errors.js';
import type { PuzzleInput, PuzzleFormat, DifficultyLevel } from './types.js';

/**
 * Creates and configures the Express application.
 * @returns {Application}
 */
export function createApp(): Application {
  const app = express();
  app.use(express.json());

  app.get('/', (_req: Request, res: Response) => {
    res.type('html').send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sudoku Solver API</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
    .endpoint { background: white; border-radius: 8px; padding: 15px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .method { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; margin-right: 10px; }
    .get { background: #61affe; color: white; }
    .post { background: #49cc90; color: white; }
    .path { font-family: monospace; font-size: 1.1em; color: #333; }
    .description { color: #666; margin-top: 8px; }
    code { background: #eee; padding: 2px 6px; border-radius: 3px; }
    pre { background: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 6px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Sudoku Solver API</h1>
  <p><strong>Version:</strong> 3.0.0</p>
  
  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/solve</span>
    <p class="description">Solve a Sudoku puzzle</p>
    <pre>body: { puzzle: string, format?: "string" | "1D" | "2D" }</pre>
  </div>
  
  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/generate/:level</span>
    <p class="description">Generate a random puzzle</p>
    <p><strong>Levels:</strong> <code>easy</code> | <code>medium</code> | <code>hard</code> | <code>evil</code></p>
  </div>
  
  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/health</span>
    <p class="description">Health check endpoint</p>
  </div>
</body>
</html>`);
  });

  app.get('/health', (_req: Request, res: Response) => {
    res.json(successResponse({ status: 'healthy' }));
  });

  app.post('/solve', (req: Request, res: Response) => {
    const startTime = Date.now();

    try {
      const body = req.body as {
        puzzle?: PuzzleInput;
        format?: PuzzleFormat;
        unfilledChar?: string;
      };
      const { puzzle, format = 'string', unfilledChar = '.' } = body;

      const validationErrors = validateSolveRequest({ puzzle, format, unfilledChar });
      throwIfErrors(validationErrors);

      const board = new SudokuBoard(
        config.get<number>('board.defaultBoxSizeX') ?? 3,
        config.get<number>('board.defaultBoxSizeY') ?? 3
      );
      const solver = new SudokuSolver(board);

      const solution = solver.solvePuzzle({
        puzzle,
        format,
        unfilledChar,
      });

      if (!solution) {
        throw new SudokuError('Puzzle has no solution', 'NO_SOLUTION');
      }

      const duration = Date.now() - startTime;
      res.json(formatSolveResponse(solution, { durationMs: duration }));
    } catch (err) {
      const duration = Date.now() - startTime;
      const statusCode = err instanceof ValidationError ? 400 : 500;
      const error =
        err instanceof SudokuError
          ? err
          : new SudokuError((err as Error).message, 'INTERNAL_ERROR');

      res.status(statusCode).json(errorResponse(error, { durationMs: duration }));
    }
  });

  app.get('/generate/:level', (req: Request, res: Response) => {
    const startTime = Date.now();

    try {
      const params = req.params as { level?: string };
      const level = params.level ?? 'easy';

      const validationErrors = validateGenerateRequest({ level });
      throwIfErrors(validationErrors);

      const board = new SudokuBoard(
        config.get<number>('board.defaultBoxSizeX') ?? 3,
        config.get<number>('board.defaultBoxSizeY') ?? 3
      );
      const generator = new SudokuGenerator({ sudokuboard: board });

      const results = generator.generatePuzzle({ level: level.toLowerCase() as DifficultyLevel });
      const duration = Date.now() - startTime;

      res.json(formatGenerateResponse(results, { durationMs: duration }));
    } catch (err) {
      const duration = Date.now() - startTime;
      const statusCode = err instanceof ValidationError ? 400 : 500;
      const error =
        err instanceof SudokuError
          ? err
          : new SudokuError((err as Error).message, 'INTERNAL_ERROR');

      res.status(statusCode).json(errorResponse(error, { durationMs: duration }));
    }
  });

  return app;
}

export default createApp;
