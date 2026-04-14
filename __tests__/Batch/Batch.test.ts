import { describe, test, expect, beforeEach } from '@jest/globals';
import SudokuBoard from '../../dist/core/SudokuBoard/SudokuBoard.js';

describe('Batch', () => {
  let board: SudokuBoard;

  beforeEach(() => {
    board = new SudokuBoard(3, 3);
  });

  test('gets row values', () => {
    board.setCellValue({ x: 0, y: 0 }, 1);
    board.setCellValue({ x: 1, y: 0 }, 2);
    const row = board.getRow(0);
    expect(row.getCellValues()).toEqual([1, 2, 0, 0, 0, 0, 0, 0, 0]);
  });

  test('gets column values', () => {
    board.setCellValue({ x: 0, y: 0 }, 1);
    board.setCellValue({ x: 0, y: 1 }, 2);
    const col = board.getCol(0);
    expect(col.getCellValues()).toEqual([1, 2, 0, 0, 0, 0, 0, 0, 0]);
  });

  test('gets box values', () => {
    board.setCellValue({ x: 0, y: 0 }, 1);
    board.setCellValue({ x: 1, y: 1 }, 2);
    const box = board.getBox(0);
    expect(box.getCellValues().length).toBe(9);
  });

  test('detects duplicates in row', () => {
    board.setCellValue({ x: 0, y: 0 }, 5);
    board.setCellValue({ x: 1, y: 0 }, 5);
    const row = board.getRow(0);
    expect(row.hasDuplicates()).toBe(true);
  });

  test('no duplicates when unique', () => {
    board.setCellValue({ x: 0, y: 0 }, 1);
    board.setCellValue({ x: 1, y: 0 }, 2);
    const row = board.getRow(0);
    expect(row.hasDuplicates()).toBe(false);
  });

  test('gets missing numbers', () => {
    board.setCellValue({ x: 0, y: 0 }, 1);
    board.setCellValue({ x: 1, y: 0 }, 2);
    const row = board.getRow(0);
    const missing = row.getMissingNumbers();
    expect(missing).toContain(3);
    expect(missing).not.toContain(1);
    expect(missing).not.toContain(2);
  });

  test('gets filled numbers', () => {
    board.setCellValue({ x: 0, y: 0 }, 1);
    board.setCellValue({ x: 1, y: 0 }, 2);
    const row = board.getRow(0);
    const filled = row.getFilledNumbers();
    expect(filled).toContain(1);
    expect(filled).toContain(2);
  });

  test('gets duplicate valued cells', () => {
    board.setCellValue({ x: 0, y: 0 }, 5);
    board.setCellValue({ x: 1, y: 0 }, 5);
    const row = board.getRow(0);
    const duplicates = row.getDuplicateValuedCells();
    expect(duplicates.length).toBe(2);
  });

  test('gets cell by value', () => {
    board.setCellValue({ x: 0, y: 0 }, 5);
    const row = board.getRow(0);
    const cells = row.getCellByValue(5);
    expect(cells.length).toBe(1);
    expect(cells[0].value).toBe(5);
  });

  test('gets cell by index', () => {
    const row = board.getRow(0);
    const cell = row.getCellByIndex(0);
    expect(cell).toBeDefined();
  });

  test('finds and sets issued for duplicates', () => {
    board.setCellValue({ x: 0, y: 0 }, 5);
    board.setCellValue({ x: 1, y: 0 }, 5);
    const row = board.getRow(0);
    row.findAndSetIssued();
    const issued = row.getIssuedCells();
    expect(issued.length).toBe(2);
  });

  test('clears issued', () => {
    board.setCellValue({ x: 0, y: 0 }, 5);
    board.setCellValue({ x: 1, y: 0 }, 5);
    const row = board.getRow(0);
    row.findAndSetIssued();
    row.clearIssued();
    const issued = row.getIssuedCells();
    expect(issued.length).toBe(0);
  });

  test('has info property', () => {
    const row = board.getRow(0);
    const info = row.info;
    expect(info.length).toBe(9);
  });
});
