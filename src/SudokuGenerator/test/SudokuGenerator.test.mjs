"use strict";

import { batchAssert } from "../../test/assert.mjs";
import SudokuBoard from "../../SudokuBoard/SudokuBoard.mjs";
import SudokuSolver from "../../SudokuSolver/SudokuSolver.mjs";
import SudokuGenerator from "../SudokuGenerator.mjs";

const sudokuBoard = new SudokuBoard(3, 3);

console.log("Testing SudokuGenerator...");

const generator = new SudokuGenerator({sudokuBoard});

const randomCell = [
  generator.getRandomFreeCell().info,
  generator.getRandomFreeCell().info,
  generator.getRandomFreeCell().info,
  generator.getRandomFreeCell().info,
  generator.getRandomFreeCell().info,
];

const cases = [
  {
    caseDesc: "Getting a random cell.",
    first: null,
    check: () => randomCell[0],
    excepted: randomCell[0],
  },
  {
    caseDesc: "Getting another random cell.",
    first: null,
    check: () => randomCell[1],
    excepted: randomCell[1],
  },
  {
    caseDesc: "Getting a random cell and setting it to a random value.",
    first: () => generator.setRandomCellToRandomValue(),
    check: () =>
      generator.sudokuBoard.cells.filter((cell) => cell.isFilled()).length,
    excepted: 1,
  },
  {
    caseDesc: "Getting another random cell and setting it to a random value.",
    first: () => generator.setRandomCellToRandomValue(),
    check: () =>
      generator.sudokuBoard.cells.filter((cell) => cell.isFilled()).length,
    excepted: 2,
  },
  {
    caseDesc:
      "Clearing the board, and setting the first to eight cell to 1...8 values of all rows.",
    first: () => {
      generator.sudokuBoard.clearBoard();
      generator.sudokuBoard
        .getAllRows()
        .forEach((row) => row.cells.forEach((cell, i) => cell.setValue(i + 1)));
      for (let y = 1; y < 9; y++)
        generator.sudokuBoard.getCell({x: 8, y}).setValue(1);
      generator.sudokuBoard.getCell({x: 8, y: 0}).setValue(0);
    },
    check: () => {
      return [
        generator.sudokuBoard.getRowValues(0),
        generator.sudokuBoard.getRowValues(3),
        generator.sudokuBoard.getRowValues(5),
        generator.sudokuBoard.getRowValues(8),
      ];
    },
    excepted: [
      [1, 2, 3, 4, 5, 6, 7, 8, 0],
      [1, 2, 3, 4, 5, 6, 7, 8, 1],
      [1, 2, 3, 4, 5, 6, 7, 8, 1],
      [1, 2, 3, 4, 5, 6, 7, 8, 1],
    ],
  },
  {
    caseDesc:
      "Getting a random free cell (only one is free already) and setting it to a random value (only possible is the 9).",
    first: () => generator.setRandomCellToRandomValue(),
    check: () => generator.sudokuBoard.getRowValues(0),
    excepted: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },

  {
    caseDesc: "Generating an easy puzzle.",
    first: () => {
      const level = "easy";
      const {puzzle} = generator.generatePuzzle({
        level
      });

      sudokuBoard.setBoard(puzzle);
    },
    check: () => {
      const solver = new SudokuSolver(sudokuBoard);
      return !!solver.solvePuzzle({format: "string"});
    },
    excepted: true,
  },
  {
    caseDesc: "Generating an medium puzzle.",
    first: () => {
      const level = "medium";
      const {puzzle} = generator.generatePuzzle({
        level
      });

      sudokuBoard.setBoard(puzzle);
    },
    check: () => {
      const solver = new SudokuSolver(sudokuBoard);
      return !!solver.solvePuzzle({format: "string"});
    },
    excepted: true,
  },
  {
    caseDesc: "Generating an hard puzzle.",
    first: () => {
      const level = "hard";
      const {puzzle} = generator.generatePuzzle({
        level
      });

      sudokuBoard.setBoard(puzzle);
    },
    check: () => {
      const solver = new SudokuSolver(sudokuBoard);
      return !!solver.solvePuzzle({format: "string"});
    },
    excepted: true,
  },
  {
    caseDesc: "Generating an evil puzzle.",
    first: () => {
      const level = "evil";
      const {puzzle} = generator.generatePuzzle({
        level
      });

      sudokuBoard.setBoard(puzzle);
    },
    check: () => {
      const solver = new SudokuSolver(sudokuBoard);
      return !!solver.solvePuzzle({format: "string"});
    },
    excepted: true,
  },
  {
    caseDesc: "Generating an custom puzzle with 0.23.",
    first: () => {
      const level = 0.23;
      const {puzzle} = generator.generatePuzzle({
        level,
      });

      sudokuBoard.setBoard(puzzle);
    },
    check: () => {
      const solver = new SudokuSolver(sudokuBoard);
      return !!solver.solvePuzzle({format: "string"});
    },
    excepted: true,
  },
];

batchAssert(cases, {
  showFailed: true,
  showSucceeded: false,
  length: 250,
});
