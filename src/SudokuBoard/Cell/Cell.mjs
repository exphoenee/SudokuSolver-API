"use strict";

/* this class describes the cell
 * x and y coordinate,
 * id of the cell,
 * boxId this is the id of the box, where the cell will placed
 * bx and by coordinate inside the box, maybe that is not neccessary,
 * accepted, what kind of values are accepted:
 ** min is the minimum value
 ** max is the maximum value
 ** unfilled value is that value what means the cell is unfilled
 * given, the cell has an initial value or not
 * issued, the cell has an issue or not */
export default class Cell {
  #given;
  #issued;
  #value;
  #x;
  #y;
  #bx;
  #by;
  #id;
  #boxId;
  #accepted;
  #reference;
  #possibilities;
  #validValues;
  #warnings;
  #errors;

  constructor(
    { x, y, bx, by, id, boxId, value, accepted, given, issued, reference },
    { warnings, errors } = { warnings: false, errors: false }
  ) {
    this.#x = x;
    this.#y = y;
    this.#bx = bx;
    this.#id = id;
    this.#boxId = boxId;
    this.#by = by;
    this.#accepted = accepted;
    this.#value = accepted.unfilled;
    this.#given = given || false;
    this.#issued = issued || false;
    this.#reference = reference || null;
    this.#validValues = Array.from(
      { length: accepted.max },
      (_, i) => i + accepted.min
    );
    this.#possibilities = this.#validValues;
    this.#warnings = warnings;
    this.#errors = errors;
    return this;
  }

  get x() {
    return this.#x;
  }
  get y() {
    return this.#y;
  }
  get bx() {
    return this.#bx;
  }
  get by() {
    return this.#by;
  }
  get id() {
    return this.#id;
  }
  get boxId() {
    return this.#boxId;
  }
  get value() {
    return this.#value;
  }
  get validValues() {
    return this.#validValues;
  }
  get possibilities() {
    return this.#possibilities;
  }
  setPossibilities(possibilities) {
    this.#possibilities = possibilities;
  }

  /* gives all the properties of a cell for debuging purpose made */
  get info() {
    return {
      id: this.#id,
      given: this.#given,
      issued: this.#issued,
      value: this.#value,
      x: this.#x,
      y: this.#y,
      bx: this.#bx,
      by: this.#by,
      id: this.#id,
      boxId: this.#boxId,
      accepted: this.#accepted,
    };
  }

  /* Validating the value of a cell
    arg:    value,
    return: true if the value is correct */
  validateValue(value) {
    return (
      (value >= this.#accepted.min && value <= this.#accepted.max) ||
      value === this.#accepted.unfilled
    );
  }

  /* sets and checks the value of a cell if the values is wrong, sets to unfilled
  arg:    newValue (integer)
  retrun: void (undefined) */
  setValue(newValue) {
    if (typeof newValue == "number") {
      if (this.validateValue(newValue)) {
        this.#value = newValue;
      } else {
        this.#value = this.#accepted.unfilled;
        this.#errors &&
          console.error(
            `Valid cell value is between: ${this.#accepted.min} - ${
              this.#accepted.max
            }, value: ${
              this.#accepted.unfilled
            } is allowed for unfilled cells.\nYou tried to set value: ${newValue}, for cell(x=${
              this.#x
            }, y=${this.y}) but value set to: ${
              this.#accepted.unfilled
            }, because of this issue.`
          );
      }
    } else {
      this.#errors && console.error("Set value must be a number!");
    }
  }

  get given() {
    return this.#given;
  }

  /* sets a cell to given state, that means it coouldn't be changed by the user
    arg:     null
    returns: undefined */
  setGiven() {
    this.#given = true;
  }

  /* sets a cell to given state, that means it coouldn't be changed by the user
    arg:     null
    returns: undefined */
  unsetGiven() {
    this.#given = false;
  }

  /* gives back the cell issued state */
  get issued() {
    return this.#issued;
  }

  /* sets the cell to issued state */
  setIssued() {
    this.#issued = true;
  }

  /* sets the cell to unissued state */
  unsetIssued() {
    this.#issued = false;
  }

  /* gives the values what can the cell accept
  arg:    null
  retrun: Object {min, max, unfilled}
    ** min is the minimum value
    ** max is the maximum value
    ** unfilled value is that value what means the cell is unfilled */
  get accepted() {
    return this.#accepted;
  }

  /* gives info about that the cell is filled
  arg:    null
  return: boolean true if the cell has other values as an unfilled */
  isFilled() {
    return this.value !== this.accepted.unfilled;
  }

  /* gives info about that the cell is free
  arg:    null
  return: boolean true if the cell has same values as an unfilled */
  isUnfilled() {
    return this.#value === this.accepted.unfilled;
  }

  /* the cell can store an external reference also */
  get ref() {
    return this.#reference;
  }

  addRef(ref) {
    this.#reference = ref;
  }
}
