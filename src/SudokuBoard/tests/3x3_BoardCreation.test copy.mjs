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
} from "../../Model/3x3_Puzzles.mjs";

//console.log(puzzle2d, puzzle1d, puzzleStr);
//console.log("-----------");
console.log("Created board, then filled with values.");
const board = new SudokuBoard(3, 3);
board.setBoard(puzzle2d);
console.log(board.getCellValues({ format: "string" }));

console.log("Created board2 with values.");
const board2 = new SudokuBoard(3, 3, puzzleStr);
console.log(board2.getCellValues({ format: "string" }));

console.log("Created board3, then filled with values.");
const board3 = new SudokuBoard(3, 3);
board3.setBoard(puzzle1d);
console.log(board3.getCellValues({ format: "string" }));

console.log("Created board4, then filled with values.");
const board4 = new SudokuBoard(3, 3, puzzle1d);
console.log(board3.getCellValues({ format: "string" }));
