"use strict";

import { batchAssert } from "../../test/assert.mjs";
import {
  clearBoard,
  clearBoardFirstRow,
  clearBoardThirdRow,
  clearBoardAllRows,
  clearBoardFirstCol,
  clearBoardFourthCol,
  clearBoardFirstBox,
  clearBoardSixthBox,
  puzzleBoard,
  puzzleFirstCell,
  puzzleX3Y6Cell,
  puzzleStrWithDots,
  firstFreeCell,
  puzzleIssuedCells,
  furtherIssuedCells,
  secondFreeCell,
  dupsInFirstRow,
  dupsInSecondRow,
  dupsInFirstCol,
  dupsInSecondCol,
  dupsInFirstBox,
  dupsInSecondBox,
} from "./SudokuBoard.exceptions.mjs";
import Batch from "../Batch/Batch.mjs";
import Cell from "../Cell/Cell.mjs";
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

const board = new SudokuBoard(3, 3);

const cases = [
  {
    caseDesc: "Getting the board properties.",
    first: null,
    check: () => board.info,
    excepted: clearBoard,
  },
  {
    caseDesc: "Getting the first row.",
    first: null,
    check: () => board.getRow(0).info,
    excepted: clearBoardFirstRow,
  },
  {
    caseDesc: "Getting the third row.",
    first: null,
    check: () => board.getRow(2).info,
    excepted: clearBoardThirdRow,
  },
  {
    caseDesc: "Getting all rows.",
    first: null,
    check: () => board.getAllRows().map((row) => row.info),
    excepted: clearBoardAllRows,
  },
  {
    caseDesc: "Getting first column.",
    first: null,
    check: () => board.getCol(0).info,
    excepted: clearBoardFirstCol,
  },
  {
    caseDesc: "Getting fourth column.",
    first: null,
    check: () => board.getCol(3).info,
    excepted: clearBoardFourthCol,
  },
  {
    caseDesc: "Getting first box.",
    first: null,
    check: () => board.getBox(0).info,
    excepted: clearBoardFirstBox,
  },
  {
    caseDesc: "Getting sixt box.",
    first: null,
    check: () => board.getBox(5).info,
    excepted: clearBoardSixthBox,
  },
  {
    caseDesc: "Setting the board to puzzle as 2D array.",
    first: () => board.setBoard(puzzle2d),
    check: () => board.getCellValues({ format: "2D" }),
    excepted: puzzle2d,
  },
  {
    caseDesc: "Setting the board to unsolvable puzzle as 1D array.",
    first: () => board.setBoard(unsolvable1d),
    check: () => board.getCellValues({ format: "2D" }),
    excepted: unsolvable2d,
  },
  {
    caseDesc: "Setting the board to puzzle as string.",
    first: () => {
      board.setBoard(puzzleStr);
      return puzzleStr;
    },
    check: () => board.getCellValues({ format: "2D" }),
    excepted: puzzle2d,
  },
  {
    caseDesc: "Getting the board values as string, the board is set to puzzle.",
    first: null,
    check: () => board.getCellValues({ format: "1D" }),
    excepted: puzzle1d,
  },
  {
    caseDesc: "Getting the board values as string, the board is set to puzzle.",
    first: null,
    check: () => board.getCellValues({ format: "string" }),
    excepted: puzzleStr,
  },
  {
    caseDesc:
      "Getting the board values as string, and unfilled chars set to '.', the board is set to puzzle.",
    first: null,
    check: () => board.getCellValues({ format: "string", unfilledChar: "." }),
    excepted: puzzleStrWithDots,
  },
  {
    caseDesc: "Getting info of first cell, the board is set to puzzle.",
    first: null,
    check: () => board.getCellByCoords(0, 0).info,
    excepted: puzzleFirstCell,
  },
  {
    caseDesc:
      "Getting getting the info of X3 - Y6 cell, the board is set to puzzle.",
    first: null,
    check: () => board.getCellByCoords(3, 5).info,
    excepted: puzzleX3Y6Cell,
  },
  {
    caseDesc: "Getting the board info, the board is set to puzzle.",
    first: null,
    check: () => board.info,
    excepted: puzzleBoard,
  },
  {
    caseDesc:
      "Finding the first free cell of the board, the board is set to puzzle.",
    first: null,
    check: () => board.getFirstFeeCell().info,
    excepted: firstFreeCell,
  },
  {
    caseDesc:
      "Finding the first free cell of the board and getting the coords of them, the board is set to puzzle.",
    first: null,
    check: () => board.coordsOfFirstFreeCell(),
    excepted: { x: firstFreeCell.x, y: firstFreeCell.y },
  },
  {
    caseDesc: "Checking the puzzle is correct, the board is set to puzzle.",
    first: null,
    check: () => board.puzzleIsCorrect(),
    excepted: true,
  },
  {
    caseDesc:
      "Setting the first free cell value to 1 thorug coordinate, checking the value of that.",
    first: () => board.setCellValue({ x: 1, y: 0 }, 1),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 1, issued: true },
  },
  {
    caseDesc:
      "Setting the first free cell value to 0 thorug id selector, checking the value of that.",
    first: () => board.setCellValue({ id: 1 }, 0),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 0, issued: false },
  },
  {
    caseDesc:
      "Setting the first free cell value to 2 throug Cell reference, checking the value of that.",
    first: () => board.setCellValue({ cell: board.getFirstFeeCell() }, 1),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 1, issued: true },
  },
  {
    caseDesc:
      "Trying to set first free cell to invalid value: 11, checking the value of that.",
    first: () => board.setCellValue({ x: 1, y: 0 }, 11),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 0, issued: false },
  },
  {
    caseDesc:
      "Trying to set first free cell to invalid value: 'a' string, checking the value of that.",
    first: () => board.setCellValue({ x: 1, y: 0 }, "a"),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 0, issued: false },
  },
  {
    caseDesc:
      "Trying to set first free cell to invalid value: true boolean, checking the value of that.",
    first: () => board.setCellValue({ x: 1, y: 0 }, true),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 0, issued: false },
  },
  {
    caseDesc:
      "Trying to set first free cell to invalid value: true boolean, checking the value of that.",
    first: () => board.setCellValue({ x: 1, y: 0 }, false),
    check: () => board.getCellByCoords(1, 0).info,
    excepted: { ...firstFreeCell, value: 0, issued: false },
  },
  {
    caseDesc:
      "Setting the first and second cell value to 1, getting array of the issued cells!",
    first: () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 0 }, 1);
    },
    check: () => board.getIssuedCells().map((cell) => cell.info),
    excepted: puzzleIssuedCells,
  },
  {
    caseDesc:
      "Setting second rows first and second cell value to 1, getting array of the issued cells!",
    first: () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 0 }, 1);
      board.setCellValue({ x: 0, y: 1 }, 1);
      board.setCellValue({ x: 1, y: 1 }, 1);
    },
    check: () => board.getIssuedCells().map((cell) => cell.info),
    excepted: furtherIssuedCells,
  },
  {
    caseDesc: "Getting first row, that is issued, end chacking there are dups!",
    first: () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 0 }, 1);
      board.setCellValue({ x: 0, y: 1 }, 1);
      board.setCellValue({ x: 1, y: 1 }, 1);
    },
    check: () => board.getRow(0).hasDuplicates(),
    excepted: true,
  },
  {
    caseDesc:
      "Getting third row, that is NOT issued, end chacking there are dups!",
    first: () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 0 }, 1);
      board.setCellValue({ x: 0, y: 1 }, 1);
      board.setCellValue({ x: 1, y: 1 }, 1);
    },
    check: () => board.getRow(2).hasDuplicates(),
    excepted: false,
  },
  {
    caseDesc:
      "Getting first column, that is issued, end chacking there are dups!",
    first: () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 0 }, 1);
      board.setCellValue({ x: 0, y: 1 }, 1);
      board.setCellValue({ x: 1, y: 1 }, 1);
    },
    check: () => board.getCol(0).hasDuplicates(),
    excepted: true,
  },
  {
    caseDesc:
      "Getting third column, that is NOT issued, end chacking there are dups!",
    first: () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 0 }, 1);
      board.setCellValue({ x: 0, y: 1 }, 1);
      board.setCellValue({ x: 1, y: 1 }, 1);
    },
    check: () => board.getCol(2).hasDuplicates(),
    excepted: false,
  },
  {
    caseDesc: "Getting first box, that is issued, end chacking there are dups!",
    first: () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 0 }, 1);
      board.setCellValue({ x: 0, y: 1 }, 1);
      board.setCellValue({ x: 1, y: 1 }, 1);
    },
    check: () => board.getBox(0).hasDuplicates(),
    excepted: true,
  },
  {
    caseDesc:
      "Getting ninth box, that is NOT issued, end chacking there are dups!",
    first: () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 0 }, 1);
      board.setCellValue({ x: 0, y: 1 }, 1);
      board.setCellValue({ x: 1, y: 1 }, 1);
    },
    check: () => board.getBox(8).hasDuplicates(),
    excepted: false,
  },

  {
    caseDesc:
      "Setting first and second rows first and second cell value to 1, checking the puzzle is correct?",
    first: () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 1, y: 0 }, 1);
      board.setCellValue({ x: 0, y: 1 }, 1);
      board.setCellValue({ x: 1, y: 1 }, 1);
    },
    check: () => board.puzzleIsCorrect(),
    excepted: false,
  },
  {
    caseDesc: "After filled the first free cell, find the next one.",
    first: null,
    check: () => board.getFirstFeeCell().info,
    excepted: secondFreeCell,
  },
  {
    caseDesc:
      "After filled the first free cell, find the next one, and gets the coords of it.",
    first: null,
    check: () => board.coordsOfFirstFreeCell(),
    excepted: { x: secondFreeCell.x, y: secondFreeCell.y },
  },
  {
    caseDesc: "Gets the first row, and gets the value of them.",
    first: null,
    check: () => board.getRow(0).getCellValues(),
    excepted: [1, 1, 0, 0, 0, 7, 0, 0, 3],
  },
  {
    caseDesc: "Gets the first row, and gets the missing value of them.",
    first: null,
    check: () => board.getRow(0).getMissingNumbers(),
    excepted: [2, 4, 5, 6, 8, 9],
  },
  {
    caseDesc: "Gets the first row, and gets the value of them.",
    first: null,
    check: () => board.getRow(0).getFilledNumbers(),
    excepted: [1, 3, 7],
  },
  {
    caseDesc: "Gets the duplicate cells in the first row.",
    first: null,
    check: () =>
      board
        .getRow(0)
        .getDuplicateValuedCells()
        .map((cell) => cell.info),
    excepted: dupsInFirstRow,
  },
  {
    caseDesc: "Gets the duplicate cells in the second row.",
    first: null,
    check: () =>
      board
        .getRow(1)
        .getDuplicateValuedCells()
        .map((cell) => cell.info),
    excepted: dupsInSecondRow,
  },
  {
    caseDesc: "Gets the duplicate cells in the third row.",
    first: null,
    check: () =>
      board
        .getRow(2)
        .getDuplicateValuedCells()
        .map((cell) => cell.info),
    excepted: [],
  },
  {
    caseDesc: "Gets the duplicate cells in the first column.",
    first: null,
    check: () =>
      board
        .getCol(0)
        .getDuplicateValuedCells()
        .map((cell) => cell.info),
    excepted: dupsInFirstCol,
  },
  {
    caseDesc: "Gets the duplicate cells in the second column.",
    first: null,
    check: () =>
      board
        .getCol(1)
        .getDuplicateValuedCells()
        .map((cell) => cell.info),
    excepted: dupsInSecondCol,
  },
  {
    caseDesc: "Gets the duplicate cells in the third column.",
    first: null,
    check: () =>
      board
        .getCol(2)
        .getDuplicateValuedCells()
        .map((cell) => cell.info),
    excepted: [],
  },
  {
    caseDesc: "Gets the duplicate cells in the first box.",
    first: null,
    check: () =>
      board
        .getBox(0)
        .getDuplicateValuedCells()
        .map((cell) => cell.info),
    excepted: dupsInFirstBox,
  },
  {
    caseDesc: "Gets the duplicate cells in the second box.",
    first: null,
    check: () =>
      board
        .getBox(1)
        .getDuplicateValuedCells()
        .map((cell) => cell.info),
    excepted: dupsInSecondBox,
  },
  {
    caseDesc: "Gets the duplicate cells in the third box.",
    first: null,
    check: () =>
      board
        .getBox(2)
        .getDuplicateValuedCells()
        .map((cell) => cell.info),
    excepted: [],
  },
  {
    caseDesc: "Checks the board has duplicated cells in the first row.",
    first: null,
    check: () => board.hasRowDuplicates(0),
    excepted: true,
  },
  {
    caseDesc: "Checks the board has duplicated cells in the second row.",
    first: null,
    check: () => board.hasRowDuplicates(1),
    excepted: true,
  },
  {
    caseDesc: "Checks the board has duplicated cells in the fifth row.",
    first: null,
    check: () => board.hasRowDuplicates(4),
    excepted: false,
  },
  {
    caseDesc: "Checks the board has duplicated cells in the first column.",
    first: null,
    check: () => board.hasColumnDuplicates(0),
    excepted: true,
  },
  {
    caseDesc: "Checks the board has duplicated cells in the second column.",
    first: null,
    check: () => board.hasColumnDuplicates(1),
    excepted: true,
  },
  {
    caseDesc: "Checks the board has duplicated cells in the fifth column.",
    first: null,
    check: () => board.hasColumnDuplicates(4),
    excepted: false,
  },
  {
    caseDesc: "Checks the board has duplicated cells in the first box.",
    first: null,
    check: () => board.hasBoxDuplicates(0),
    excepted: true,
  },
  {
    caseDesc: "Checks the board has duplicated cells in the second box.",
    first: null,
    check: () => board.hasBoxDuplicates(1),
    excepted: false,
  },
  {
    caseDesc:
      "Setting the board to puzzle as 2D array again, and fingind the first free cell, and checking tha possiblities of that. It must be wrong because that is issued currently.",
    first: null,
    check: () => board.getCellPossiblities(firstFreeCell),
    excepted: [4, 5, 8],
  },
  {
    caseDesc:
      "Setting the board to puzzle as 2D array again,, and fingind the first free cell, and checking tha possiblities of that.",
    first: () => board.setBoard(puzzle2d),
    check: () => board.getCellPossiblities(firstFreeCell),
    excepted: [4, 5, 8],
  },
  {
    caseDesc: "Getting the values of the first row.",
    first: null,
    check: () => board.getRowValues(0),
    excepted: [1, 0, 0, 0, 0, 7, 0, 0, 3],
  },
  {
    caseDesc: "Getting the values of the third row.",
    first: null,
    check: () => board.getRowValues(2),
    excepted: [0, 3, 0, 5, 2, 0, 0, 9, 0],
  },
  {
    caseDesc: "Getting the values of the eigth row.",
    first: null,
    check: () => board.getRowValues(7),
    excepted: [5, 0, 8, 1, 0, 0, 7, 0, 2],
  },
  {
    caseDesc: "Getting the values of the first column.",
    first: null,
    check: () => board.getColValues(0),
    excepted: [1, 9, 0, 3, 0, 0, 0, 5, 6],
  },
  {
    caseDesc: "Getting the values of the third column.",
    first: null,
    check: () => board.getColValues(2),
    excepted: [0, 6, 0, 0, 5, 1, 0, 8, 0],
  },
  {
    caseDesc: "Getting the values of the eigth column.",
    first: null,
    check: () => board.getColValues(7),
    excepted: [0, 0, 9, 0, 0, 4, 1, 0, 0],
  },
  {
    caseDesc: "Getting the values of the first box.",
    first: null,
    check: () => board.getBoxValues(0),
    excepted: [1, 0, 0, 9, 0, 6, 0, 3, 0],
  },
  {
    caseDesc: "Getting the values of the third box.",
    first: null,
    check: () => board.getBoxValues(2),
    excepted: [0, 0, 3, 2, 0, 4, 0, 9, 0],
  },
  {
    caseDesc: "Getting the values of the eigth box.",
    first: null,
    check: () => board.getBoxValues(7),
    excepted: [0, 6, 5, 1, 0, 0, 7, 0, 0],
  },
  {
    caseDesc: "Getting the missing values from the first row.",
    first: null,
    check: () => board.getMissingFromRow(0),
    excepted: [2, 4, 5, 6, 8, 9],
  },
  {
    caseDesc: "Getting the missing values from the third row.",
    first: null,
    check: () => board.getMissingFromRow(2),
    excepted: [1, 4, 6, 7, 8],
  },
  {
    caseDesc: "Getting the missing values from the eigth row.",
    first: null,
    check: () => board.getMissingFromRow(7),
    excepted: [3, 4, 6, 9],
  },
  {
    caseDesc: "Getting the missing values from the first column.",
    first: null,
    check: () => board.getMissingFromCol(0),
    excepted: [2, 4, 7, 8],
  },
  {
    caseDesc: "Getting the missing values from the third column.",
    first: null,
    check: () => board.getMissingFromCol(2),
    excepted: [2, 3, 4, 7, 9],
  },
  {
    caseDesc: "Getting the missing values from the eigth column.",
    first: null,
    check: () => board.getMissingFromCol(7),
    excepted: [2, 3, 5, 6, 7, 8],
  },
  {
    caseDesc: "Getting the missing values from the first box.",
    first: null,
    check: () => board.getMissingFromBox(0),
    excepted: [2, 4, 5, 7, 8],
  },
  {
    caseDesc: "Getting the missing values from the third box.",
    first: null,
    check: () => board.getMissingFromBox(2),
    excepted: [1, 5, 6, 7, 8],
  },
  {
    caseDesc: "Getting the missing values from the eigth box.",
    first: null,
    check: () => board.getMissingFromBox(7),
    excepted: [2, 3, 4, 8, 9],
  },
  {
    caseDesc: "Getting the filled values from the first row.",
    first: null,
    check: () => board.getFilledFromRow(0),
    excepted: [1, 3, 7],
  },
  {
    caseDesc: "Getting the filled values from the third row.",
    first: null,
    check: () => board.getFilledFromRow(2),
    excepted: [2, 3, 5, 9],
  },
  {
    caseDesc: "Getting the filled values from the eigth row.",
    first: null,
    check: () => board.getFilledFromRow(7),
    excepted: [1, 2, 5, 7, 8],
  },
  {
    caseDesc: "Getting the filled values from the first column.",
    first: null,
    check: () => board.getFilledFromCol(0),
    excepted: [1, 3, 5, 6, 9],
  },
  {
    caseDesc: "Getting the filled values from the third column.",
    first: null,
    check: () => board.getFilledFromCol(2),
    excepted: [1, 5, 6, 8],
  },
  {
    caseDesc: "Getting the filled values from the eigth column.",
    first: null,
    check: () => board.getFilledFromCol(7),
    excepted: [1, 4, 9],
  },
  {
    caseDesc: "Getting the filled values from the first box.",
    first: null,
    check: () => board.getFilledFromBox(0),
    excepted: [1, 3, 6, 9],
  },
  {
    caseDesc: "Getting the filled values from the third box.",
    first: null,
    check: () => board.getFilledFromBox(2),
    excepted: [2, 3, 4, 9],
  },
  {
    caseDesc: "Getting the filled values from the eigth box.",
    first: null,
    check: () => board.getFilledFromBox(7),
    excepted: [1, 5, 6, 7],
  },
];

batchAssert(cases, {
  showFailed: true,
  showSuccessed: false,
  length: Infinity,
});
