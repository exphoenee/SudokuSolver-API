"use strict";

import SudokuBoard from "../../SudokuBoard/SudokuBoard.mjs";
import SudokuSolver from "../SudokuSolver.mjs";

/*
console.log("Created board, 3x3 dimensions.");
const board0 = new SudokuBoard(3, 3);
const solver0 = new SudokuSolver(board0);
const puzzle0 = solver0.solvePuzzle({ format: "string" });
console.log(puzzle0);
*/

console.log("Created board, 2x3 dimensions.");
const board1 = new SudokuBoard(2, 3);
console.log(board1.getCellValues({ format: "2D" }));
const solver1 = new SudokuSolver(board1);
const puzzle1 = solver1.solvePuzzle({ format: "string", timeOut: 1000 });
console.log(puzzle1);

/*
console.log("Created board2 with 3x2 dimensions.");
const board2 = new SudokuBoard(3, 2);
const solver2 = new SudokuSolver(board2);
const puzzle2 = solver2.solvePuzzle({ format: "string" });
console.log(puzzle2);

console.log("Created board3, 2x2 dimansion.");
const board3 = new SudokuBoard(2, 2);
const solver3 = new SudokuSolver(board3);
const puzzle3 = solver3.solvePuzzle({ format: "string" });
console.log(puzzle3);

console.log("Created board4, 4x4.");
const board4 = new SudokuBoard(4, 4);
const solver4 = new SudokuSolver(board4);
const puzzle4 = solver4.solvePuzzle({ format: "string" });
console.log(puzzle4);
*/
