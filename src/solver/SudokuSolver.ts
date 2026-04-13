import SudokuBoard from '../core/SudokuBoard/SudokuBoard.js';
import type { PuzzleInput, PuzzleFormat, ConfigOptions } from '../types.js';

export default class SudokuSolver {
  #sudokuboard: SudokuBoard;
  #boxSizeX: number;
  #boxSizeY: number;
  #startTime: number = 0;
  #timeOut: number | false = 0;
  #warnings: boolean;

  constructor(sudokuboard: SudokuBoard, { warnings = false }: ConfigOptions = {}) {
    this.#boxSizeX = sudokuboard.boardSize.boxSizeX;
    this.#boxSizeY = sudokuboard.boardSize.boxSizeY;
    this.#warnings = warnings;
    this.#sudokuboard = sudokuboard;
  }

  get sudokuboard(): SudokuBoard {
    return this.#sudokuboard;
  }
  setBoard(puzzle: PuzzleInput): void {
    this.#sudokuboard.setBoard(puzzle);
  }
  clearBoard(): void {
    this.#sudokuboard.clearBoard();
  }

  solvePuzzle({
    puzzle,
    format = '2D',
    unfilledChar = '.',
    timeOut = 0,
    warnings = false,
  }: {
    puzzle?: PuzzleInput;
    format?: PuzzleFormat;
    unfilledChar?: string;
    timeOut?: number;
    warnings?: boolean;
  } = {}): PuzzleInput | false {
    if (puzzle) this.#sudokuboard.setBoard(puzzle);
    this.#timeOut = timeOut || 0;
    if (timeOut) this.#startTime = performance.now();
    if (this.#sudokuboard.puzzleIsCorrect()) {
      const result = this.#solve({ warnings });
      return result ? this.convertPuzzle(result, format, unfilledChar) : false;
    }
    return false;
  }

  #solve({ warnings = false }: { warnings?: boolean } = {}): unknown {
    if (this.#timeOut && performance.now() - this.#startTime > this.#timeOut) {
      (this.#warnings || warnings) && console.warn('Solver timed out!');
      return false;
    }
    const coords = this.#sudokuboard.coordsOfFirstFreeCell();
    if (!coords) return this.#sudokuboard.getCellValues({ format: '2D' });
    return this.#checkPossibilities(this.#getPossibilities());
  }

  #createTemporaryBoard(puzzle: unknown): SudokuBoard {
    return new SudokuBoard(this.#boxSizeX, this.#boxSizeY, puzzle as PuzzleInput);
  }

  convertPuzzle(puzzle: unknown, format: PuzzleFormat = '2D', unfilledChar = '0'): PuzzleInput {
    return this.#createTemporaryBoard(puzzle).getCellValues({
      format,
      unfilledChar,
    }) as PuzzleInput;
  }

  #getPossibilities(): SudokuBoard[] | false {
    const nextCell = this.#sudokuboard.getFreeCellWithLeastPossibilities();
    if (nextCell) {
      const posNums = this.#sudokuboard.getCellPossibilities(nextCell);
      return posNums
        .map(nr => {
          const temp = new SudokuBoard(this.#boxSizeX, this.#boxSizeY);
          temp.setBoard(this.#sudokuboard.getCellValues());
          temp.setCellValue({ x: nextCell.x, y: nextCell.y }, nr);
          return temp;
        })
        .filter(puzzle => puzzle.puzzleIsCorrect());
    }
    return false;
  }

  #checkPossibilities(possibilities: SudokuBoard[] | false): SudokuBoard | false {
    if (Array.isArray(possibilities) && possibilities.length > 0) {
      const possibility = possibilities.shift()!;
      this.#sudokuboard.setBoard(possibility.getCellValues({ format: '2D' }));
      const result = this.#solve({});
      return result ? (result as SudokuBoard) : this.#checkPossibilities(possibilities);
    }
    return false;
  }
}
