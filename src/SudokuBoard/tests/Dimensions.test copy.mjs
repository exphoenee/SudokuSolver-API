"use strict";

import SudokuBoard from "../SudokuBoard.mjs";
import {
  puzzle2d,
  puzzle1d,
  puzzleStr,
  unsolvable2d,
  unsolvable1d,
  unsolvableStr,
  wrong2d,
  wrong1d,
  wrongStr,
} from "../../Model/Puzzles.mjs";

//console.log(puzzle2d, puzzle1d, puzzleStr);
//console.log("-----------");
console.log("Created board, then filled with values.");
const board = new SudokuBoard(2, 3);
board.setBoard("012340123401234012340123401234012340");
console.log(board.getCellValues({ format: "string" }));

console.log("Created board2 with values.");
const board2 = new SudokuBoard(3, 2, "012340123401234012340123401234012340");
console.log(board2.getCellValues({ format: "string" }));

console.log("Created board3, then filled with values.");
const board3 = new SudokuBoard(2, 2);
board3.setBoard([
  [0, 1, 2, 3],
  [0, 1, 2, 3],
  [0, 1, 2, 3],
  [0, 1, 2, 3],
]);
console.log(board3.getCellValues({ format: "string" }));

console.log("Created board4, then filled with values.");
const board4 = new SudokuBoard(4, 4, [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
]);
console.log(board3.getCellValues({ format: "string" }));
