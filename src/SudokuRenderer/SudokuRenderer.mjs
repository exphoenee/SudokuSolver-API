"use strict";
import SudokuBoard from "../SudokuBoard/SudokuBoard.mjs";
import SudokuSolver from "../SudokuSolver/SudokuSolver.mjs";
import SudokuGenerator from "../SudokuGenerator/SudokuGenerator.mjs";

export default class SudokuRenderer {
  #solver;
  #sudokuboard;
  #boxSizeX;
  #boxSizeY;
  #selectedCell;
  #board;
  #errors;
  #control;
  #numbers;
  #tileSizes;
  #boardSizes;
  #generator;
  #generatorBoard;
  #examples;

  constructor(boxSizeX, boxSizeY, puzzle = null) {
    //using the SudokuBoard calss for handling the sudoku board

    this.#sudokuboard = new SudokuBoard(boxSizeX, boxSizeY, puzzle);
    this.#solver = new SudokuSolver(this.#sudokuboard);
    this.#generator = new SudokuGenerator({ sudokuboard: this.#sudokuboard });

    this.#boxSizeX = boxSizeX;
    this.#boxSizeY = boxSizeY;
    this.#selectedCell = null;

    this.#tileSizes = {
      width: 48,
      height: 48,
      padding: 0,
      margin: 0,
      fontSize: 20,
      boxGap: 5,
    };
    this.#boardSizes = {
      padding: 30,
      width:
        (this.#tileSizes.width + 2) * this.#boxSizeX ** 2 +
        this.#boxSizeX * this.#tileSizes.boxGap +
        2 * 2,
      height:
        (this.#tileSizes.height + 2) * this.#boxSizeY ** 2 +
        this.#boxSizeY * this.#tileSizes.boxGap +
        2 * this.#tileSizes.padding,
    };

    //add some example puzzles here
    //source: https://www.sudokuonline.io/
    this.#examples = {
      Reset: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      Wrong: [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
      ],
      Unsolvable: [
        [0, 1, 2, 3, 4, 5, 6, 7, 8],
        [9, 0, 0, 0, 0, 0, 0, 0, 0],
        [8, 0, 0, 0, 0, 0, 0, 0, 0],
        [7, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      Easy: [
        [1, 0, 0, 0, 0, 7, 0, 0, 3],
        [9, 0, 6, 0, 0, 8, 2, 0, 4],
        [0, 3, 0, 5, 2, 0, 0, 9, 0],
        [3, 9, 0, 0, 0, 1, 5, 0, 0],
        [0, 0, 5, 0, 0, 0, 9, 0, 0],
        [0, 0, 1, 2, 0, 0, 0, 4, 7],
        [0, 2, 0, 0, 6, 5, 0, 1, 0],
        [5, 0, 8, 1, 0, 0, 7, 0, 2],
        [6, 0, 0, 7, 0, 0, 0, 0, 5],
      ],
      Medium: [
        [0, 8, 0, 0, 4, 0, 5, 7, 0],
        [4, 0, 0, 1, 0, 7, 0, 0, 0],
        [5, 0, 0, 0, 9, 0, 0, 0, 0],
        [0, 5, 0, 0, 0, 1, 0, 8, 0],
        [9, 0, 3, 0, 0, 0, 6, 0, 5],
        [0, 6, 0, 5, 0, 0, 0, 9, 0],
        [0, 0, 0, 0, 8, 0, 0, 0, 3],
        [0, 0, 0, 4, 0, 6, 0, 0, 8],
        [0, 1, 2, 0, 3, 0, 0, 6, 0],
      ],
      Hard: [
        [0, 0, 0, 4, 0, 5, 8, 9, 0],
        [0, 0, 0, 0, 0, 0, 5, 0, 0],
        [0, 2, 0, 0, 0, 3, 7, 0, 0],
        [8, 0, 0, 0, 5, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 7, 0, 3, 0],
        [5, 0, 0, 0, 2, 0, 6, 1, 0],
        [4, 0, 0, 0, 0, 2, 0, 0, 0],
        [3, 9, 0, 0, 0, 1, 0, 0, 0],
        [0, 7, 0, 0, 0, 0, 0, 0, 0],
      ],
      Evil: [
        [0, 4, 0, 2, 0, 0, 0, 7, 0],
        [3, 9, 0, 0, 0, 7, 0, 8, 1],
        [7, 0, 6, 0, 0, 1, 4, 0, 2],
        [0, 0, 0, 0, 0, 0, 3, 0, 9],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [6, 0, 7, 0, 0, 0, 0, 0, 0],
        [1, 0, 4, 3, 0, 0, 8, 0, 5],
        [2, 6, 0, 1, 0, 0, 0, 3, 7],
        [0, 8, 0, 0, 0, 2, 0, 6, 0],
      ],
    };
    //rendering the table
    this.#render();
  }

  get examples() {
    return this.#examples;
  }

  /* getting all values from the UI inputs
    return: a 2D array what is given by the user */
  extractInputs() {
    this.#sudokuboard.setBoard(
      this.#sudokuboard.cells.map((cell) => +cell.ref.value)
    );
  }

