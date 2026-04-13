'use strict';
import Cell from './Cell/Cell.mjs';
import Batch from './Batch/Batch.mjs';

/**
 * @fileoverview SudokuBoard - Core class for managing a Sudoku board
 * @module core/SudokuBoard
 */

/**
 * Represents a Sudoku board with cells organized in rows, columns, and boxes.
 * @class
 */
export default class SudokuBoard {
  #boxSizeX;
  #boxSizeY;
  #dimensionX;
  #dimensionY;
  #cellNumber;
  #boxSize;
  #cells;
  #rows;
  #cols;
  #boxes;
  #separator;
  #warnings;
  #errors;

  /**
   * Creates a new SudokuBoard instance.
   * @param {number} boxSizeX - Horizontal size of a box
   * @param {number} boxSizeY - Vertical size of a box
   * @param {number[][]|number[]|string} [puzzle] - Initial puzzle state
   * @param {{warnings?: boolean, errors?: boolean}} [options]
   */
  constructor(boxSizeX, boxSizeY, puzzle = null, { warnings = false, errors = false } = {}) {
    this.#boxSizeX = boxSizeX;
    this.#boxSizeY = boxSizeY;
    this.#dimensionX = boxSizeX ** 2;
    this.#dimensionY = boxSizeY ** 2;
    this.#cellNumber = this.#dimensionX * this.#dimensionY;
    this.#boxSize = this.#boxSizeX * this.#boxSizeY;
    this.#separator = ',';
    this.#cells = [];
    this.#rows = [];
    this.#cols = [];
    this.#boxes = [];
    this.#warnings = warnings;
    this.#errors = errors;

    this.#generateBoard();

    if (this.#boardFormat(puzzle)[0] !== 'err') {
      this.setBoard(puzzle, true);
    }

    return this;
  }

