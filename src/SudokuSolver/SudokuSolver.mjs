"use strict";
import SudokuBoard from "../SudokuBoard/SudokuBoard.mjs";

export default class SudokuSolver {
  #sudokuboard;
  #boxSizeX;
  #boxSizeY;
  #startTime;
  #timeOut;
  #puzzle;
  #warnings;
  #errors;

  constructor(
    sudokuboard,
    { warnings, errors } = { warnings: false, errors: false }
  ) {
    //the size of a section and matrix of sections n x n, but the css isn't made for other sizes only 3 x 3 sudokus...
    this.#boxSizeX = sudokuboard.boardSize.boxSizeX;
    this.#boxSizeY = sudokuboard.boardSize.boxSizeY;
    this.#puzzle = sudokuboard.getCellValues({ format: "2D" });
    this.#startTime = false;
    this.#timeOut = false;
    this.#warnings = warnings;
    this.#errors = errors;

    //using the SudokuBoard calss for handling the sudoku board
    this.#sudokuboard = sudokuboard;
  }

  /* gives back info form all the cells in the board
  arg:    null,
  return: array of object literals */
  get sudokuboard() {
    return this.#sudokuboard;
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
      * or a boolen which value can be only false what mean there is no solution for this puzzle */
  solvePuzzle(
    { puzzle, format, unfilledChar, timeOut, warnings } = {
      puzzle: null,
      format: "2D",
      unfilledChar: ".",
      timeOut: false,
      warnings: false,
    }
  ) {
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

  /* this method is the entry for making solution possiblities and filtrind out the not valid solution
    arg:
      * object literal:
        **  warning: if true, the solver will print warnings to the console, here we can temporary the global this.#warnings overriding
    return: boolean that means the puzzle is solved (ture) or not (false) */
  #solve({ warnings }) {
    if (this.#timeOut && performance.now() - this.#startTime > this.#timeOut) {
      (this.warnings || warnings) && console.warn("Solver timed out!");
      return false;
    }
    return !this.#sudokuboard.coordsOfFirstFreeCell()
      ? this.#sudokuboard.getCellValues({ format: "2D" })
      : this.#checkPossiblities(this.#getPosiblities());
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

  /* generating new temporary boards with the content of the poriginal board, finding the less possiblitiy cell and setting the cell value to the next possiblity
    arg:    null,
    return: returns an array of SudokuBoards (Object) whit a number that is written already in a unfilled cell or a Boolean with value false if there are no more possibility */
  #getPosiblities() {
    const nextCell = this.#sudokuboard.getFreeCellWithLessPosiblity();
    //const nextCell = this.#sudokuboard.getFirstFreeCell();

    if (nextCell) {
      const posNums = this.#sudokuboard.getCellPossibilities(nextCell);
      return posNums
        .map((nr) => {
          const temporaryBoard = new SudokuBoard(
            this.#boxSizeX,
            this.#boxSizeY
          );
          temporaryBoard.setBoard(this.#sudokuboard.getCellValues());
          temporaryBoard.setCellValue({ x: nextCell.x, y: nextCell.y }, nr);
          return temporaryBoard;
        })
        .filter((puzzle) => puzzle.puzzleIsCorrect());
    }
    return false;
  }

  /* check the possibilities if there is any:
      * takes the first, and check that good is (recourevely),
      * if not generates new possibilities and returns that (recourevely),
      * returns a puzzle of a flase is there is not any solution
      arg: m pieces of SudokuBorad class therefrom filtered out the incorrect versions
      return: boolean only false value if there is no solution, or
              a SudokuBoard (Class) as result */
  #checkPossiblities(possiblities) {
    if (Array.isArray(possiblities) && possiblities.length > 0) {
      let possiblity = possiblities.shift();
      this.#sudokuboard.setBoard(possiblity.getCellValues({ format: "2D" }));
      const treeBranch = this.#solve(possiblity);
      return treeBranch ? treeBranch : this.#checkPossiblities(possiblities);
    } else {
      return false;
    }
  }
}
