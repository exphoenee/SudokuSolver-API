"use strict";
import SudokuBoard from "../SudokuBoard/SudokuBoard.mjs";

export default class SudokuSolver {
  #sudokuBoard;
  #boxSizeX;
  #boxSizeY;
  #startTime;
  #timeOut;
  #puzzle;
  #warnings;
  #errors;

  constructor(
    sudokuBoard,
    {warnings, errors} = {warnings: false, errors: false},
  ) {
    //the size of a section and matrix of sections n x n, but the css isn't made for other sizes only 3 x 3 sudoku's...
    this.#boxSizeX = sudokuBoard.boardSize.boxSizeX;
    this.#boxSizeY = sudokuBoard.boardSize.boxSizeY;
    this.#puzzle = sudokuBoard.getCellValues({format: "2D"});
    this.#startTime = false;
    this.#timeOut = false;
    this.#warnings = warnings;
    this.#errors = errors;

    //using the SudokuBoard class for handling the sudoku board
    this.#sudokuBoard = sudokuBoard;
  }

  /* gives back info form all the cells in the board
  arg:    null,
  return: array of object literals */
  get sudokuBoard() {
    return this.#sudokuBoard;
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

  /**********************************/
  /* methods for the puzzle solving */
  /*     here comes the magic...    */
  /**********************************/

  /* this is the entry point of the solver
    arg:
      * first parameter object literal:
        ** puzzle: optionally a puzzle n x n sized 2D array
        ** format: what kind of format the method should return the puzzle
        ** unfilledChar: the character that represents an unfilled cell
        ** timeOut: the time in milliseconds after which the solver should stop
        ** warnings: if true, the solver will print warnings to the console, here we can temporary the global this.#warnings overriding
    returns:
      * the solved puzzle n x n sized 2D array
      * or a boolean which value can be only false what mean there is no solution for this puzzle */
  solvePuzzle(
    {puzzle, format, unfilledChar, timeOut, warnings} = {
      puzzle: null,
      format: "2D",
      unfilledChar: ".",
      timeOut: false,
      warnings: false,
    },
  ) {
    if (puzzle) {
      this.#sudokuBoard.setBoard(puzzle);
    }

    this.#timeOut = timeOut;
    this.#timeOut && (this.#startTime = performance.now());

    if (this.#sudokuBoard.puzzleIsCorrect()) {
      const result = this.#solve({warnings});

      return result ? this.convertPuzzle(result, format, unfilledChar) : false;
    }
  }

  /* this method is the entry for making solution possibilities and filtering out the not valid solution
    arg:
      * object literal:
        **  warning: if true, the solver will print warnings to the console, here we can temporary the global this.#warnings overriding
    return: boolean that means the puzzle is solved (true) or not (false) */
  #solve({warnings}) {
    if (this.#timeOut && performance.now() - this.#startTime > this.#timeOut) {
      (this.warnings || warnings) && console.warn("Solver timed out!");
      return false;
    }
    return !this.#sudokuBoard.coordsOfFirstFreeCell()
      ? this.#sudokuBoard.getCellValues({format: "2D"})
      : this.#checkPossibilities(this.#getPossibilities());
  }

  /* Cerates a temporary board and sets the cell value to the given value
  return: a new board Class */
  #createTemporaryBoard(puzzle) {
    return new SudokuBoard(this.#boxSizeX, this.#boxSizeY, puzzle);
  }

  /* Converting the board to different formats
  return: the converted board */
  convertPuzzle(puzzle, format = "2D", unfilledChar = "0") {
    return this.#createTemporaryBoard(puzzle).getCellValues({
      format,
      unfilledChar,
    });
  }

  /* generating new temporary boards with the content of the original board, finding the less possibility cell and setting the cell value to the next possibility
    arg:    null,
    return: returns an array of SudokuBoards (Object) whit a number that is written already in a unfilled cell or a Boolean with value false if there are no more possibility */
  #getPossibilities() {
    const nextCell = this.#sudokuBoard.getFreeCellWithLessPossibility();
    //const nextCell = this.#sudokuBoard.getFirstFreeCell();

    if (nextCell) {
      const posNumbers = this.#sudokuBoard.getCellPossibilities(nextCell);
      return posNumbers
        .map((nr) => {
          const temporaryBoard = new SudokuBoard(
            this.#boxSizeX,
            this.#boxSizeY,
          );
          temporaryBoard.setBoard(this.#sudokuBoard.getCellValues());
          temporaryBoard.setCellValue({x: nextCell.x, y: nextCell.y}, nr);
          return temporaryBoard;
        })
        .filter((puzzle) => puzzle.puzzleIsCorrect());
    }
    return false;
  }

  /* check the possibilities if there is any:
      * takes the first, and check that good is (recursively),
      * if not generates new possibilities and returns that (recursively),
      * returns a puzzle of a false is there is not any solution
      arg: m pieces of SudokuBorad class therefrom filtered out the incorrect versions
      return: boolean only false value if there is no solution, or
              a SudokuBoard (Class) as result */
  #checkPossibilities(possibilities) {
    if (Array.isArray(possibilities) && possibilities.length > 0) {
      let possibility = possibilities.shift();
      this.#sudokuBoard.setBoard(possibility.getCellValues({format: "2D"}));
      const treeBranch = this.#solve(possibility);
      return treeBranch ? treeBranch : this.#checkPossibilities(possibilities);
    } else {
      return false;
    }
  }
}
