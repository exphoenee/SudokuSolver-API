import { describe, test, expect, beforeEach } from '@jest/globals';
import SudokuBoard from '../../dist/core/SudokuBoard/SudokuBoard.js';

describe('Cell', () => {
  let board: SudokuBoard;

  beforeEach(() => {
    board = new SudokuBoard(3, 3);
  });

  test('has correct coordinates', () => {
    const cell = board.getCell({ x: 4, y: 4 });
    expect(cell.x).toBe(4);
    expect(cell.y).toBe(4);
  });

  test('has correct box coordinates', () => {
    const cell = board.getCell({ x: 4, y: 4 });
    expect(cell.bx).toBe(1);
    expect(cell.by).toBe(1);
  });

  test('has box id', () => {
    const cell = board.getCell({ x: 0, y: 0 });
    expect(cell.boxId).toBeDefined();
  });

  test('has valid values', () => {
    const cell = board.getCell({ x: 0, y: 0 });
    expect(cell.validValues.length).toBe(9);
    expect(cell.validValues).toContain(1);
    expect(cell.validValues).toContain(9);
  });

  test('starts unfilled', () => {
    const cell = board.getCell({ x: 0, y: 0 });
    expect(cell.value).toBe(0);
    expect(cell.isUnfilled()).toBe(true);
    expect(cell.isFilled()).toBe(false);
  });

  test('can be filled', () => {
    const cell = board.getCell({ x: 0, y: 0 });
    board.setCellValue({ x: 0, y: 0 }, 5);
    expect(cell.value).toBe(5);
    expect(cell.isFilled()).toBe(true);
    expect(cell.isUnfilled()).toBe(false);
  });

  test('validates value in range', () => {
    const cell = board.getCell({ x: 0, y: 0 });
    expect(cell.validateValue(1)).toBe(true);
    expect(cell.validateValue(9)).toBe(true);
    expect(cell.validateValue(0)).toBe(true);
  });

  test('validates value out of range', () => {
    const cell = board.getCell({ x: 0, y: 0 });
    expect(cell.validateValue(10)).toBe(false);
    expect(cell.validateValue(-1)).toBe(false);
  });

  test('has accepted values range', () => {
    const cell = board.getCell({ x: 0, y: 0 });
    expect(cell.accepted.min).toBe(1);
    expect(cell.accepted.max).toBe(9);
  });

  test('can set and unset given', () => {
    const cell = board.getCell({ x: 0, y: 0 });
    expect(cell.given).toBe(false);
    cell.setGiven();
    expect(cell.given).toBe(true);
    cell.unsetGiven();
    expect(cell.given).toBe(false);
  });

  test('can set and unset issued', () => {
    const cell = board.getCell({ x: 0, y: 0 });
    expect(cell.issued).toBe(false);
    cell.setIssued();
    expect(cell.issued).toBe(true);
    cell.unsetIssued();
    expect(cell.issued).toBe(false);
  });

  test('has info property', () => {
    const cell = board.getCell({ x: 0, y: 0 });
    const info = cell.info;
    expect(info.x).toBe(0);
    expect(info.y).toBe(0);
    expect(info.value).toBe(0);
    expect(info.id).toBeDefined();
  });

  test('can update possibilities', () => {
    const cell = board.getCell({ x: 0, y: 0 });
    cell.setPossibilities([1, 2, 3]);
    expect(cell.possibilities).toEqual([1, 2, 3]);
  });

  test('can manage reference', () => {
    const cell = board.getCell({ x: 0, y: 0 });
    const ref = { test: 'data' };
    cell.addRef(ref);
    expect(cell.ref).toEqual(ref);
  });
});
