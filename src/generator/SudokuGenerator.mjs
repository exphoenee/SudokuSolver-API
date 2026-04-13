'use strict';

import SudokuBoard from '../core/SudokuBoard/SudokuBoard.mjs';
import SudokuSolver from '../solver/SudokuSolver.mjs';

/**
 * @fileoverview SudokuGenerator - Generates Sudoku puzzles of various difficulty levels
 * @module generator/SudokuGenerator
 */

/**
 * Generates valid Sudoku puzzles with solutions at different difficulty levels.
 * @class
 */
export default class SudokuGenerator {
  #sudokuboard;
  #boxSizeX;
  #boxSizeY;
  #solver;
  #warnings;
  #errors;
  #defaultLevels;

  /**
   * Creates a new SudokuGenerator instance.
   * @param {{sudokuboard?: SudokuBoard, boxSizeX?: number, boxSizeY?: number}} params
   * @param {{warnings?: boolean, errors?: boolean}} [options]
   */
  constructor({ sudokuboard, boxSizeX, boxSizeY }, { warnings = false, errors = false } = {}) {
    this.#boxSizeX = boxSizeX || sudokuboard.boardSize.boxSizeX;
    this.#boxSizeY = boxSizeY || sudokuboard.boardSize.boxSizeY;
    this.#warnings = warnings;
    this.#errors = errors;

    this.#defaultLevels = { easy: 35, medium: 45, hard: 65, evil: 75 };

    this.#sudokuboard = new SudokuBoard(this.#boxSizeX, this.#boxSizeY);
    this.#solver = new SudokuSolver(this.#sudokuboard);
  }

  /**
   * Returns the associated SudokuBoard.
   * @returns {SudokuBoard}
   */
  get sudokuboard() {
    return this.#sudokuboard;
  }

  /**
   * Returns the available difficulty levels.
   * @returns {Object}
   */
  get levels() {
    return this.#defaultLevels;
  }

  /**
   * Sets the board to a puzzle state.
   * @param {number[][]|number[]|string} puzzle
   */
  setBoard(puzzle) {
    this.#sudokuboard.setBoard(puzzle);
  }

  /**
   * Clears the board.
   */
  clearBoard() {
    this.#sudokuboard.clearBoard();
  }

  /**
   * Returns all empty cells.
   * @returns {Cell[]}
   */
  getFreeCells() {
    return this.#sudokuboard.cells.filter(cell => cell.isUnfilled());
  }

  /**
   * Returns possible values for a cell.
   * @param {{cell: Cell}} params
   * @returns {number[]}
   */
  getCellPossibilities({ cell }) {
    return this.#sudokuboard.getCellPossibilities({ cell });
  }

  /**
   * Returns a random empty cell.
   * @returns {Cell|undefined}
   */
  getRandomFreeCell() {
    const freeCells = this.getFreeCells();
    return freeCells[Math.floor(Math.random() * freeCells.length)];
  }

  /**
   * Sets a cell to a random valid value.
   * @param {Cell} cell
   */
  setCellRandomValue(cell) {
    const possibilities = this.getCellPossibilities({ cell });

    if (possibilities) {
      const value = possibilities[Math.floor(Math.random() * possibilities.length)];
      if (value) cell.setValue(+value);
    }
  }

  /**
   * Sets a random empty cell to a random valid value.
   */
  setRandomCellToRandomValue() {
    const cell = this.getRandomFreeCell();
    this.setCellRandomValue(cell);
  }

  /**
   * Generates a puzzle at the specified difficulty level.
   * @param {{level?: string}} [options]
   * @returns {{puzzle: string, solution: string, generationTime: number, trialStep: number, level: string}}
   */
  generatePuzzle({ level = 'easy' } = {}) {
    const nrOfCell = this.sudokuboard.cells.length;
    const cellAmount = {
      ...this.#defaultLevels,
      default: () => (isNaN(+level) ? 75 : +level),
    };

    const nrOfSetFree = Math.floor(
      (isNaN(+level)
        ? nrOfCell * cellAmount[level.toLowerCase()]
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
        .forEach(cell => this.setCellRandomValue(cell));

      trialStep++;
      solution = this.#solver.solvePuzzle({ format: 'string', timeOut: 10000 });
    } while (solution === false);

    [...this.#sudokuboard.cells]
      .sort(() => Math.random() - 0.5)
      .splice(0, nrOfSetFree)
      .forEach(cell => cell.setValue(0));

    const endTime = performance.now();
    const generationTime = endTime - startTime;

    const puzzle = this.sudokuboard.getCellValues({ format: 'string' });

    return {
      puzzle,
      solution,
      generationTime,
      trialStep,
      level,
    };
  }
}