  /**
   * Organizes cells into rows, columns, and boxes.
   * @private
   */
  #generateBoard() {
    this.#createCells();
    this.#createRows();
    this.#createCols();
    this.#createBoxes();
  }

  /**
   * Returns the board dimensions and box size.
   * @returns {{x: number, y: number, boxSizeX: number, boxSizeY: number}}
   */
  get boardSize() {
    return {
      x: this.#dimensionX,
      y: this.#dimensionY,
      boxSizeX: this.#boxSizeX,
      boxSizeY: this.#boxSizeY,
    };
  }

  /**
   * Creates all cells for the board.
   * @private
   */
  #createCells() {
    if (this.#cells.length <= this.#cellNumber) {
      for (let y = 0; y < this.#dimensionY; y++) {
        for (let x = 0; x < this.#dimensionX; x++) {
          const bx = Math.floor(x / this.#boxSizeX);
          const by = Math.floor(y / this.#boxSizeY);
          const cell = new Cell({
            id: y * this.#dimensionX + x,
            x,
            y,
            boxId: this.#boxSizeX * by + bx,
            bx,
            by,
            accepted: {
              unfilled: 0,
              min: 1,
              max: this.#boxSize,
            },
            given: false,
            issued: false,
          });

          this.#cells.push(cell);
        }
      }
    } else {
      this.#errors && console.error(`Cannot create more than ${this.#cellNumber} cells`);
    }
  }

  /**
   * Returns all cells in the board.
   * @returns {Cell[]}
   */
  get cells() {
    return this.#cells;
  }

  /**
   * Returns debug information for all cells.
   * @returns {Array}
   */
  get info() {
    return this.#cells.map(cell => cell.info);
  }

  /**
   * Clears the issued state from all cells.
   */
  clearIssued() {
    this.#cells.forEach(cell => cell.unsetIssued());
  }

  /**
   * Filters cells by batch ID into Batch objects.
   * @private
   * @param {number} numberOfBatches - Number of batches to create
   * @param {number} cellsInBatch - Number of cells per batch
   * @param {string} id - Cell property to group by
   * @returns {Batch[]}
   */
  #filterSameBatchID(numberOfBatches, cellsInBatch, id) {
    const collector = [];
    for (let i = 0; i < numberOfBatches; i++) {
      const batch = new Batch(i, cellsInBatch, id);
      this.#cells.filter(cell => cell[id] == i).forEach(cell => batch.addCell(cell));
      collector.push(batch);
    }
    return collector;
  }

  /**
   * Creates column batches.
   * @private
   */
  #createCols() {
    this.#cols = this.#filterSameBatchID(this.#dimensionX, this.#dimensionY, 'x');
  }

  /**
   * Creates row batches.
   * @private
   */
  #createRows() {
    this.#rows = this.#filterSameBatchID(this.#dimensionY, this.#dimensionX, 'y');
  }

  /**
   * Creates box batches.
   * @private
   */
  #createBoxes() {
    this.#boxes = this.#filterSameBatchID(this.#boxSize, this.#boxSize, 'boxId');
  }

  /**
   * Returns a column by index.
   * @param {number} colNr - Column index
   * @returns {Batch}
   */
  getCol(colNr) {
    return this.#cols[colNr];
  }

  /**
   * Returns a row by index.
   * @param {number} rowNr - Row index
   * @returns {Batch}
   */
  getRow(rowNr) {
    return this.#rows[rowNr];
  }

  /**
   * Returns all columns.
   * @returns {Batch[]}
   */
  getAllCols() {
    return this.#cols;
  }

  /**
   * Returns all boxes.
   * @returns {Batch[]}
   */
  getAllBoxes() {
    return this.#boxes;
  }

  /**
   * Returns all rows.
   * @returns {Batch[]}
   */
  getAllRows() {
    return this.#rows;
  }

  /**
   * Returns a box by index.
   * @param {number} boxNr - Box index
   * @returns {Batch}
   */
  getBox(boxNr) {
    return this.#boxes[boxNr];
  }

  /**
   * Extracts cell values from a batch.
   * @private
   * @param {Batch} batch
   * @returns {number[]}
   */
  #filterValuesFromBatch(batch) {
    return batch.cells.map(cell => cell.value);
  }

  /**
   * Returns values of a row.
   * @param {number} rowNr - Row index
   * @returns {number[]}
   */
  getRowValues(rowNr) {
    return this.#filterValuesFromBatch(this.getRow(rowNr));
  }

  /**
   * Returns values of a column.
   * @param {number} colNr - Column index
   * @returns {number[]}
   */
  getColValues(colNr) {
    return this.#filterValuesFromBatch(this.getCol(colNr));
  }

  /**
   * Returns values of a box.
   * @param {number} boxNr - Box index
   * @returns {number[]}
   */
  getBoxValues(boxNr) {
    return this.#filterValuesFromBatch(this.getBox(boxNr));
  }

  /**
   * Returns filled numbers from a batch.
   * @param {Batch} batch
   * @returns {number[]}
   */
  getFilledFromBatch(batch) {
    return batch.getFilledNumbers();
  }

  /**
   * Returns missing numbers from a batch.
   * @param {Batch} batch
   * @returns {number[]}
   */
  getMissingFromBatch(batch) {
    return batch.getMissingNumbers();
  }

  /**
   * Returns the batches (column, row, box) containing a cell.
   * @param {{x?: number, y?: number, cell?: Cell, id?: number}} params
   * @returns {Batch[]}
   */
  getBatchesOfCell({ x, y, cell, id }) {
    const selectedCell = this.getCell({ x, y, cell, id });
    return [
      this.getCol(selectedCell.x),
      this.getRow(selectedCell.y),
      this.getBox(selectedCell.boxId),
    ];
  }

  /**
   * Returns possible values for a cell based on row, column, and box constraints.
   * @param {{x?: number, y?: number, cell?: Cell, id?: number}} params
   * @returns {number[]}
   */
  getCellPossibilities({ x, y, cell, id }) {
    const selectedCell = this.getCell({ x, y, cell, id });

    const [missingFromCol, missingFromRow, missingFromBox] = this.getBatchesOfCell({
      cell: selectedCell,
    }).map(batch => batch.getMissingNumbers());

    const intersection = (arr1, arr2) => arr1.filter(value => arr2.includes(value));

    return intersection(intersection(missingFromCol, missingFromRow), missingFromBox);
  }

  /**
   * Checks if a batch has duplicate values.
   * @param {Batch} batch
   * @returns {boolean}
   */
  hasBatchDuplicates(batch) {
    return batch.hasDuplicates();
  }

  /**
   * Checks if a cell has duplicates in its row, column, or box.
   * @param {{x?: number, y?: number, cell?: Cell, id?: number}} params
   * @returns {boolean}
   */
  hasCellDuplicates({ x, y, cell, id }) {
    const selectedCell = this.getCell({ x, y, cell, id });
    return this.getBatchesOfCell({ selectedCell })
      .map(batch => batch.hasDuplicates())
      .every(dups => dups === true);
  }

  /**
   * Marks cells with duplicate values as issued.
   * @private
   * @param {{x?: number, y?: number, cell?: Cell, id?: number}} params
   */
  #markCellIssue({ x, y, cell, id }) {
    const selectedCell = this.getCell({ x, y, cell, id });
    this.getBatchesOfCell({ x, y, selectedCell }).forEach(batch => {
      batch.cells.forEach(batchCell => batchCell.unsetIssued());
      batch.getDuplicateValuedCells().forEach(issuedCell => {
        this.#warnings &&
          console.warn(
            `Cell with id ${selectedCell.id} at (${selectedCell.x}, ${selectedCell.y}) ` +
              `in box ${selectedCell.boxId} with value ${selectedCell.value} creates a duplicate!`
          );
        issuedCell.setIssued();
      });
    });
  }

  /**
   * Returns all cells marked as issued (duplicates).
   * @returns {Cell[]}
   */
  getIssuedCells() {
    return [
      ...new Set(
        [...this.#rows, ...this.#cols, ...this.#boxes]
          .map(batch => batch.getDuplicateValuedCells())
          .flat()
      ),
    ];
  }

  /**
   * Updates possibilities for all cells in the same batches as the given cell.
   * @private
   * @param {{x?: number, y?: number, cell?: Cell, id?: number}} params
   */
  #updateCellPossibilities({ cell, x, y, id }) {
    const selectedCell = this.getCell({ x, y, cell, id });

    this.getBatchesOfCell({
      x,
      y,
      selectedCell,
    }).forEach(batch =>
      batch.cells.forEach(batchCell => {
        const possibilities = this.getCellPossibilities(batchCell);
        if (possibilities.length > 0) {
          batchCell.setPossibilities(possibilities);
        } else {
          this.#warnings &&
            console.warn(
              `Cell with id ${selectedCell.id} at (${selectedCell.x}, ${selectedCell.y}) ` +
                `in box ${selectedCell.boxId} has no valid possibilities!`
            );
        }
      })
    );
  }

  /**
   * Checks if the puzzle has any duplicates in rows, columns, or boxes.
   * @returns {boolean}
   */
  puzzleIsCorrect() {
    for (let batch of [...this.#rows, ...this.#cols, ...this.#boxes])
      if (batch.hasDuplicates()) return false;
    for (let cell of this.cells) if (cell.possibilities.length === 0) return false;
    return true;
  }

  /**
   * Returns the first empty cell.
   * @returns {Cell|false}
   */
  getFirstFreeCell() {
    const freeCell = this.#cells.find(cell => cell.value == 0);
    if (freeCell) return freeCell;
    return false;
  }

  /**
   * Returns all cells with a specific value.
   * @param {number} value
   * @returns {Cell[]}
   */
  getCellsByValue(value) {
    return this.cells.filter(cell => cell.value === value);
  }

  /**
   * Updates the possibility map for all cells.
   */
  updatePossibilityMap() {
    this.cells.forEach(cell => cell.setPossibilities(this.getCellPossibilities(cell)));
  }

  /**
   * Returns a matrix of possibilities for all cells.
   * @returns {number[][]}
   */
  getPossibilityMatrix() {
    return this.cells.map(cell => this.getCellPossibilities(cell));
  }

  /**
   * Returns the empty cell with the fewest possibilities.
   * @returns {Cell|false}
   */
  getFreeCellWithLeastPossibilities() {
    const freeCell = this.#cells
      .filter(cell => cell.value == 0)
      .map(cell => {
        const possibilities = this.getCellPossibilities(cell);
        return { cell, possibilities };
      })
      .sort((a, b) => a.possibilities.length - b.possibilities.length)[0].cell;

    if (freeCell && this.getCellPossibilities(freeCell).length > 0) return freeCell;
    return false;
  }

  /**
   * Returns coordinates of the first empty cell.
   * @returns {{x: number, y: number}|false}
   */
  coordsOfFirstFreeCell() {
    const freeCell = this.getFirstFreeCell();
    if (freeCell) return { x: freeCell.x, y: freeCell.y };
    return false;
  }

  /**
   * Validates if coordinates are within board bounds.
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  validateCoord(x, y) {
    if (0 <= x && x <= this.#dimensionX - 1 && 0 <= y && y <= this.#dimensionY - 1) {
      return true;
    } else {
      this.#errors &&
        console.error(
          `Coordinates must be x in [0, ${this.#dimensionX - 1}] and y in [0, ${this.#dimensionY - 1}]. Got (${x}, ${y})`
        );
    }
  }

  /**
   * Detects the format of the input board.
   * @private
   * @param {number[][]|number[]|string} board
   * @returns {[string, string?]}
   */
  #boardFormat(board) {
    return Array.isArray(board)
      ? board.length === this.#dimensionY
        ? board.every(row => row.length === this.#dimensionX && Array.isArray(row))
          ? ['2D']
          : ['err', `2D array must be ${this.#dimensionY}x${this.#dimensionX}`]
        : board.length === this.#cellNumber
          ? ['1D']
          : ['err', `1D array must have exactly ${this.#cellNumber} elements`]
      : typeof board === 'string'
        ? board.split(this.#separator).length === this.#cellNumber
          ? ['string']
          : ['err', `String must have exactly ${this.#cellNumber} comma-separated values`]
        : ['err', 'Invalid board format'];
  }

  /**
   * Sets the board state from various input formats.
   * @param {number[][]|number[]|string} board
   * @param {boolean} [setGiven=false] - Mark filled cells as given
   */
  setBoard(board, setGiven = false) {
    const [format, msg] = this.#boardFormat(board);

    const convert1Dto2D = board => {
      const mBoard = [...board];
      const board2D = [];
      while (mBoard.length) board2D.push(mBoard.splice(0, this.#dimensionX));
      return board2D;
    };

    const convertStrTo1D = board => {
      return convert1Dto2D(board.split(',').map(cell => +cell));
    };

    let convertedBoard;
    format === '2D' && (convertedBoard = board);
    format === '1D' && (convertedBoard = convert1Dto2D(board));
    format === 'string' && (convertedBoard = convertStrTo1D(board));

    if (convertedBoard) {
      convertedBoard.forEach((row, y) =>
        row.forEach((cellValue, x) => {
          const selectedCell = this.getCell({ x, y });
          selectedCell.setValue(cellValue);
          if (setGiven)
            selectedCell.isFilled() ? selectedCell.setGiven() : selectedCell.unsetGiven();
        })
      );
      this.#setAllIssuedCells();
    } else {
      this.#errors && console.error(msg);
    }
  }

  /**
   * Clears all cell values.
   */
  clearBoard() {
    this.#cells.forEach(cell => cell.setValue(0));
  }

  /**
   * Returns all cell values in various formats.
   * @param {{format?: string, unfilledChar?: string}} [options]
   * @returns {number[][]|number[]|string}
   */
  getCellValues({ format = '2D', unfilledChar = '0' } = {}) {
    let res = this.#cells.map(cell => cell.value);

    if (format.toUpperCase() === 'STRING') {
      return res.join(',').replace(/0/g, unfilledChar || 0);
    } else if (format.toUpperCase() === '2D') {
      const board2D = [];
      while (res.length) board2D.push(res.splice(0, this.#dimensionX));
      return board2D;
    } else if (format.toUpperCase() === '1D') {
      return res;
    } else return false;
  }

  /**
   * Retrieves a cell by coordinates, cell reference, or ID.
   * @param {{x?: number, y?: number, cell?: Cell, id?: number}} params
   * @returns {Cell|undefined}
   */
  getCell({ x, y, cell, id }) {
    let selectedCell;
    if (cell instanceof Cell) {
      selectedCell = cell;
    } else if (x !== undefined && y !== undefined) {
      selectedCell = this.#cells.find(
        cell => this.validateCoord(x, y) && cell.x === x && cell.y === y
      );
    } else if (id !== undefined) {
      selectedCell = this.#cells.find(cell => cell.id === id);
    } else {
      this.#errors &&
        console.error(
          `Must provide x,y coordinates, a Cell object, or an id. Got x=${x}, y=${y}, cell=${cell}, id=${id}`
        );
    }
    return selectedCell;
  }

  /**
   * Sets the value of a cell.
   * @param {{x?: number, y?: number, cell?: Cell, id?: number}} params
   * @param {number} value
   */
  setCellValue({ x, y, cell, id }, value) {
    const selectedCell = this.getCell({ x, y, cell, id });
    if (selectedCell) {
      selectedCell.setValue(value);

      this.#markCellIssue(selectedCell);
      this.#updateCellPossibilities(selectedCell);
    }
  }

  /**
   * Updates issued status for all cells.
   * @private
   */
  #setAllIssuedCells() {
    this.clearIssued();
    this.getIssuedCells().forEach(issuedCell => issuedCell.setIssued());
  }
}
