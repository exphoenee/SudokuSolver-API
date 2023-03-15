"use strict";

import SudokuBoard from "../../SudokuBoard/SudokuBoard.mjs";
import SudokuGenerator from "../SudokuGenerator.mjs";

console.log("Created board, 3x3 dimensions.");
const board0 = new SudokuBoard(3, 3);
const generator0 = new SudokuGenerator({ sudokuboard: board0 });
const puzzle0 = generator0.generatePuzzle({ level: "easy" });
console.log(puzzle0.puzzle);

console.log("Created board, 2x3 dimensions.");
const board = new SudokuBoard(2, 3);
const generator = new SudokuGenerator({ sudokuboard: board });
console.log(board.getCellValues());
const puzzle1 = generator.generatePuzzle({ level: "easy" });
console.log(puzzle1.puzzle);

console.log("Created board2 with 3x2 dimensions.");
const board2 = new SudokuBoard(3, 2);
const generator2 = new SudokuGenerator({ sudokuboard: board2 });
const puzzle2 = generator2.generatePuzzle({ level: "easy" });
console.log(puzzle2.puzzle);

console.log("Created board3, 2x2 dimansion.");
const board3 = new SudokuBoard(2, 2);
const generator3 = new SudokuGenerator({ sudokuboard: board3 });
const puzzle3 = generator3.generatePuzzle({ level: "easy" });
console.log(puzzle3.puzzle);

console.log("Created board4, 4x4.");
const board4 = new SudokuBoard(4, 4);
const generator4 = new SudokuGenerator({ sudokuboard: board4 });
const puzzle4 = generator4.generatePuzzle({ level: "easy" });
console.log(puzzle4.puzzle);
