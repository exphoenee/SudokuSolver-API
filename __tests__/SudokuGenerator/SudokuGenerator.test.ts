import { describe, test, expect, beforeEach } from '@jest/globals';
import SudokuBoard from '../../dist/core/SudokuBoard/SudokuBoard.js';
import SudokuGenerator from '../../dist/generator/SudokuGenerator.js';
import type { GenerationResult } from '../../dist/types.js';

describe('SudokuGenerator', () => {
  let board: SudokuBoard;
  let generator: SudokuGenerator;

  beforeEach(() => {
    board = new SudokuBoard(3, 3);
    generator = new SudokuGenerator({ sudokuboard: board });
  });

  describe('Generation', () => {
    test('generates easy puzzle', () => {
      const result = generator.generatePuzzle({ level: 'easy' });
      expect(result).toHaveProperty('puzzle');
      expect(result).toHaveProperty('solution');
    });

    test('generates medium puzzle', () => {
      const result = generator.generatePuzzle({ level: 'medium' });
      expect(result).toHaveProperty('puzzle');
    });

    test('generates hard puzzle', () => {
      const result = generator.generatePuzzle({ level: 'hard' });
      expect(result).toHaveProperty('puzzle');
    });

    test('generates evil puzzle', () => {
      const result = generator.generatePuzzle({ level: 'evil' });
      expect(result).toHaveProperty('puzzle');
    });
  });

  describe('Random Cell Selection', () => {
    test('gets a random free cell', () => {
      const cell = generator.getRandomFreeCell();
      expect(cell).toBeDefined();
      expect(cell.value).toBe(0);
    });

    test('returned cell has required properties', () => {
      const cell = generator.getRandomFreeCell();
      expect(cell).toHaveProperty('x');
      expect(cell).toHaveProperty('y');
      expect(cell).toHaveProperty('value');
    });
  });

  describe('Puzzle Properties', () => {
    test('generated puzzle is valid string', () => {
      const result = generator.generatePuzzle({ level: 'easy' }) as GenerationResult;
      expect(typeof result.puzzle).toBe('string');
    });

    test('generated solution is string format', () => {
      const result = generator.generatePuzzle({ level: 'easy' }) as GenerationResult;
      expect(typeof result.solution).toBe('string');
      expect(result.solution.split(',').length).toBe(81);
    });

    test('has generation metadata', () => {
      const result = generator.generatePuzzle({ level: 'easy' }) as GenerationResult;
      expect(result).toHaveProperty('generationTime');
      expect(result).toHaveProperty('trialStep');
      expect(result).toHaveProperty('level');
    });
  });
});
