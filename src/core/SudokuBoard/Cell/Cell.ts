import type { CellParams, CellValue, CellInfo, CellAccepted } from '../../../types.js';

/**
 * @fileoverview Cell - Represents a single cell in a Sudoku board
 * @module core/SudokuBoard/Cell
 */

export default class Cell {
  #given: boolean;
  #issued: boolean;
  #value: CellValue;
  #x: number;
  #y: number;
  #bx: number;
  #by: number;
  #id: number;
  #boxId: number;
  #accepted: CellAccepted;
  #reference: unknown;
  #possibilities: CellValue[];
  #validValues: CellValue[];

  constructor(
    { x, y, bx, by, id, boxId, accepted, given, issued, reference }: CellParams,
    _options = {}
  ) {
    this.#x = x;
    this.#y = y;
    this.#bx = bx;
    this.#id = id;
    this.#boxId = boxId;
    this.#by = by;
    this.#accepted = accepted;
    this.#value = accepted.unfilled;
    this.#given = given ?? false;
    this.#issued = issued ?? false;
    this.#reference = reference ?? null;
    this.#validValues = Array.from({ length: accepted.max }, (_, i) => i + accepted.min);
    this.#possibilities = [...this.#validValues];
  }

  get x(): number {
    return this.#x;
  }
  get y(): number {
    return this.#y;
  }
  get bx(): number {
    return this.#bx;
  }
  get by(): number {
    return this.#by;
  }
  get id(): number {
    return this.#id;
  }
  get boxId(): number {
    return this.#boxId;
  }
  get value(): CellValue {
    return this.#value;
  }
  get validValues(): CellValue[] {
    return this.#validValues;
  }
  get possibilities(): CellValue[] {
    return this.#possibilities;
  }

  setPossibilities(possibilities: CellValue[]): void {
    this.#possibilities = possibilities;
  }

  get info(): CellInfo {
    return {
      id: this.#id,
      given: this.#given,
      issued: this.#issued,
      value: this.#value,
      x: this.#x,
      y: this.#y,
      bx: this.#bx,
      by: this.#by,
      boxId: this.#boxId,
      accepted: this.#accepted,
    };
  }

  validateValue(value: CellValue): boolean {
    return (
      (value >= this.#accepted.min && value <= this.#accepted.max) ||
      value === this.#accepted.unfilled
    );
  }

  setValue(newValue: CellValue): void {
    if (typeof newValue === 'number' && this.validateValue(newValue)) {
      this.#value = newValue;
    } else {
      this.#value = this.#accepted.unfilled;
    }
  }

  get given(): boolean {
    return this.#given;
  }
  setGiven(): void {
    this.#given = true;
  }
  unsetGiven(): void {
    this.#given = false;
  }
  get issued(): boolean {
    return this.#issued;
  }
  setIssued(): void {
    this.#issued = true;
  }
  unsetIssued(): void {
    this.#issued = false;
  }
  get accepted(): CellAccepted {
    return this.#accepted;
  }

  isFilled(): boolean {
    return this.value !== this.accepted.unfilled;
  }

  isUnfilled(): boolean {
    return this.#value === this.accepted.unfilled;
  }

  get ref(): unknown {
    return this.#reference;
  }
  addRef(ref: unknown): void {
    this.#reference = ref;
  }
}
