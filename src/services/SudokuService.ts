import SudokuBoard from '../core/SudokuBoard/SudokuBoard.js';
import SudokuSolver from '../solver/SudokuSolver.js';
import SudokuGenerator from '../generator/SudokuGenerator.js';
import { config } from '../config/index.js';
import { SudokuError } from '../utils/errors.js';
import type { PuzzleFormat, GenerationResult, DifficultyLevel } from '../types.js';

export interface SolveInput {
  puzzle: string | number[] | number[][];
  format?: PuzzleFormat;
  unfilledChar?: string;
}

export interface SolveResult {
  solution: string;
  format: PuzzleFormat;
  durationMs: number;
}

export class SudokuService {
  private getBoard(): SudokuBoard {
    return new SudokuBoard(
      config.get<number>('board.defaultBoxSizeX') ?? 3,
      config.get<number>('board.defaultBoxSizeY') ?? 3
    );
  }

  solve(input: SolveInput): SolveResult {
    const startTime = Date.now();
    const { puzzle, format = 'string', unfilledChar = '.' } = input;

    let puzzleStr: string | undefined;
    if (typeof puzzle === 'string') {
      puzzleStr = puzzle;
    } else if (Array.isArray(puzzle)) {
      if (Array.isArray(puzzle[0])) {
        puzzleStr = (puzzle as number[][]).map(row => row.join(',')).join(',');
      } else {
        puzzleStr = (puzzle as number[]).join(',');
      }
    }

    if (!puzzleStr) {
      throw new SudokuError('Invalid puzzle format', 'VALIDATION_ERROR');
    }

    const board = this.getBoard();
    const solver = new SudokuSolver(board);

    const solution = solver.solvePuzzle({
      puzzle: puzzleStr,
      format,
      unfilledChar,
    });

    if (!solution) {
      throw new SudokuError('Puzzle has no solution', 'NO_SOLUTION');
    }

    const solutionFormatted =
      typeof solution === 'string'
        ? solution
        : Array.isArray(solution) && Array.isArray(solution[0])
          ? (solution as number[][]).map(row => row.join(',')).join(',')
          : (solution as number[]).join(',');

    return {
      solution: solutionFormatted,
      format: 'string',
      durationMs: Date.now() - startTime,
    };
  }

  generate(level: DifficultyLevel): GenerationResult {
    const startTime = Date.now();

    const board = this.getBoard();
    const generator = new SudokuGenerator({ sudokuboard: board });

    const results = generator.generatePuzzle({ level });

    return {
      ...results,
      generationTime: Date.now() - startTime,
    };
  }
}

export const sudokuService = new SudokuService();
