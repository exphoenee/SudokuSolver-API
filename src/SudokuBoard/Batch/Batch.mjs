"use strict";
import Cell from "../Cell/Cell.mjs";

/* Class of the Batches, the batches in this concept a bunch of cells, thy can be rows, columns or boxes of the board, this is not matters, because every batch has the same porperties and methods
only one argument required to create a Batch, th ID of them.*/
export default class Batch {
  #id;
  #cells = [];
  #validValues = [];
  #unfilledValue;
  #minValue;
  #maxValue;
  #cellNumber;

  constructor(id, cellNumber) {
    this.#id = id;
    this.#cellNumber = cellNumber;
  }

  get id() {
    return this.#id;
  }

  /* adds a cell into the batch if there is no cell in the batch according to the first cell's acepted property is the valid values array and unfilled value added to the batch
  arg:    Cell (Object)
  return: void (undefined) */
  addCell(cell) {
    const accepted = cell.accepted;
    let allowed = true;

    if (this.#cells.length == 0) {
      this.#unfilledValue = accepted.unfilled;
      this.#minValue = accepted.min;
      this.#maxValue = accepted.max;

      this.#validValues = Array.from(
        { length: accepted.max },
        (_, i) => i + accepted.min
      );
    }

    if (
      this.#unfilledValue !== accepted.unfilled &&
      this.#minValue !== accepted.min &&
      this.#maxValue !== accepted.max
    ) {
      allowed = false;
      console.error(
        "The current cell that would be added has not the same value acceptance as the cells that are already in the batch."
      );
    }
    if (this.#cells.length >= this.#cellNumber) {
      allowed = false;
      console.error(
        `There is more cells in this batch (${
          this.#cells.length
        }) then allowed (${this.#cellNumber}).`
      );
    }
    if (this.#cells.map((addedCell) => addedCell.id).includes(cell.id)) {
      allowed = false;
      console.error(
        `There is a cell in this batch already with this id: (${cell.id}). It is not allowed!`
      );
    }
    if (
      this.#cells
        .map((addedCell) => `${addedCell.x}-${addedCell.y}`)
        .includes(`${cell.x}-${cell.y}`)
    ) {
      allowed = false;
      console.error(
        `There is a cell in this batch with the same coordinates: (x=${cell.x}, y=${cell.y}). It is not allowed!`
      );
    }
    if (allowed) {
      this.#cells.push(cell);
    }
  }

  /* gives all the values of cell they ar in the batch
  arg:   null,
  return arraf of integers, that contains the values of the cells in order the cells are added */
  getCellValues() {
    return this.#cells.map((cell) => cell.value);
  }

  /* gives the missing numbers of the batch
  arg:    null
  return: array of integers that are the possible values what missing from the Batch  */
  getMissingNumbers() {
    return this.#validValues.filter(
      (value) => !this.getCellValues().includes(value)
    );
  }

  /* gives already written of the batch
  arg:    rowNr (Integer)
  return: array of integers that are alerady in the Batch written */
  getFilledNumbers() {
    return this.#validValues.filter((value) =>
      this.getCellValues().includes(value)
    );
  }

  /* checks that the batch has alread a duplicates */
  hasDuplicates() {
    return this.getDuplicateValues().length > 0;
  }

  /* gives the cells, where is the same value written
  arg:    null,
  return: array of cells (object) with the same values */
  getDuplicateValuedCells() {
    return this.#cells.filter((cell) =>
      this.getDuplicateValues().includes(cell.value)
    );
  }

  /* gives the values, what is the duplicated in the batch
  arg:    null,
  return: array of (integers)  */
  getDuplicateValues() {
    return Array.from(
      { length: this.#maxValue - this.#minValue + 1 },
      (_, i) => i + 1
    ).filter(
      (validNum) =>
        this.#cells.filter((cell) => cell.value === validNum).length > 1
    );
  }

  /* gives all the cells with the given value
  arg:    value (integer),
  return: array of Cells (object) */
  getCellByValue(value) {
    return this.#cells.filter((cell) => cell.value === value);
  }

  /* gives a cell according to the given index
  arg:    i (integer) the index of the cell
  return: Cell (Object) */
  getCellByIndex(i) {
    return this.#cells[i] || [];
  }

  /* gives all the cells they are in the batch
  arg:    null
  return: array of Cell (Object) */
  get cells() {
    return this.#cells;
  }

  /* sets the duplicate valued cells to issued
  arg:    null,
  return: null. */
  findAndSetIssued() {
    this.getDuplicateValuedCells().forEach((cell) => cell.setIssued());
  }

  /* gives the issued cells in an array
  arg:    null,
  return: array of Cells. */
  getIssuedCells() {
    return this.#cells.filter((cell) => cell.issued);
  }

  /* removing the issued tag form the all the cells of the batch */
  clearIssued() {
    this.#cells.forEach((cell) => cell.unsetIssued());
  }

  get info() {
    return this.#cells.map((cell) => cell.info);
  }
}
