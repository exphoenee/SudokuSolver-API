'use strict';
import SudokuBoard from '../core/SudokuBoard/SudokuBoard.mjs';

/**
 * @fileoverview SudokuSolver - Backtracking algorithm for solving Sudoku puzzles
 * @module solver/SudokuSolver
 */

/**
 * Solves Sudoku puzzles using backtracking with constraint propagation.
 * @class
 */
export default class SudokuSolver {
  #sudokuboard;
  #boxSizeX;
  #boxSizeY;
  #startTime;
  #timeOut;
  #puzzle;
  #warnings;
  #errors;

  /**
   * Creates a new SudokuSolver instance.
   * @param {SudokuBoard} sudokuboard - The board to solve
   * @param {{warnings?: boolean, errors?: boolean}} [options]
   */
  constructor(sudokuboard, { warnings = false, errors = false } = {}) {
    this.#boxSizeX = sudokuboard.boardSize.boxSizeX;
    this.#boxSizeY = sudokuboard.boardSize.boxSizeY;
    this.#puzzle = sudokuboard.getCellValues({ format: '2D' });
    this.#startTime = false;
    this.#timeOut = false;
    this.#warnings = warnings;
    this.#errors = errors;
    this.#sudokuboard = sudokuboard;
  }

  /**
   * Returns the associated SudokuBoard.
   * @returns {SudokuBoard}
   */
  get sudokuboard() {
    return this.#sudokuboard;
  }

  /**
   * Sets the board to a new puzzle state.
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
   * Solves the puzzle.
   * @param {{
   *   puzzle?: number[][]|number[]|string,
   *   format?: string,
   *   unfilledChar?: string,
   *   timeOut?: number,
   *   warnings?: boolean
   * }} [options]
   * @returns {number[][]|number[]|string|false}
   */
  solvePuzzle({
    puzzle,
    format = '2D',
    unfilledChar = '.',
    timeOut = false,
    warnings = false,
  } = {}) {
    if (puzzle) {
      this.#sudokuboard.setBoard(puzzle);
    }

    this.#timeOut = timeOut;
    this.#timeOut && (this.#startTime = performance.now());

    if (this.#sudokuboard.puzzleIsCorrect()) {
      const result = this.#solve({ warnings });
      return result ? this.convertPuzzle(result, format, unfilledChar) : false;
    }
  }

  /**
   * Recursive solver implementation.
   * @private
   * @param {{warnings?: boolean}} [options]
   * @returns {number[][]|false}
   */
  #solve({ warnings } = {}) {
    if (this.#timeOut && performance.now() - this.#startTime > this.#timeOut) {
      (this.#warnings || warnings) && console.warn('Solver timed out!');
      return false;
    }
    return !this.#sudokuboard.coordsOfFirstFreeCell()
      ? this.#sudokuboard.getCellValues({ format: '2D' })
      : this.#checkPossibilities(this.#getPossibilities());
  }

  /**
   * Creates a temporary board for exploration.
   * @private
   * @param {number[][]} puzzle
   * @returns {SudokuBoard}
   */
  #createTemporaryBoard(puzzle) {
    return new SudokuBoard(this.#boxSizeX, this.#boxSizeY, puzzle);
  }

  /**
   * Converts puzzle to different formats.
   * @param {number[][]} puzzle
   * @param {string} [format='2D']
   * @param {string} [unfilledChar='0']
   * @returns {number[][]|number[]|string}
   */
  convertPuzzle(puzzle, format = '2D', unfilledChar = '0') {
    return this.#createTemporaryBoard(puzzle).getCellValues({
      format,
      unfilledChar,
    });
  }

  /**
   * Generates possible board states by trying each possibility for the most constrained cell.
   * @private
   * @returns {SudokuBoard[]|false}
   */
  #getPossibilities() {
    const nextCell = this.#sudokuboard.getFreeCellWithLeastPossibilities();

    if (nextCell) {
      const posNums = this.#sudokuboard.getCellPossibilities(nextCell);
      return posNums
        .map(nr => {
          const temporaryBoard = new SudokuBoard(this.#boxSizeX, this.#boxSizeY);
          temporaryBoard.setBoard(this.#sudokuboard.getCellValues());
          temporaryBoard.setCellValue({ x: nextCell.x, y: nextCell.y }, nr);
          return temporaryBoard;
        })
        .filter(puzzle => puzzle.puzzleIsCorrect());
    }
    return false;
  }

  /**
   * Checks possibilities recursively.
   * @private
   * @param {SudokuBoard[]} possibilities
   * @returns {SudokuBoard|false}
   */
  #checkPossibilities(possibilities) {
    if (Array.isArray(possibilities) && possibilities.length > 0) {
      const possibility = possibilities.shift();
      this.#sudokuboard.setBoard(possibility.getCellValues({ format: '2D' }));
      const result = this.#solve(possibility);
      return result ? result : this.#checkPossibilities(possibilities);
    } else {
      return false;
    }
  }
}
