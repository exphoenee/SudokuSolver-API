"use strict";

import SudokuBoard from "../SudokuBoard/SudokuBoard.mjs";
import SudokuSolver from "../SudokuSolver/SudokuSolver.mjs";

export default class SudokuGenerator {
  #sudokuBoard;
  #boxSizeX;
  #boxSizeY;
  #solver;
  #warnings;
  #errors;
  #defaultLevels;

  constructor(
    {sudokuBoard, boxSizeX, boxSizeY},
    {warnings, errors} = {warnings: false, errors: false},
  ) {
    this.#boxSizeX = boxSizeX || sudokuBoard.boardSize.boxSizeX;
    this.#boxSizeY = boxSizeY || sudokuBoard.boardSize.boxSizeY;
    this.#warnings = warnings;
    this.#errors = errors;

    this.#defaultLevels = {easy: 35, medium: 45, hard: 65, evil: 75};

    this.#sudokuBoard = new SudokuBoard(this.#boxSizeX, this.#boxSizeY);
    this.#solver = new SudokuSolver(this.#sudokuBoard);
  }

  /* gives back the entire sudoku board
  arg:    null
  return  SudokuBoard (Object) */
  get sudokuBoard() {
    return this.#sudokuBoard;
  }

  get levels() {
    return this.#defaultLevels;
  }

  /* gives back info form all the cells in the board
  arg:    null,
  return: array of object literals */
  setBoard(puzzle) {
    this.#sudokuBoard.setBoard(puzzle);
  }

  clearBoard() {
    this.#sudokuBoard.clearBoard();
  }

  getFreeCells() {
    return this.#sudokuBoard.cells.filter((cell) => cell.isUnfilled());
  }

  getCellPossibilities({cell}) {
    return this.#sudokuBoard.getCellPossibilities({cell});
  }

  getRandomFreeCell() {
    const freeCells = this.getFreeCells();
    return freeCells[Math.floor(Math.random() * freeCells.length)];
  }

  setCellRandomValue(cell) {
    const possibilities = this.getCellPossibilities({cell});

    if (possibilities) {
      const value =
        possibilities[Math.floor(Math.random() * possibilities.length)];
      if (value) cell.setValue(+value);
    }
  }

  setRandomCellToRandomValue() {
    const cell = this.getRandomFreeCell();
    this.setCellRandomValue(cell);
  }

  generatePuzzle({level} = {level: "easy"}) {
    const nrOfCell = this.sudokuBoard.cells.length;
    const cellAmount = {
      ...this.#defaultLevels,
      default: () => (isNaN(+level) ? 75 : +level),
    };

    const nrOfSetFree = Math.floor(
      (isNaN(+level)
        ? nrOfCell * cellAmount[level.toLowerCase()]
        : Math.max(+level * nrOfCell, 5)) / 100,
    );

    const trialGoal = Math.floor(nrOfCell * 0.24);
    let trialStep = 0;
    let solution;

    const startTime = performance.now();
    do {
      this.#sudokuBoard.clearBoard();

      [...this.#sudokuBoard.cells]
        .sort(() => Math.random() - 0.5)
        .splice(0, trialGoal)
        .forEach((cell) => this.setCellRandomValue(cell));

      trialStep++;
      solution = this.#solver.solvePuzzle({format: "string", timeOut: 10000});
    } while (solution === false);

    [...this.#sudokuBoard.cells]
      .sort(() => Math.random() - 0.5)
      .splice(0, nrOfSetFree)
      .forEach((cell) => cell.setValue(0));

    const endTime = performance.now();
    const generationTime = endTime - startTime;

    const puzzle = this.sudokuBoard.getCellValues({format: "string"});

    return {
      puzzle,
      solution,
      generationTime,
      trialStep,
      level,
    };
  }
}
