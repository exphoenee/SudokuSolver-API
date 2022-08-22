"use strict";
import Cell from "./Cell/Cell.mjs";
import Batch from "./Batch/Batch.mjs";

/* this the class of the sudoku board
  the constructor only gets 2 argument, the x and y size of a box in the board
  therefrom is calculated everything
  this class is only responsible for tha handling, oranazing, setting and getting the status of the cells contained the board.*/
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

  constructor(boxSizeX, boxSizeY, puzzle = null) {
    this.#boxSizeX = boxSizeX;
    this.#boxSizeY = boxSizeY;
    this.#dimensionX = boxSizeX ** 2;
    this.#dimensionY = boxSizeY ** 2;
    this.#cellNumber = this.#dimensionX * this.#dimensionY;
    this.#boxSize = this.#boxSizeX * this.#boxSizeY;
    this.#separator = ",";
    this.#cells = [];
    this.#rows = [];
    this.#cols = [];
    this.#boxes = [];

    this.generateBoard();

    if (this.#boardFormat(puzzle)[0] !== "err") {
      if (this.#boardFormat(puzzle)[0] === "1D") {
      }
      this.setBoard(puzzle, true);
    }

    return this;
  }

  /* This method organizing the cells into rows, columns, and boxes.
  In this calss everything goes by references. */
  generateBoard() {
    this.createCells();
    this.createRows();
    this.createCols();
    this.createBoxes();
  }

  /* gives back the size of the board */
  get boardSize() {
    return {
      x: this.#dimensionX,
      y: this.#dimensionY,
      boxSizeX: this.#boxSizeX,
      boxSizeY: this.#boxSizeY,
    };
  }

  /* Generating all the cells what the board contains. Here is passing down to the cells every information which is beolngs to the cell:
   * x and y coordinate,
   * id of the cell,
   * boxId this is the id of the box, where the cell will placed
   * bx and by coordinate inside the box, maybe that is not neccessary,
   * accepted, what kind of values are accepted:
   ** min is the minimum value
   ** max is the maximum value
   ** unfilled value is that value what means the cell is unfilled
   * given, the cell has an initial value or not
   * issued, the cell has an issue or not */
  createCells() {
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
      console.error(
        `Something went wrong, only number of ${
          this.#cellNumber
        } cells allowed you tried to create the +1.`
      );
    }
  }

  /* gives the values of all the cells in the board
  arg:    null
  return: 1D of Cells (Object) */
  get cells() {
    return this.#cells;
  }

  /* the method returns all the data of the cells what the board including
   that used only for debugging purpose */
  get info() {
    return this.#cells.map((cell) => cell.info);
  }

  /* clearing all the issued property of the cells */
  clearIssued() {
    this.#cells.forEach((cell) => cell.unsetIssued());
  }

  /* filtering a cells of batch with same batch id
  arg:    * cellsInBatch (integer) the length of the batch
          * numberOfBatches (string) how many batch there are
          * id (string) the type of the Batch that should filtered
  return: an array of cells */
  #filterSameBatchID(numberOfBatches, cellsInBatch, id) {
    const collector = [];
    for (let i = 0; i < numberOfBatches; i++) {
      const batch = new Batch(i, cellsInBatch, id);
      this.#cells
        .filter((cell) => cell[id] == i)
        .forEach((cell) => batch.addCell(cell));
      collector.push(batch);
    }
    return collector;
  }

  /* filtering out the cells, that are in the same column, putting into a Batch, that handle the columns */
  createCols() {
    this.#cols = this.#filterSameBatchID(
      this.#dimensionX,
      this.#dimensionY,
      "x"
    );
  }

  /* filtering out the cells, that are in the same rows, putting into a Batch, that handle the rows */
  createRows() {
    this.#rows = this.#filterSameBatchID(
      this.#dimensionY,
      this.#dimensionX,
      "y"
    );
  }

  /* filtering out the cells, that are in the same boxes, putting into a Batch, that handle the boxes */
  createBoxes() {
    this.#boxes = this.#filterSameBatchID(
      this.#boxSize,
      this.#boxSize,
      "boxId"
    );
  }

  /* gives a row according to the given row number
  arg:    rowNr (Integer)
  return: Batch (Objects) */
  getRow(rowNr) {
    return this.#rows[rowNr];
  }

  /* gives all rows in a 2D array
  arg:    rowNr (Integer)
  return: 1D array of Batch (Objects) */
  getAllRows() {
    return this.#rows;
  }

  /* gives a column according to the given column number
  arg:    colNr (Integer)
  return: Batch (Objects) */
  getCol(colNr) {
    return this.#cols[colNr];
  }

  /* gives a section according to the given section number
  arg:    boxNr (Integer)
  return: Batch (Objects) */
  getBox(boxNr) {
    return this.#boxes[boxNr];
  }

  /* this method gives form the cells of the batch only the array of values back
    arg:    batch
    return: array of integers the values in the batch */
  #filterValuesFromBatch(batch) {
    return batch.cells.map((cell) => cell.value);
  }

  /* gives a row according to the given row number
  arg:    rowNr (Integer)
  return: values of the cells in the Batch (array of integers) */
  getRowValues(rowNr) {
    return this.#filterValuesFromBatch(this.getRow(rowNr));
  }

  /* gives a column according to the given column number
  arg:    colNr (Integer)
  return: values of the cells in the Batch (array of integers) */
  getColValues(colNr) {
    return this.#filterValuesFromBatch(this.getCol(colNr));
  }

  /* gives a section according to the given section number
  arg:    boxNr (Integer)
  return: values of the cells in the Batch (array of integers) */
  getBoxValues(boxNr) {
    return this.#filterValuesFromBatch(this.getBox(boxNr));
  }

  /* gives the missing numbers of a row according to the given row number
  arg:    rowNr (Integer)
  return: array of integers that are the possible values what missing from the row  */
  getMissingFromRow(rowNr) {
    return this.getRow(rowNr).getMissingNumbers();
  }

  /* gives into the row already written numbers according to the given row number
  arg:    rowNr (Integer)
  return: array of integers that are the possible values what are in the row already */
  getFilledFromRow(rowNr) {
    return this.getRow(rowNr).getFilledNumbers();
  }

  /* gives the missing numbers of a column according to the given column number
  arg:    column (Integer)
  return: array of integers that are the possible values what missing from the column  */
  getMissingFromCol(colNr) {
    return this.getCol(colNr).getMissingNumbers();
  }

  /* gives into the column already written numbers according to the given column number
  arg:    colNr (Integer)
  return: array of integers that are the possible values what are in the column already */
  getFilledFromCol(colNr) {
    return this.getCol(colNr).getFilledNumbers();
  }

  /* gives the missing numbers of a section according to the given section number
  arg:    boxNr (Integer)
  return: array of integers that are the possible values what missing from the section  */
  getMissingFromBox(boxNr) {
    return this.getBox(boxNr).getMissingNumbers();
  }

  /* gives into the section already written numbers according to the given section number
  arg:    boxNr (Integer)
  return: array of integers that are the possible values what are in the section already */
  getFilledFromBox(boxNr) {
    return this.getBox(boxNr).getFilledNumbers();
  }

  /* this method gives the numbers what can we write into a cell, the cell couldn't has a value what is represented in the column, the row and the box thath the cell is contained,
    the method is capable for get result according to x and y coordinates, or easely giving a Cell (Object) to its argument
      arg:      Object literal with following keys:
                  * x (integer),
                  * y (integer),
                  * cell (integer),
      return:   array of integer what is missing form the row, column, and box of the cell */
  getCellPossiblities({ x, y, cell }) {
    !cell && (cell = this.getCellByCoords(x, y));

    const missingFromCol = this.getMissingFromCol(cell.x);
    const missingFromRow = this.getMissingFromRow(cell.y);
    const missingFromBox = this.getMissingFromBox(cell.boxId);

    const intersection = (arr1, arr2) =>
      arr1.filter((value) => arr2.includes(value));

    return intersection(
      intersection(missingFromCol, missingFromRow),
      missingFromBox
    );
  }

  /* checking that the column has duplicates
    arg:    colNr (integers) the column number of the board
    return: true or false that means there are a duplicates for this column */
  hasColumnDuplicates(colNr) {
    return this.getCol(colNr).hasDuplicates();
  }

  /* checking that the row has duplicates
    arg:    rowNr (integers) the row number of the board
    return: true or false that means there are a duplicates for this row */
  hasRowDuplicates(rowNr) {
    return this.getRow(rowNr).hasDuplicates();
  }

  /* checking that the box has duplicates
    arg:    boxNr (integers) the box number of the board
    return: true or false that means there are a duplicates for this box */
  hasBoxDuplicates(boxNr) {
    return this.getBox(boxNr).hasDuplicates();
  }

  /* checking that the cell has duplicates its row, column or section arg:    x, y (integers) the coordinates of the cell
    return: true or false that means there are a duplicates for this cell */
  hasCellDuplicates({ x, y, cell }) {
    if (!cell) cell = this.getCellByCoords(x, y);
    return (
      this.hasColumnDuplicates(cell.y) &&
      this.hasRowDuplicates(cell.x) &&
      this.hasBoxDuplicates(cell.boxId)
    );
  }

  /* the method gives the issued cells in an array
  arg:    null,
  return: array of cells (object) */
  getIssuedCells() {
    return [
      ...new Set(
        [...this.#rows, ...this.#cols, ...this.#boxes]
          .map((batch) => batch.getDuplicateValuedCells())
          .flat()
      ),
    ];
  }

  /* the method is checking the puzzle does or not any duplicates in the rows, columns or boxes
  arg:    null,
  return: boolen the puzzle is correct true, that means there aren't any duplicates */
  puzzleIsCorrect() {
    const batches = [...this.#rows, ...this.#cols, ...this.#boxes];
    for (let batch of batches) {
      if (batch.hasDuplicates()) return false;
    }
    return true;
  }

  /* gives the first free cell
    arg:    null
    return: Cell (Object) */
  getFirstFeeCell() {
    const freeCell = this.#cells.find((cell) => cell.value == 0);
    if (freeCell) return freeCell;
    return false;
  }

  /* gives the coords of the first free cell
    arg:    null
    return: Object {x, y} the two coorinate of the cell */
  coordsOfFirstFreeCell() {
    const freeCell = this.getFirstFeeCell();
    if (freeCell) return { x: freeCell.x, y: freeCell.y };
    return false;
  }

  /* Validating the coordinate, the coord must be in range between 0 and dimension.
    args:   x, y integers the coords what we would like to validate
    return: true is the coords are in range */
  validateCoord(x, y) {
    return (
      0 <= x && x <= this.#dimensionX - 1 && 0 <= y && y <= this.#dimensionY - 1
    );
  }

  /* gives a cells by the given coordinates
  arg:    x (integer) and y (integer) coordinates
  return: Cell (Object) */
  getCellByCoords(x, y) {
    if (this.validateCoord(x, y)) {
      return this.#cells.find((cell) => cell.x == x && cell.y == y);
    } else {
      console.error(
        `The x coordinate value must be between 1...${
          this.#dimensionX
        }, the y must be between 1...${
          this.#dimensionY
        }. You asked x: ${x} and y: ${y}.`
      );
    }
  }

  /* the method check the incoming format of the board what will be set
  arg:    board it acn be 2D array, 1D array or a string
  return: array, where the frist element is the type of the incoming argument, the second is the message in case of error */
  #boardFormat(board) {
    return Array.isArray(board)
      ? board.length === this.#dimensionY
        ? board.every(
            (row) => row.length === this.#dimensionX && Array.isArray(row)
          )
          ? ["2D"]
          : [
              "err",
              `Input array of the setBoard method in case 2D array ${
                this.#dimensionY
              } times ${this.#dimensionX} sized.`,
            ]
        : board.length === this.#cellNumber
        ? ["1D"]
        : [
            "err",
            `Input array of the setBoard method in case of 1D array must be exactly ${
              this.#cellNumber
            } element.`,
          ]
      : typeof board === "string"
      ? board.split(this.#separator).length === this.#cellNumber
        ? ["string"]
        : [
            "err",
            `Input of the setBoard method must be exactly ${
              this.#cellNumber
            } character long string this string is ${board.length}.`,
          ]
      : ["err", `The board format is invalid!`];
  }

  /* setBoard method sets all the cells of the table according to the given arguments.
  arg:    board can be 1D array, 2D array or a string.
  return: void */
  setBoard(board, setGiven = false) {
    const [format, msg] = this.#boardFormat(board);

    const conver1Dto2D = (board) => {
      const mBoard = [...board];
      const board2D = [];
      while (mBoard.length) board2D.push(mBoard.splice(0, this.#dimensionX));
      return board2D;
    };

    const ConvertStrTo1D = (board) => {
      return conver1Dto2D(board.split(",").map((cell) => +cell));
    };

    let convertedBoard;
    format === "2D" && (convertedBoard = board);
    format === "1D" && (convertedBoard = conver1Dto2D(board));
    format === "string" && (convertedBoard = ConvertStrTo1D(board));

    if (convertedBoard) {
      convertedBoard.forEach((row, y) =>
        row.forEach((cellValue, x) => {
          const cell = this.getCellByCoords(x, y);
          cell.setValue(cellValue);
          if (setGiven) cell.isFilled() ? cell.setGiven() : cell.unsetGiven();
        })
      );
      this.#setAllIssuedCells();
    } else {
      console.error(msg);
    }
  }

  /* the method is setting all the values of cells of to 0
  arg:    null,
  return: undefined */
  clearBoard() {
    this.#cells.forEach((cell) => cell.setValue(0));
  }

  /* gives the values of all the cells in the board
  arg:    null
  return: 1D of Cells (Object) */
  get cells() {
    return this.#cells;
  }

  /* gives the values of all the cells in the board
  arg:    object with following keys:
          ** type: (string) can be 1D, 2D, or string, the format of the result
              1D is 1D array, 2D is 2D array, string is string
          ** unfilledChard
  return: 1D, 2D array of integers, or string according to format argument, containig the values of the cells in order they are created */
  getCellValues(
    { format, unfilledChar } = { format: "2D", unfilledChar: "0" }
  ) {
    let res = this.#cells.map((cell) => cell.value);

    if (format.toUpperCase() === "STRING") {
      return res.join(",").replace(/0/g, unfilledChar || 0);
    } else if (format.toUpperCase() === "2D") {
      const board2D = [];
      while (res.length) board2D.push(res.splice(0, this.#dimensionX));
      return board2D;
    } else if (format.toUpperCase() === "1D") {
      return res;
    } else return false;
  }

  /* gives the value of a cells by the given coordinates
  arg:    x (integer) and y (integer) coordinates
  return: value of the cell (integer) */
  getCellValue(x, y) {
    return this.getCellByCoords(x, y).value;
  }

  /* sets the value of a cells by the given coordinates
  arg:    x (integer) and y (integer) coordinates
  return: void (undefined) */
  setCellValue({ x, y, cell, id }, value) {
    let selectedCell;
    if (cell) {
      selectedCell = cell;
    } else if (x !== undefined && y !== undefined) {
      selectedCell = this.getCellByCoords(x, y);
    } else if (id !== undefined) {
      selectedCell = this.#cells.find((cell) => cell.id === id);
    } else {
      console.error(
        `The setCellValue arguments must be x (${x}), y (${y}), or a Cell (${cell}) object, or an id (${id})! There is no such cell that meets the requirements.`
      );
    }

    if (selectedCell) {
      selectedCell.setValue(value);
      this.#setAllIssuedCells();
    }
  }

  #setAllIssuedCells() {
    this.clearIssued();
    this.getIssuedCells().forEach((issuedCell) => issuedCell.setIssued());
  }
}
