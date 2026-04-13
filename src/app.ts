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
    res.json(
      successResponse({
        info: 'Sudoku Solver API',
        version: '3.0.0',
        endpoints: {
          solve: 'POST /solve with { puzzle: string, format: "string"|"1D"|"2D" }',
          generate: 'GET /generate/:level where level is easy|medium|hard|evil',
          health: 'GET /health',
        },
      })
    );
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
