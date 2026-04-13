import { describe, test, expect, beforeEach } from '@jest/globals';
import SudokuBoard from '../../dist/core/SudokuBoard/SudokuBoard.js';
import SudokuSolver from '../../dist/solver/SudokuSolver.js';
import { puzzle2d, puzzleSolution } from '../data/puzzles.js';

describe('SudokuSolver', () => {
  let board: SudokuBoard;
  let solver: SudokuSolver;

  beforeEach(() => {
    board = new SudokuBoard(3, 3);
    solver = new SudokuSolver(board);
  });

  describe('Solving', () => {
    test('solves an easy puzzle', () => {
      solver.setBoard(puzzle2d);
      const solution = solver.solvePuzzle();
      expect(solution).toEqual(puzzleSolution);
    });

    test('solves puzzle with format string', () => {
      solver.setBoard(puzzle2d);
      const solution = solver.solvePuzzle({ format: 'string' });
      const expected = puzzleSolution.flat(1).join(',');
      expect(solution).toBe(expected);
    });

    test('solves puzzle with format 1D', () => {
      solver.setBoard(puzzle2d);
      const solution = solver.solvePuzzle({ format: '1D' });
      const expected = puzzleSolution.flat(1);
      expect(solution).toEqual(expected);
    });

    test('clears board before solving', () => {
      solver.clearBoard();
      const solution = solver.solvePuzzle({ puzzle: puzzle2d });
      expect(solution).toEqual(puzzleSolution);
    });
  });

  describe('Board Management', () => {
    test('clears the board', () => {
      board.setBoard(puzzle2d);
      solver.clearBoard();
      const values = board.getCellValues({ format: '1D' });
      expect(values.every((v: number) => v === 0)).toBe(true);
    });

    test('sets board from puzzle parameter', () => {
      solver.setBoard(puzzle2d);
      expect(board.getCell({ x: 0, y: 0 }).value).toBe(1);
    });
  });
});
