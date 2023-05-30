"use strict";

import SudokuBoard from "../../SudokuBoard/SudokuBoard.mjs";
import SudokuSolver from "../SudokuSolver.mjs";

console.log("Created board, 2x3 dimensions.");
const board1 = new SudokuBoard(2, 3);
console.log(board1.getCellValues({format: "2D"}));
const solver1 = new SudokuSolver(board1);
const puzzle1 = solver1.solvePuzzle({format: "string", timeOut: 1000});
console.log(puzzle1);
