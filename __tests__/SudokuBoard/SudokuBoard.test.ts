import { describe, test, expect, beforeEach } from '@jest/globals';
import SudokuBoard from '../../dist/core/SudokuBoard/SudokuBoard.js';
import { puzzle2d } from '../data/puzzles.js';

describe('SudokuBoard', () => {
  let board: SudokuBoard;

  beforeEach(() => {
    board = new SudokuBoard(3, 3);
  });

  describe('Board Creation', () => {
    test('creates a 9x9 board', () => {
      expect(board.boardSize.x).toBe(9);
      expect(board.boardSize.y).toBe(9);
    });

    test('creates 81 cells', () => {
      expect(board.cells.length).toBe(81);
    });

    test('has box size 3x3', () => {
      expect(board.boardSize.boxSizeX).toBe(3);
      expect(board.boardSize.boxSizeY).toBe(3);
    });
  });

  describe('Setting Values', () => {
    test('sets board from 2D array', () => {
      board.setBoard(puzzle2d);
      expect(board.getCellValues({ format: '2D' })).toEqual(puzzle2d);
    });

    test('sets board from 1D array', () => {
      const flatPuzzle = puzzle2d.flat(1);
      board.setBoard(flatPuzzle);
      expect(board.getCellValues({ format: '2D' })).toEqual(puzzle2d);
    });

    test('sets board from comma-separated string', () => {
      const strPuzzle = puzzle2d.flat(1).join(',');
      board.setBoard(strPuzzle);
      expect(board.getCellValues({ format: '2D' })).toEqual(puzzle2d);
    });

    test('sets cell value by coordinates', () => {
      board.setCellValue({ x: 0, y: 0 }, 5);
      expect(board.getCell({ x: 0, y: 0 }).value).toBe(5);
    });
  });

  describe('Getting Values', () => {
    beforeEach(() => {
      board.setBoard(puzzle2d);
    });

    test('gets cell by coordinates', () => {
      const cell = board.getCell({ x: 0, y: 0 });
      expect(cell.value).toBe(1);
    });

    test('gets row values', () => {
      const rowValues = board.getRowValues(0);
      expect(rowValues).toEqual([1, 0, 0, 0, 0, 7, 0, 0, 3]);
    });

    test('gets column values', () => {
      const colValues = board.getColValues(0);
      expect(colValues).toEqual([1, 9, 0, 3, 0, 0, 0, 5, 6]);
    });

    test('gets box values', () => {
      const boxValues = board.getBoxValues(0);
      expect(boxValues).toEqual([1, 0, 0, 9, 0, 6, 0, 3, 0]);
    });
  });

  describe('Finding Free Cells', () => {
    beforeEach(() => {
      board.setBoard(puzzle2d);
    });

    test('finds first free cell', () => {
      const freeCell = board.getFirstFreeCell();
      expect(freeCell.x).toBe(1);
      expect(freeCell.y).toBe(0);
      expect(freeCell.value).toBe(0);
    });

    test('finds coordinates of first free cell', () => {
      const coords = board.coordsOfFirstFreeCell();
      expect(coords).toEqual({ x: 1, y: 0 });
    });
  });

  describe('Cell Possibilities', () => {
    beforeEach(() => {
      board.setBoard(puzzle2d);
    });

    test('calculates cell possibilities', () => {
      const possibilities = board.getCellPossibilities({ x: 1, y: 0 });
      expect(possibilities).toContain(4);
      expect(possibilities).toContain(5);
      expect(possibilities).toContain(8);
    });
  });

  describe('Validation', () => {
    test('validates correct puzzle', () => {
      board.setBoard(puzzle2d);
      expect(board.puzzleIsCorrect()).toBe(true);
    });

    test('detects duplicate in row', () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 0 }, 1);
      expect(board.getRow(0).hasDuplicates()).toBe(true);
    });

    test('detects duplicate in column', () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 0, y: 1 }, 1);
      expect(board.getCol(0).hasDuplicates()).toBe(true);
    });

    test('detects duplicate in box', () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 1 }, 1);
      expect(board.getBox(0).hasDuplicates()).toBe(true);
    });
  });

  describe('Batch Operations', () => {
    beforeEach(() => {
      board.setBoard(puzzle2d);
    });

    test('gets missing numbers from row', () => {
      const missing = board.getRow(0).getMissingNumbers();
      expect(missing).toContain(2);
      expect(missing).toContain(4);
    });

    test('gets duplicate valued cells after setting duplicates', () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 0 }, 1);
      const dups = board.getRow(0).getDuplicateValuedCells();
      expect(dups.length).toBe(2);
    });
  });
});
