'use strict';
import express from 'express';
import SudokuSolver from './solver/SudokuSolver.mjs';
import SudokuBoard from './core/SudokuBoard/SudokuBoard.mjs';
import SudokuGenerator from './generator/SudokuGenerator.mjs';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      info: 'Sudoku Solver API',
      endpoints: {
        solve: "POST /solve with { puzzle: string, format: 'string'|'1D'|'2D' }",
        generate: 'GET /generate/:level where level is easy|medium|hard|evil',
      },
    });
  });

  app.post('/solve', (req, res) => {
    const { puzzle, format = 'string', unfilledChar = '.' } = req.body;

    if (!puzzle) {
      return res.status(400).json({ error: 'Puzzle is required' });
    }

    const board = new SudokuBoard(3, 3);
    const solver = new SudokuSolver(board);

    try {
      const solution = solver.solvePuzzle({ puzzle, format, unfilledChar });
      res.json({ solution });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/generate/:level', (req, res) => {
    const { level } = req.params;
    const validLevels = ['easy', 'medium', 'hard', 'evil'];

    if (!validLevels.includes(level)) {
      return res.status(400).json({
        error: `Invalid level. Must be one of: ${validLevels.join(', ')}`,
      });
    }

    const board = new SudokuBoard(3, 3);
    const generator = new SudokuGenerator({ sudokuboard: board });

    const results = generator.generatePuzzle({ level });
    res.json({ results });
  });

  return app;
}

export default createApp;
