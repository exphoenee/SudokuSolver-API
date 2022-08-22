"use strict";
import SudokuBoard from "../SudokuBoard/SudokuBoard.mjs";

export default class SudokuSolver {
  #sudokuboard;
  #boxSizeX;
  #boxSizeY;
  #puzzle;

  constructor(sudokuboard) {
    //the size of a section and matrix of sections n x n, but the css isn't made for other sizes only 3 x 3 sudokus...
    this.#boxSizeX = sudokuboard.boardSize.boxSizeX;
    this.#boxSizeY = sudokuboard.boardSize.boxSizeY;
    this.#puzzle = sudokuboard.getCellValues({ format: "2D" });

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
    arg:  optionally a puzzle n x n sized 2D array
    returns:
      * the solved puzzle n x n sized 2D array
      * or a boolen which value can be only false what mean there is no solution for this puzzle */
  solvePuzzle(
    { puzzle, format, unfilledChar } = {
      puzzle: null,
      format: "2D",
      unfilledChar: ".",
    }
  ) {
    if (puzzle) {
      this.#sudokuboard.setBoard(puzzle);
    }

    if (this.#sudokuboard.puzzleIsCorrect()) {
      const result = this.#solve();

      return result ? this.convertPuzzle(result, format, unfilledChar) : false;
    }
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

  /* this method is the entry for making solution possiblities and filtrind out the not valid solution
    arg:    null
    return: boolean that means the puzzle is solved (ture) or not (false) */
  #solve() {
    return !this.#sudokuboard.coordsOfFirstFreeCell()
      ? this.#sudokuboard.getCellValues({ format: "2D" })
      : this.#checkPossiblities(this.#getPosiblities());
  }

  /* generating (k-j) different puzzles, where the first free cell is filled with all the possible numbenr j...k
    arg:    puzzle n x n sized 2D array
    return: m pieces of SudokuBorad class therefrom filtered out the incorrect versions */
  #getPosiblities() {
    const nextCell = this.#sudokuboard.getFirstFeeCell();

    if (nextCell) {
      const posNums = this.#sudokuboard.getCellPossiblities(nextCell);
      return posNums.map((nr) => {
        const temporaryBoard = new SudokuBoard(this.#boxSizeX, this.#boxSizeY);
        temporaryBoard.setBoard(this.#sudokuboard.getCellValues());
        temporaryBoard.setCellValue({ x: nextCell.x, y: nextCell.y }, nr);
        return temporaryBoard;
      });
      //.filter((puzzle) => puzzle.puzzleIsCorrect());
      /* TODO: lehet hogy ez a lépés teljesen felesleges, át kell gondolnom...hiszan ha már levizsgáltk, mit lehet egy adott cellába írni, akkor után már nem okozhat problémát */
    }
    return false;
  }

  /* check the possibilities if there is any:
      * takes the first, and check that good is (recourevely),
      * if not generates new possibilities and returns that (recourevely),
      * returns a puzzle of a flase is there is not any solution
      arg: m pieces of SudokuBorad class therefrom filtered out the incorrect versions
      return: boolean only false value, or
              n pieces of SudokuBorad class therefrom filtered out the incorrect versions */
  #checkPossiblities(possiblities) {
    if (possiblities.length > 0) {
      let possiblity = possiblities.shift();
      this.#sudokuboard.setBoard(possiblity.getCellValues({ format: "2D" }));
      const treeBranch = this.#solve(possiblity);
      return treeBranch ? treeBranch : this.#checkPossiblities(possiblities);
    } else {
      return false;
    }
  }
}
