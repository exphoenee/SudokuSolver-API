'use strict';
import express from 'express';
import SudokuSolver from './solver/SudokuSolver.mjs';
import SudokuBoard from './core/SudokuBoard/SudokuBoard.mjs';
import SudokuGenerator from './generator/SudokuGenerator.mjs';
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

/**
 * Creates and configures the Express application.
 * @returns {express.Application}
 */
export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => {
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

  app.get('/health', (req, res) => {
    res.json(successResponse({ status: 'healthy' }));
  });

  app.post('/solve', (req, res) => {
    const startTime = Date.now();

    try {
      const { puzzle, format = 'string', unfilledChar = '.' } = req.body;

      const validationErrors = validateSolveRequest({ puzzle, format, unfilledChar });
      throwIfErrors(validationErrors);

      const board = new SudokuBoard(
        config.get('board.defaultBoxSizeX'),
        config.get('board.defaultBoxSizeY')
      );
      const solver = new SudokuSolver(board);

      const solution = solver.solvePuzzle({ puzzle, format, unfilledChar });

      if (!solution) {
        throw new SudokuError('Puzzle has no solution', 'NO_SOLUTION');
      }

      const duration = Date.now() - startTime;
      res.json(formatSolveResponse(solution, { durationMs: duration }));
    } catch (err) {
      const duration = Date.now() - startTime;
      const statusCode = err instanceof ValidationError ? 400 : 500;
      const error =
        err instanceof SudokuError ? err : new SudokuError(err.message, 'INTERNAL_ERROR');

      res.status(statusCode).json(errorResponse(error, { durationMs: duration }));
    }
  });

  app.get('/generate/:level', (req, res) => {
    const startTime = Date.now();

    try {
      const { level } = req.params;

      const validationErrors = validateGenerateRequest({ level });
      throwIfErrors(validationErrors);

      const board = new SudokuBoard(
        config.get('board.defaultBoxSizeX'),
        config.get('board.defaultBoxSizeY')
      );
      const generator = new SudokuGenerator({ sudokuboard: board });

      const results = generator.generatePuzzle({ level: level.toLowerCase() });
      const duration = Date.now() - startTime;

      res.json(formatGenerateResponse(results, { durationMs: duration }));
    } catch (err) {
      const duration = Date.now() - startTime;
      const statusCode = err instanceof ValidationError ? 400 : 500;
      const error =
        err instanceof SudokuError ? err : new SudokuError(err.message, 'INTERNAL_ERROR');

      res.status(statusCode).json(errorResponse(error, { durationMs: duration }));
    }
  });

  return app;
}

export default createApp;
