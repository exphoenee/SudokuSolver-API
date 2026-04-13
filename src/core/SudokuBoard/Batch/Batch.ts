import Cell from '../Cell/Cell.js';
import type { CellValue, ConfigOptions } from '../../../types.js';

/**
 * @fileoverview Batch - Represents a row, column, or box in a Sudoku board
 * @module core/SudokuBoard/Batch
 */

export default class Batch {
  #id: number;
  #cells: Cell[] = [];
  #validValues: CellValue[] = [];
  #unfilledValue: CellValue | undefined;
  #minValue: CellValue | undefined;
  #maxValue: CellValue | undefined;
  #cellNumber: number;

  constructor(id: number, cellNumber: number, _type: string, _options: ConfigOptions = {}) {
    this.#id = id;
    this.#cellNumber = cellNumber;
  }

  get id(): number {
    return this.#id;
  }

  addCell(cell: Cell): void {
    const accepted = cell.accepted;
    let allowed = true;

    if (this.#cells.length === 0) {
      this.#unfilledValue = accepted.unfilled;
      this.#minValue = accepted.min;
      this.#maxValue = accepted.max;
      this.#validValues = cell.validValues;
    }

    if (
      this.#unfilledValue !== accepted.unfilled &&
      this.#minValue !== accepted.min &&
      this.#maxValue !== accepted.max
    ) {
      allowed = false;
    }
    if (this.#cells.length >= this.#cellNumber) {
      allowed = false;
    }
    if (this.#cells.map(c => c.id).includes(cell.id)) {
      allowed = false;
    }
    if (this.#cells.map(c => `${c.x}-${c.y}`).includes(`${cell.x}-${cell.y}`)) {
      allowed = false;
    }
    if (allowed) {
      this.#cells.push(cell);
    }
  }

  getCellValues(): CellValue[] {
    return this.#cells.map(cell => cell.value);
  }

  getMissingNumbers(): CellValue[] {
    return this.#validValues.filter(value => !this.getCellValues().includes(value));
  }

  getFilledNumbers(): CellValue[] {
    return this.#validValues.filter(value => this.getCellValues().includes(value));
  }

  hasDuplicates(): boolean {
    return this.getDuplicateValues().length > 0;
  }

  getDuplicateValuedCells(): Cell[] {
    return this.#cells.filter(cell => this.getDuplicateValues().includes(cell.value));
  }

  getDuplicateValues(): CellValue[] {
    const min = this.#minValue ?? 1;
    const max = this.#maxValue ?? 1;
    return Array.from({ length: max - min + 1 }, (_, i) => min + i).filter(
      validNum => this.#cells.filter(cell => cell.value === validNum).length > 1
    );
  }

  getCellByValue(value: CellValue): Cell[] {
    return this.#cells.filter(cell => cell.value === value);
  }

  getCellByIndex(i: number): Cell | undefined {
    return this.#cells[i];
  }

  get cells(): Cell[] {
    return this.#cells;
  }

  findAndSetIssued(): void {
    this.getDuplicateValuedCells().forEach(cell => cell.setIssued());
  }

  getIssuedCells(): Cell[] {
    return this.#cells.filter(cell => cell.issued);
  }

  clearIssued(): void {
    this.#cells.forEach(cell => cell.unsetIssued());
  }

  get info(): unknown[] {
    return this.#cells.map(cell => cell.info);
  }
}
