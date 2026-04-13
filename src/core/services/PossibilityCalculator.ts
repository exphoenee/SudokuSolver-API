import Batch from '../SudokuBoard/Batch/Batch.js';
import Cell from '../SudokuBoard/Cell/Cell.js';
import type { CellSelector, CellValue } from '../../types.js';

export default class PossibilityCalculator {
  getCellPossibilities(
    cell: Cell,
    getBatchesOfCell: (params: CellSelector) => Batch[]
  ): CellValue[] {
    const batches = getBatchesOfCell({ cell });
    const [missingFromCol, missingFromRow, missingFromBox] = batches.map(batch =>
      batch.getMissingNumbers()
    );

    const intersection = (arr1: CellValue[], arr2: CellValue[]): CellValue[] =>
      arr1.filter(value => arr2.includes(value));

    return intersection(intersection(missingFromCol, missingFromRow), missingFromBox);
  }

  updatePossibilityMap(
    cells: Cell[],
    getCellPossibilities: (params: CellSelector) => CellValue[]
  ): void {
    cells.forEach(cell => cell.setPossibilities(getCellPossibilities(cell)));
  }

  getPossibilityMatrix(
    cells: Cell[],
    getCellPossibilities: (params: CellSelector) => CellValue[]
  ): CellValue[][] {
    return cells.map(cell => getCellPossibilities(cell));
  }

  getFreeCellWithLeastPossibilities(
    cells: Cell[],
    getCellPossibilities: (params: CellSelector) => CellValue[]
  ): Cell | false {
    const freeCells = cells.filter(cell => cell.value === 0);

    if (freeCells.length === 0) return false;

    const sorted = freeCells
      .map(cell => ({ cell, possibilities: getCellPossibilities(cell) }))
      .sort((a, b) => a.possibilities.length - b.possibilities.length);

    const freeCell = sorted[0]?.cell;
    return freeCell && getCellPossibilities(freeCell).length > 0 ? freeCell : false;
  }

  getFilledNumbers(batch: Batch): CellValue[] {
    return batch.getFilledNumbers();
  }

  getMissingNumbers(batch: Batch): CellValue[] {
    return batch.getMissingNumbers();
  }
}
