"use strict";

import { batchAssert } from "../../../test/assert.mjs";
import Cell from "../Cell.mjs";

const cell = new Cell({
  x: 0,
  y: 1,
  bx: 2,
  by: 3,
  id: 4,
  boxId: 5,
  value: 6,
  accepted: { max: 9, min: 1, unfilled: 0 },
  given: false,
  issued: false,
  ref: null,
});

//{ first, check, excepted }
const cases = [
  {
    caseDesc: "Getting the x coord of the cell.",
    first: null,
    check: () => cell.x,
    excepted: 0,
  },
  {
    caseDesc: "Getting the y coord of the cell.",
    first: null,
    check: () => cell.y,
    excepted: 1,
  },
  {
    caseDesc: "Getting the box x coord of the cell.",
    first: null,
    check: () => cell.bx,
    excepted: 2,
  },
  {
    caseDesc: "Getting the box y coord of the cell.",
    first: null,
    check: () => cell.by,
    excepted: 3,
  },
  {
    caseDesc: "Getting the id of the cell.",
    first: null,
    check: () => cell.id,
    excepted: 4,
  },
  {
    caseDesc: "Getting the boxId of the cell.",
    first: null,
    check: () => cell.boxId,
    excepted: 5,
  },
  {
    caseDesc: "Getting the value of the cell.",
    first: null,
    check: () => cell.value,
    excepted: 0,
  },
  {
    caseDesc: "Getting the what accepted by the cell.",
    first: null,
    check: () => cell.accepted,
    excepted: { max: 9, min: 1, unfilled: 0 },
  },
  {
    caseDesc: "Getting the given of the cell.",
    first: null,
    check: () => cell.given,
    excepted: false,
  },
  {
    caseDesc: "Getting the issued of the cell.",
    first: null,
    check: () => cell.issued,
    excepted: false,
  },
  {
    caseDesc: "Getting the reference of the cell.",
    first: null,
    check: () => cell.ref,
    excepted: null,
  },
  {
    caseDesc: "Getting the info of the cell.",
    first: null,
    check: () => cell.info,
    excepted: {
      id: 4,
      given: false,
      issued: false,
      value: 0,
      x: 0,
      y: 1,
      bx: 2,
      by: 3,
      id: 4,
      boxId: 5,
      accepted: { max: 9, min: 1, unfilled: 0 },
    },
  },
  {
    caseDesc: "Checking the validate value helper method with value: 0.",
    first: null,
    check: () => cell.validateValue(0),
    excepted: true,
  },
  {
    caseDesc: "Checking the validate value helper method with value: 10.",
    first: null,
    check: () => cell.validateValue(10),
    excepted: false,
  },
  {
    caseDesc: "Checking the validate value helper method with value: 'a'.",
    first: null,
    check: () => cell.validateValue("a"),
    excepted: false,
  },
  {
    caseDesc: "Checking the validate value helper method with value: -1.",
    first: null,
    check: () => cell.validateValue(-1),
    excepted: false,
  },
  {
    caseDesc: "Checking the validate value helper method with value: null.",
    first: null,
    check: () => cell.validateValue(null),
    excepted: false,
  },
  {
    caseDesc:
      "Checking the validate value helper method with value: undefined.",
    first: null,
    check: () => cell.validateValue(undefined),
    excepted: false,
  },
  {
    caseDesc: "Checking the validate value helper method with value: false.",
    first: null,
    check: () => cell.validateValue(false),
    excepted: false,
  },
  {
    caseDesc: "Checking the validate value helper method with value: true.",
    first: null,
    check: () => cell.validateValue(true),
    excepted: true,
  },
  {
    caseDesc: "Setting cell value to: 1.",
    first: () => cell.setValue(1),
    check: () => cell.value,
    excepted: 1,
  },
  {
    caseDesc: "Setting cell value to: 10.",
    first: () => cell.setValue(10),
    check: () => cell.value,
    excepted: 0,
  },
  {
    caseDesc: "Setting cell value to: 'a'",
    first: () => cell.setValue("a"),
    check: () => cell.value,
    excepted: 0,
  },
  {
    caseDesc: "Setting cell value to: '-1'",
    first: () => cell.setValue(-1),
    check: () => cell.value,
    excepted: 0,
  },
  {
    caseDesc: "Setting cell value to: false",
    first: () => cell.setValue(false),
    check: () => cell.value,
    excepted: 0,
  },
  {
    caseDesc: "Setting cell value to: true",
    first: () => cell.setValue(true),
    check: () => cell.value,
    excepted: 0,
  },
  {
    caseDesc: "Setting cell state to given.",
    first: () => cell.setGiven(),
    check: () => cell.given,
    excepted: true,
  },
  {
    caseDesc: "Unsetting cell state to given.",
    first: () => cell.unsetGiven(),
    check: () => cell.given,
    excepted: false,
  },
  {
    caseDesc: "Setting cell state to issued.",
    first: () => cell.setIssued(),
    check: () => cell.issued,
    excepted: true,
  },
  {
    caseDesc: "Unsetting cell state to issued.",
    first: () => cell.unsetIssued(),
    check: () => cell.issued,
    excepted: false,
  },
  {
    caseDesc: "Is the cell filled?",
    first: null,
    check: () => cell.isFilled(),
    excepted: false,
  },
  {
    caseDesc: "Is the cell free?",
    first: null,
    check: () => cell.isUnfilled(),
    excepted: true,
  },
  {
    caseDesc: "Set the cell value to 3, and chacing is the cell filled?",
    first: () => cell.setValue(3),
    check: () => cell.isFilled(),
    excepted: true,
  },
  {
    caseDesc: "Is the cell free?",
    first: null,
    check: () => cell.isUnfilled(),
    excepted: false,
  },
  {
    caseDesc: "Setting a reference",
    first: () => cell.addRef(3),
    check: () => cell.ref,
    excepted: 3,
  },
  {
    caseDesc: "Get valid values",
    first: null,
    check: () => cell.validValues,
    excepted: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    caseDesc: "Get valid possibilities",
    first: null,
    check: () => cell.possibilities,
    excepted: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    caseDesc: "Get valid possibilities",
    first: () => cell.setPossibilities([1]),
    check: () => cell.possibilities,
    excepted: [1],
  },
];

batchAssert(cases, { showFailed: true, showSuccessed: false });
