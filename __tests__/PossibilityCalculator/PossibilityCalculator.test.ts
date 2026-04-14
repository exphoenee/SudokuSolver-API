import { describe, test, expect, beforeEach } from '@jest/globals';
import SudokuBoard from '../../dist/core/SudokuBoard/SudokuBoard.js';

describe('PossibilityCalculator', () => {
  let board: SudokuBoard;

  beforeEach(() => {
    board = new SudokuBoard(3, 3);
  });

  test('calculates cell possibilities for empty cell', () => {
    const possibilities = board.getCellPossibilities({ x: 4, y: 4 });
    expect(possibilities.length).toBe(9);
  });

  test('updates possibility map for all cells', () => {
    board.updatePossibilityMap();
    const cell = board.getCell({ x: 0, y: 0 });
    expect(cell.possibilities.length).toBeGreaterThan(0);
  });

  test('gets possibility matrix for all cells', () => {
    const matrix = board.getPossibilityMatrix();
    expect(matrix.length).toBe(81);
  });

  test('gets free cell with least possibilities after setting values', () => {
    board.setCellValue({ x: 0, y: 0 }, 1);
    board.setCellValue({ x: 1, y: 0 }, 2);
    board.updatePossibilityMap();
    const freeCell = board.getFreeCellWithLeastPossibilities();
    expect(freeCell).toBeTruthy();
  });
});
