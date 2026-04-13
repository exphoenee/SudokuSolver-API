import SudokuBoard from '../core/SudokuBoard/SudokuBoard.js';
import SudokuSolver from '../solver/SudokuSolver.js';
import SudokuGenerator from '../generator/SudokuGenerator.js';
import type { TileSizes, BoardSizes } from '../types.js';

interface Examples {
  [key: string]: number[][];
}

export default class SudokuRenderer {
  #solver: SudokuSolver;
  #sudokuboard: SudokuBoard;
  #boxSizeX: number;
  #boxSizeY: number;
  #selectedCell: unknown;
  #board!: HTMLElement;
  #errors!: HTMLElement;
  #control!: HTMLElement;
  #numbers!: HTMLElement;
  #tileSizes: TileSizes;
  #boardSizes: BoardSizes;
  #generator: SudokuGenerator;
  #generatorBoard!: HTMLElement;
  #examples: Examples;
  app!: HTMLElement | null;
  prevMsg: string = '';
  userMessageTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(boxSizeX: number, boxSizeY: number, puzzle: number[][] | null = null) {
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

    this.#render();
  }

  get examples(): Examples {
    return this.#examples;
  }

  extractInputs(): void {
    this.#sudokuboard.setBoard(
      this.#sudokuboard.cells.map((cell: unknown) => +(cell as { ref: HTMLInputElement }).ref.value)
    );
  }

  solve(): void {
    const solution = this.#solver.solvePuzzle();
    if (solution) {
      this.#sudokuboard.setBoard(solution, false);
    } else {
      this.#userMsg('This puzzle does not has a solution!', 'error');
    }
  }

  updateUICells(): void {
    this.#sudokuboard.cells.forEach((cell: unknown) => {
      const c = cell as { ref: HTMLInputElement; value: number };
      c.ref.value = c.value ? String(c.value) : '';
    });
    this.upadateCells();
  }

  updateUICell(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const x = +target.dataset.col!;
    const y = +target.dataset.row!;
    const value = +target.value;

    const cell = this.#sudokuboard.getCell({ x, y });
    const { min, max, unfilled } = cell.accepted;

    try {
      this.#sudokuboard.setCellValue({ x, y }, value || unfilled);
    } catch {
      this.#userMsgTemporary({
        text: `Wrong value! You gave ${value}, but it must be between ${min}...${max}!`,
        delay: 2000,
      });
    }

    target.value = cell.value !== unfilled ? String(cell.value) : '';
    this.upadateCells();
  }

  upadateCells(): void {
    this.#sudokuboard.cells.forEach((cell: unknown) =>
      this.#setCellStyle(cell as { issued: boolean; given: boolean; ref: HTMLInputElement })
    );
  }

  #setCellStyle(cell: { issued: boolean; given: boolean; ref: HTMLInputElement }): void {
    if (cell.issued) {
      cell.ref.classList.add('issue');
    } else {
      cell.ref.classList.remove('issue');
    }

    if (cell.given) {
      cell.ref.classList.add('given');
    } else {
      cell.ref.classList.remove('given');
    }

    cell.ref.disabled = cell.given;
  }

  #userMsg(text: string, type: 'none' | 'log' | 'error' = 'none'): void {
    this.#errors.innerHTML = text;

    const alerting: Record<string, () => void> = {
      alert: () => alert(text),
      log: () => console.log(text),
      error: () => console.error(text),
      none: () => null,
    };

    alerting[type]();
  }

  #userMsgTemporary(
    {
      text = '',
      prevMsg,
      delay = 1500,
      type = 'none',
    }: {
      text?: string;
      prevMsg?: string;
      delay?: number;
      type?: 'none' | 'log' | 'error';
    } = {
      delay: 1500,
      type: 'none',
    }
  ): void {
    if (this.userMessageTimeout) {
      clearTimeout(this.userMessageTimeout);
    } else if (!prevMsg) {
      this.prevMsg = this.#errors.innerHTML;
    }
    this.#userMsg(text);
    this.userMessageTimeout = setTimeout(() => this.#userMsg(this.prevMsg, type), delay);
  }

  #render(): void {
    this.app = document.getElementById('app');

    this.#board = this.#createContainer('board', this.app);
    this.#addSizes(this.#board, this.#boardSizes);

    this.#errors = this.#createContainer('errors', this.app);
    this.#numbers = this.#createContainer('numbers', this.app);
    this.#control = this.#createContainer('control', this.app);
    this.#generatorBoard = this.#createContainer('generator', this.app);
    this.#userMsg("Let's solve this puzzle!");

    this.#sudokuboard.getAllRows().forEach(row => this.#renderRow(row));

    this.#renderExamples();
    this.#sudokuGeneratorBoard();

    this.#renderButton(
      'Solve!',
      () => {
        this.#userMsg('...solving...');
        this.extractInputs();
        this.solve();
        this.updateUICells();
      },
      this.#control
    );

    this.#renderNumbers();
  }

  #createContainer(id: string, parent: HTMLElement | null): HTMLElement {
    const element = document.createElement('div');
    element.id = id;
    if (parent) {
      parent.appendChild(element);
    }
    return element;
  }

  #renderNumbers(): void {
    for (let num = 1; num <= this.#boxSizeX * this.#boxSizeY; num++) {
      const numButton = document.createElement('button');
      this.#numbers.appendChild(numButton);

      numButton.textContent = String(num);
      numButton.classList.add('num');

      numButton.addEventListener('click', () => {
        if (this.#selectedCell) {
          const selectedCell = this.#selectedCell as { ref: HTMLInputElement };
          selectedCell.ref.value = String(num);
          this.#sudokuboard.setCellValue({ cell: this.#selectedCell }, num);
          this.updateUICells();
        }
      });
    }
  }

  #renderRow(row: { id: number; cells: unknown[] }): void {
    const rowContainer = document.createElement('div');
    rowContainer.classList.add('row');
    rowContainer.classList.add(`nr-${row.id}`);
    this.#board.appendChild(rowContainer);

    row.cells.forEach(cellInfo => {
      this.#createInput(
        cellInfo as {
          accepted: { min: number; max: number };
          id: string;
          x: number;
          y: number;
          boxId: number;
          addRef: (el: HTMLInputElement) => void;
        },
        rowContainer
      );
    });
  }

  #addSizes(dom: HTMLElement, styles: Record<string, number>): void {
    Object.entries(styles).forEach(([key, value]) => {
      dom.style.setProperty(key, `${value}px`);
    });
  }

  #createInput(
    cellInfo: {
      accepted: { min: number; max: number };
      id: string;
      x: number;
      y: number;
      boxId: number;
      addRef: (el: HTMLInputElement) => void;
    },
    parent: HTMLElement
  ): void {
    const cellDOM = document.createElement('input');
    cellDOM.type = 'number';
    cellDOM.step = '1';
    cellDOM.min = String(cellInfo.accepted.min);
    cellDOM.max = String(cellInfo.accepted.max);
    cellDOM.id = cellInfo.id;
    cellDOM.classList.add('tile');
    this.#addSizes(cellDOM, this.#tileSizes);
    cellDOM.dataset.row = String(cellInfo.y);
    cellDOM.dataset.col = String(cellInfo.x);
    cellDOM.dataset.box = String(cellInfo.boxId);

    if ((cellInfo.x + 1) % this.#boxSizeX === 0 && cellInfo.x + 1 !== this.#boxSizeX ** 2) {
      cellDOM.style.marginRight = `${this.#tileSizes.boxGap}px`;
    }

    if ((cellInfo.y + 1) % this.#boxSizeY === 0 && cellInfo.x + 1 !== this.#boxSizeY ** 2) {
      cellDOM.style.marginBottom = `${this.#tileSizes.boxGap}px`;
    }

    cellDOM.addEventListener('click', () => {
      this.#sudokuboard.cells.forEach((cell: unknown) => {
        (cell as { ref: HTMLInputElement }).ref.classList.remove('selected');
      });
      cellDOM.classList.add('selected');
      this.#selectedCell = cellInfo;
    });

    cellDOM.addEventListener('change', e => this.updateUICell(e));
    parent.appendChild(cellDOM);
    cellInfo.addRef(cellDOM);
  }

  #sudokuGeneratorBoard(): void {
    Object.keys(this.#generator.levels).forEach(level => {
      this.#renderButton(
        'Generate a random ' + level + ' level',
        () => {
          const result = this.#generator.generatePuzzle({
            level: level as 'easy' | 'medium' | 'hard' | 'evil',
          });
          this.#sudokuboard.setBoard(result.puzzle, true);
          this.updateUICells();
          this.#userMsgTemporary({
            text: `Generated a ${level} level puzzle! That tooked only ${Math.round(result.generationTime / 100) / 10} seconds!`,
            delay: 2000,
          });
        },
        this.#generatorBoard
      );
    });
  }

  #renderExamples(): void {
    for (const puzzle in this.examples) {
      this.#renderButton(
        puzzle + ' example',
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

  #renderButton(text: string, cb: () => void, parent: HTMLElement): void {
    const button = document.createElement('button');
    button.innerText = text;
    button.addEventListener('click', () => {
      cb();
    });
    parent.appendChild(button);
  }
}