  /* solving the board SudokuBoard */
  solve() {
    const solution = this.#solver.solvePuzzle();
    if (solution) {
      this.#sudokuboard.setBoard(solution, false);
    } else {
      this.#userMsg("This puzzle does not has a solution!", "error");
    }
  }

  /**************************/
  /* UI inputs manipulation */
  /**************************/

  /* updateing the UI with a puzzle or solution
    arg:    puzzle n x n sized 2D array
    return: a boolean true means the column doesn't has duplicates */
  updateUICells() {
    this.#sudokuboard.cells.forEach(
      (cell) => (cell.ref.value = +cell.value || "")
    );

    this.upadateCells();
  }

  /* the method updating the SudokuBoard according to the UI input value
      arg:    e Event,
      return: undefined */
  updateUICell(e) {
    e.preventDefault();

    const [x, y, value] = [
      +e.target.dataset.col,
      +e.target.dataset.row,
      +e.target.value,
    ];
    const cell = this.#sudokuboard.getCell(x, y);
    const { min, max, unfilled } = cell.accepted;
    try {
      this.#sudokuboard.setCellValue({ x, y }, value || unfilled);
    } catch {
      this.#userMsgTemporary({
        text: `Wrong value! You gave ${value}, but it must be between ${min}...${max}!`,
        delay: 2000,
      });
    }
    e.target.value = cell.value !== unfilled ? cell.value : "";

    this.upadateCells();
  }

  /* all the issued cells gets the issued class and style */
  upadateCells() {
    this.#sudokuboard.cells.forEach((cell) => this.#setCellStyle(cell));
  }

  /* setting the HTML element classes end style of the cell HTML element
  arg:      cell (object)
  return:   undefined */
  #setCellStyle(cell) {
    cell.issued
      ? cell.ref.classList.add("issue")
      : cell.ref.classList.remove("issue");
    cell.given
      ? cell.ref.classList.add("given")
      : cell.ref.classList.remove("given");
    cell.ref.disabled = cell.given;
  }

  /****************/
  /* non-React UI */
  /****************/

  /* throw a message
   * first argument is the text,
   * the second object has one properties:
   ** alert, gives allert as well, and
   ** the type of the print to console. */
  #userMsg(text, type = "none") {
    this.#errors.innerHTML = text;
    const alerting = {
      alert: () => alert(text),
      log: () => console[type](text),
      error: () => console[type](text),
      none: () => null,
    };
    alerting[type]();
  }

  /* throw a message
   * first argument is the text,
   * the second object has one properties:
   ** alert, gives allert as well, and
   ** the type of the print to console. */
  #userMsgTemporary(
    { text, prevMsg, delay, type } = {
      delay: 1500,
      type: "none",
    }
  ) {
    if (this.userMessageTimeout) {
      clearTimeout(this.userMessageTimeout);
    } else if (!prevMsg) this.prevMsg = this.#errors.innerHTML;
    this.#userMsg(text);
    this.userMessageTimeout = setTimeout(
      () => this.#userMsg(this.prevMsg, type),
      delay
    );
  }

  /* rendering the entire table from the SudokuBoard */
  #render() {
    // if it is once rendered then should be saved to the class

    /* main div */
    this.app = document.getElementById("app");

    //HTML element of the board
    this.#board = this.#createContainer("board", this.app);
    this.#addSizes(this.#board, this.#boardSizes);

    this.#errors = this.#createContainer("errors", this.app);
    this.#numbers = this.#createContainer("numbers", this.app);
    this.#control = this.#createContainer("control", this.app);
    this.#generatorBoard = this.#createContainer("generator", this.app);
    this.#userMsg("Let's solve this puzzle!");

    this.#sudokuboard.getAllRows().forEach((row) => this.#renderRow(row));

    this.#renderExamples();

    this.#sudokuGeneratorBoard();

    this.#renderButton(
      "Solve!",
      () => {
        this.#userMsg("...solving...");
        this.extractInputs();
        this.solve();
        this.updateUICells();
      },
      this.#control
    );

    this.#renderNumbers();
  }

  #createContainer(id, parent) {
    const element = document.createElement("div");
    element.id = id;
    parent.appendChild(element);
    return element;
  }

  /* rendering the inputs */
  #renderNumbers() {
    for (let num = 1; num <= this.#boxSizeX * this.#boxSizeY; num++) {
      const numButton = document.createElement("button");
      this.#numbers.appendChild(numButton);

      numButton.textContent = num;
      numButton.classList.add("num");

      numButton.addEventListener("click", (e) => {
        if (this.#selectedCell) {
          this.#selectedCell.ref.value = num;
          this.#sudokuboard.setCellValue({ cell: this.#selectedCell }, num);
          this.updateUICells();
        }
      });
    }
  }

  /* rendering the rows, the only div and iterating throught the cells of each
      arg:    Batch (object)
      return: undefined */
  #renderRow(row) {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add(`row`);
    rowContainer.classList.add(`nr-${row.id}`);
    this.#board.appendChild(rowContainer);
    row.cells.forEach((cellInfo) => {
      this.#createInput(cellInfo, rowContainer);
    });
  }

  #addSizes(dom, styles) {
    return Object.entries(styles).forEach(
      ([key, value]) => (dom.style[key] = `${value}px`)
    );
  }

  /* generating the DOM of a cell input, the arguments are the following:
      arg:    cellInfo Cell (object)
              parent: the DOM element who is the parent of the input (cell)
      return: undefined */
  #createInput(cellInfo, parent) {
    const cellDOM = document.createElement("input");
    cellDOM.type = "number";
    cellDOM.step = 1;
    cellDOM.min = cellInfo.accepted.min;
    cellDOM.max = cellInfo.accepted.max;
    cellDOM.id = cellInfo.id;
    cellDOM.classList.add("tile");
    this.#addSizes(cellDOM, this.#tileSizes);
    cellDOM.dataset.row = cellInfo.y;
    cellDOM.dataset.col = cellInfo.x;
    cellDOM.dataset.box = cellInfo.boxId;
    if (
      (cellInfo.x + 1) % this.#boxSizeX === 0 &&
      cellInfo.x + 1 !== this.#boxSizeX ** 2
    ) {
      cellDOM.style.marginRight = `${this.#tileSizes.boxGap}px`;
    }
    if (
      (cellInfo.y + 1) % this.#boxSizeY === 0 &&
      cellInfo.x + 1 !== this.#boxSizeY ** 2
    ) {
      cellDOM.style.marginBottom = `${this.#tileSizes.boxGap}px`;
    }
    cellDOM.addEventListener("click", (e) => {
      this.#sudokuboard.cells.forEach((cell) => {
        cell.ref.classList.remove("selected");
      });
      cellDOM.classList.add("selected");
      this.#selectedCell = cellInfo;
    });
    cellDOM.addEventListener("change", (e) => this.updateUICell(e));
    parent.appendChild(cellDOM);
    cellInfo.addRef(cellDOM);
  }

  #sudokuGeneratorBoard() {
    Object.keys(this.#generator.levels).map((level) => {
      this.#renderButton(
        "Generate a random " + level + " level",
        () => {
          const { puzzle, generationTime } = this.#generator.generatePuzzle({
            level,
          });
          this.#sudokuboard.setBoard(puzzle, true);
          this.updateUICells();
          this.#userMsgTemporary({
            text: `Generated a ${level} level puzzle! That tooked only ${
              Math.round(generationTime / 100) / 10
            } seconds!`,
            delay: 2000,
          });
        },
        this.#generatorBoard
      );
    });
  }

  #renderExamples() {
    for (let puzzle in this.examples) {
      this.#renderButton(
        puzzle + " example",
        () => {
          this.#sudokuboard.setBoard(this.examples[puzzle], true);
          this.updateUICells();
          this.#userMsgTemporary({
            text: `Puzzle changed to ${puzzle}!`,
            delay: 2000,
          });
        },
        this.#control
      );
    }
  }

  /* buttons for the contorl panel, the arguments are the following:
    text  -> text of the button
    cb -> the callback function what is fired when the button is clicked */
  #renderButton(text, cb, parent) {
    const button = document.createElement("button");
    button.innerText = text;
    button.addEventListener("click", () => {
      cb();
    });
    parent.appendChild(button);
  }
}
