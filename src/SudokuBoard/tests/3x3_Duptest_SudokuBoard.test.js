"use strict";

import { batchAssert } from "../../test/assert.mjs";
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
} from "../../Model/3x3_Puzzles.mjs";

const board = new SudokuBoard(3, 3);

const cases = [
  {
    caseDesc:
      "Setting the first row's first cell to value: 1, and checking it is issued?",
    first: () => board.setCellValue({ x: 0, y: 0 }, 1),
    check: () => board.getCell({ x: 0, y: 0 }).value,
    excepted: 1,
  },
  {
    caseDesc:
      "Setting the first row's first and third cell to value: 1, and checking they is issued?",
    first: () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 2, y: 0 }, 1);
    },
    check: () => {
      return {
        first: board.getCell({ x: 0, y: 0 }).issued,
        third: board.getCell({ x: 2, y: 0 }).issued,
      };
    },
    excepted: { first: true, third: true },
  },
  {
    caseDesc:
      "Setting the first row's first, third and fifth cell to value: 1, and checking they is issued?",
    first: () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 2, y: 0 }, 1);
      board.setCellValue({ x: 4, y: 0 }, 1);
    },
    check: () => {
      return {
        first: board.getCell({ x: 0, y: 0 }).issued,
        third: board.getCell({ x: 2, y: 0 }).issued,
        fifth: board.getCell({ x: 4, y: 0 }).issued,
      };
    },
    excepted: { first: true, third: true, fifth: true },
  },
  {
    caseDesc:
      "Setting the first row's first, third, fifth and seventh cell to value: 1, and checking they is issued?",
    first: () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 2, y: 0 }, 1);
      board.setCellValue({ x: 4, y: 0 }, 1);
      board.setCellValue({ x: 6, y: 0 }, 1);
    },
    check: () => {
      return {
        first: board.getCell({ x: 0, y: 0 }).issued,
        third: board.getCell({ x: 2, y: 0 }).issued,
        fifth: board.getCell({ x: 4, y: 0 }).issued,
        seventh: board.getCell({ x: 6, y: 0 }).issued,
      };
    },
    excepted: { first: true, third: true, fifth: true, seventh: true },
  },
  {
    caseDesc:
      "Setting the first row's first, third, fifth seventh and ninth cell to value: 1, and checking they is issued?",
    first: () => {
      board.setCellValue({ x: 0, y: 0 }, 1);
      board.setCellValue({ x: 2, y: 0 }, 1);
      board.setCellValue({ x: 4, y: 0 }, 1);
      board.setCellValue({ x: 6, y: 0 }, 1);
      board.setCellValue({ x: 8, y: 0 }, 1);
    },
    check: () => {
      return {
        first: board.getCell({ x: 0, y: 0 }).issued,
        third: board.getCell({ x: 2, y: 0 }).issued,
        fifth: board.getCell({ x: 4, y: 0 }).issued,
        seventh: board.getCell({ x: 6, y: 0 }).issued,
        ninth: board.getCell({ x: 8, y: 0 }).issued,
      };
    },
    excepted: {
      first: true,
      third: true,
      fifth: true,
      seventh: true,
      ninth: true,
    },
  },
];

batchAssert(cases, {
  showFailed: true,
  showSuccessed: false,
  length: Infinity,
});
