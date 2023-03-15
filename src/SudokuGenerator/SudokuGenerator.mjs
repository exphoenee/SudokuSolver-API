"use strict";

import SudokuBoard from "../SudokuBoard/SudokuBoard.mjs";
import SudokuSolver from "../SudokuSolver/SudokuSolver.mjs";

export default class SudokuGenerator {
  #sudokuboard;
  #boxSizeX;
  #boxSizeY;
  #solver;
  #warnings;
  #errors;
  #defaultLevels;

  constructor(
    { sudokuboard, boxSizeX, boxSizeY },
    { warnings, errors } = { warnings: false, errors: false }
  ) {
    this.#boxSizeX = boxSizeX || sudokuboard.boardSize.boxSizeX;
    this.#boxSizeY = boxSizeY || sudokuboard.boardSize.boxSizeY;
    this.#warnings = warnings;
    this.#errors = errors;

    this.#defaultLevels = { easy: 35, medium: 45, hard: 65, evil: 75 };

    this.#sudokuboard = new SudokuBoard(this.#boxSizeX, this.#boxSizeY);
    this.#solver = new SudokuSolver(this.#sudokuboard);
  }

  /* gives back the entire sudokuboard
  arg:    null
  return  SudokuBoard (Object) */
  get sudokuboard() {
    return this.#sudokuboard;
  }

  get levels() {
    return this.#defaultLevels;
  }

  /* gives back info form all the cells in the board
  arg:    null,
  return: array of object literals */
  setBoard(puzzle) {
    this.#sudokuboard.setBoard(puzzle);
  }

  clearBoard() {
    this.#sudokuboard.clearBoard();
  }

  getFreeCells() {
    return this.#sudokuboard.cells.filter((cell) => cell.isUnfilled());
  }

  getCellPossibilities({ cell }) {
    return this.#sudokuboard.getCellPossibilities({ cell });
  }

  getRandomFreeCell() {
    const freeCells = this.getFreeCells();
    return freeCells[Math.floor(Math.random() * freeCells.length)];
  }

  setCellRandomValue(cell) {
    const possibleities = this.getCellPossibilities({ cell });

    if (possibleities) {
      const value =
        possibleities[Math.floor(Math.random() * possibleities.length)];
      if (value) cell.setValue(+value);
    }
  }

  setRandomCellToRandomValue() {
    const cell = this.getRandomFreeCell();
    this.setCellRandomValue(cell);
  }

  generatePuzzle({ level } = { level: "easy" }) {
    const nrOfCell = this.sudokuboard.cells.length;
    const cellAmmount = {
      ...this.#defaultLevels,
      default: () => (isNaN(+level) ? 75 : +level),
    };

    const nrOfSetFree = Math.floor(
      (isNaN(+level)
        ? nrOfCell * cellAmmount[level.toLowerCase()]
        : Math.max(+level * nrOfCell, 5)) / 100
    );

    const trialGoal = Math.floor(nrOfCell * 0.24);
    let trialStep = 0;
    let solution;

    const startTime = performance.now();
    do {
      this.#sudokuboard.clearBoard();

      [...this.#sudokuboard.cells]
        .sort(() => Math.random() - 0.5)
        .splice(0, trialGoal)
        .forEach((cell) => this.setCellRandomValue(cell));

      trialStep++;
      solution = this.#solver.solvePuzzle({ format: "string", timeOut: 10000 });
    } while (solution === false);

    [...this.#sudokuboard.cells]
      .sort(() => Math.random() - 0.5)
      .splice(0, nrOfSetFree)
      .forEach((cell) => cell.setValue(0));

    const endTime = performance.now();
    const generationTime = endTime - startTime;

    const puzzle = this.sudokuboard.getCellValues({ format: "string" });

    return {
      puzzle,
      solution,
      generationTime,
      trialStep,
      level,
    };
  }
}
