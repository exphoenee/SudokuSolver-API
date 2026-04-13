import SudokuBoard from '../core/SudokuBoard/SudokuBoard.js';
import SudokuSolver from '../solver/SudokuSolver.js';
import { config } from '../config/index.js';
import type {
  GeneratorLevels,
  DifficultyLevel,
  GenerationResult,
  ConfigOptions,
  CellSelector,
} from '../types.js';

export default class SudokuGenerator {
  #sudokuboard: SudokuBoard;
  #boxSizeX: number;
  #boxSizeY: number;
  #solver: SudokuSolver;
  #levels: GeneratorLevels;
  #trialGoalRatio: number;
  #timeout: number;

  constructor(
    {
      sudokuboard,
      boxSizeX,
      boxSizeY,
    }: { sudokuboard?: SudokuBoard; boxSizeX?: number; boxSizeY?: number },
    _options: ConfigOptions = {}
  ) {
    this.#boxSizeX = boxSizeX ?? sudokuboard!.boardSize.boxSizeX;
    this.#boxSizeY = boxSizeY ?? sudokuboard!.boardSize.boxSizeY;
    this.#levels = { ...(config.get('generator.levels') as GeneratorLevels) };
    this.#trialGoalRatio = config.get('generator.trialGoalRatio') as number;
    this.#timeout = config.get('generator.defaultTimeout') as number;
    this.#sudokuboard = new SudokuBoard(this.#boxSizeX, this.#boxSizeY);
    this.#solver = new SudokuSolver(this.#sudokuboard);
  }

  get sudokuboard(): SudokuBoard {
    return this.#sudokuboard;
  }
  get levels(): GeneratorLevels {
    return this.#levels;
  }
  setBoard(puzzle: Parameters<SudokuBoard['setBoard']>[0]): void {
    this.#sudokuboard.setBoard(puzzle);
  }
  clearBoard(): void {
    this.#sudokuboard.clearBoard();
  }
  getFreeCells() {
    return this.#sudokuboard.cells.filter(cell => cell.isUnfilled());
  }
  getCellPossibilities(params: CellSelector) {
    return this.#sudokuboard.getCellPossibilities(params);
  }

  getRandomFreeCell() {
    const freeCells = this.getFreeCells();
    return freeCells[Math.floor(Math.random() * freeCells.length)];
  }

  setCellRandomValue(cell: ReturnType<SudokuBoard['getCell']>): void {
    const possibilities = this.getCellPossibilities({ cell });
    if (possibilities) {
      const value = possibilities[Math.floor(Math.random() * possibilities.length)];
      if (value) cell.setValue(value);
    }
  }

  setRandomCellToRandomValue(): void {
    const cell = this.getRandomFreeCell();
    if (cell) this.setCellRandomValue(cell);
  }

  generatePuzzle({ level = 'easy' }: { level?: DifficultyLevel } = {}): GenerationResult {
    const nrOfCell = this.sudokuboard.cells.length;
    const levelKey = (level ?? 'easy').toLowerCase() as DifficultyLevel;
    const levelValue = (this.#levels[levelKey] ?? 75) as number;
    const nrOfSetFree = Math.floor((nrOfCell * levelValue) / 100);
    const trialGoal = Math.floor(nrOfCell * this.#trialGoalRatio);
    let trialStep = 0;
    let solution: string | false;

    const startTime = performance.now();
    do {
      this.#sudokuboard.clearBoard();
      [...this.#sudokuboard.cells]
        .sort(() => Math.random() - 0.5)
        .slice(0, trialGoal)
        .forEach(cell => this.setCellRandomValue(cell));
      trialStep++;
      solution = this.#solver.solvePuzzle({ format: 'string', timeOut: this.#timeout }) as
        | string
        | false;
    } while (solution === false);

    [...this.#sudokuboard.cells]
      .sort(() => Math.random() - 0.5)
      .slice(0, nrOfSetFree)
      .forEach(cell => cell.setValue(0));

    return {
      puzzle: this.sudokuboard.getCellValues({ format: 'string' }) as string,
      solution: solution as string,
      generationTime: performance.now() - startTime,
      trialStep,
      level: level ?? 'easy',
    };
  }
}
