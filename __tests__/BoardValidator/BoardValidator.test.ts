import { describe, test, expect, beforeEach } from '@jest/globals';
import BoardValidator from '../../dist/core/services/BoardValidator.js';
import SudokuBoard from '../../dist/core/SudokuBoard/SudokuBoard.js';

describe('BoardValidator', () => {
  let validator: BoardValidator;
  let board: SudokuBoard;

  beforeEach(() => {
    board = new SudokuBoard(3, 3);
    validator = new BoardValidator(9, 9);
  });

  describe('validateCoord', () => {
    test('validates correct coordinates', () => {
      expect(validator.validateCoord(0, 0)).toBe(true);
      expect(validator.validateCoord(4, 4)).toBe(true);
      expect(validator.validateCoord(8, 8)).toBe(true);
    });

    test('rejects out of bounds', () => {
      expect(validator.validateCoord(-1, 0)).toBe(false);
      expect(validator.validateCoord(0, 9)).toBe(false);
      expect(validator.validateCoord(9, 9)).toBe(false);
    });
  });

  describe('areCoordsValid', () => {
    test('validates correct integer coordinates', () => {
      expect(validator.areCoordsValid(0, 0)).toBe(true);
      expect(validator.areCoordsValid(8, 8)).toBe(true);
    });

    test('rejects non-integers', () => {
      expect(validator.areCoordsValid(0.5, 0)).toBe(false);
      expect(validator.areCoordsValid(0, NaN)).toBe(false);
    });

    test('rejects out of bounds', () => {
      expect(validator.areCoordsValid(-1, 0)).toBe(false);
      expect(validator.areCoordsValid(0, 9)).toBe(false);
    });
  });

  describe('puzzleIsCorrect', () => {
    test('returns true for empty board', () => {
      const result = board.puzzleIsCorrect();
      expect(result).toBe(true);
    });

    test('returns false for board with duplicate', () => {
      board.setCellValue({ x: 0, y: 0 }, 5);
      board.setCellValue({ x: 0, y: 1 }, 5);
      const result = board.puzzleIsCorrect();
      expect(result).toBe(false);
    });
  });

  describe('hasRowDuplicates', () => {
    test('detects duplicate', () => {
      board.setCellValue({ x: 0, y: 0 }, 5);
      board.setCellValue({ x: 1, y: 0 }, 5);
      const result = board.getRow(0).hasDuplicates();
      expect(result).toBe(true);
    });

    test('returns false for unique values', () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 0 }, 2);
      const result = board.getRow(0).hasDuplicates();
      expect(result).toBe(false);
    });
  });

  describe('isValidBatchValue', () => {
    test('validates unique value', () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 0 }, 2);
      const result = validator.isValidBatchValue(3, board.getRow(0));
      expect(result).toBe(true);
    });

    test('rejects duplicate value', () => {
      board.setCellValue({ x: 0, y: 0 }, 5);
      board.setCellValue({ x: 1, y: 0 }, 5);
      const result = validator.isValidBatchValue(5, board.getRow(0));
      expect(result).toBe(false);
    });
  });
});
