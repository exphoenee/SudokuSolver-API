import Batch from '../SudokuBoard/Batch/Batch.js';
import Cell from '../SudokuBoard/Cell/Cell.js';
import type { CellSelector } from '../../types.js';

export default class BoardValidator {
  #dimensionX: number;
  #dimensionY: number;

  constructor(dimensionX: number, dimensionY: number) {
    this.#dimensionX = dimensionX;
    this.#dimensionY = dimensionY;
  }

  validateCoord(x: number, y: number): boolean {
    return 0 <= x && x <= this.#dimensionX - 1 && 0 <= y && y <= this.#dimensionY - 1;
  }

  hasBatchDuplicates(batch: Batch): boolean {
    return batch.hasDuplicates();
  }

  hasRowDuplicates(row: Batch): boolean {
    return row.hasDuplicates();
  }

  hasColDuplicates(col: Batch): boolean {
    return col.hasDuplicates();
  }

  hasBoxDuplicates(box: Batch): boolean {
    return box.hasDuplicates();
  }

  hasCellDuplicates(
    getBatchesOfCell: (params: CellSelector) => Batch[],
    params: CellSelector,
    getCell: (params: CellSelector) => Cell
  ): boolean {
    const cell = getCell(params);
    return getBatchesOfCell({ cell }).every(batch => batch.hasDuplicates());
  }

  puzzleIsCorrect(rows: Batch[], cols: Batch[], boxes: Batch[], cells: Cell[]): boolean {
    for (const batch of [...rows, ...cols, ...boxes]) {
      if (batch.hasDuplicates()) return false;
    }
    for (const cell of cells) {
      if (cell.possibilities.length === 0) return false;
    }
    return true;
  }

  isValidBatchValue(value: number, batch: Batch): boolean {
    const values = batch.cells.map((c: Cell) => c.value);
    const count = values.filter((v: number) => v === value).length;
    return count <= 1;
  }

  areCoordsValid(x: number, y: number): boolean {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x >= 0 &&
      x < this.#dimensionX &&
      y >= 0 &&
      y < this.#dimensionY
    );
  }
}
