/**
 * @fileoverview Custom error classes for SudokuSolver-API
 * @module utils/errors
 */

export class SudokuError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'SudokuError';
    this.code = code;
  }
}

export class InvalidPuzzleError extends SudokuError {
  constructor(message = 'Invalid puzzle format') {
    super(message, 'INVALID_PUZZLE');
    this.name = 'InvalidPuzzleError';
  }
}

export class InvalidCellValueError extends SudokuError {
  constructor(value, min, max) {
    super(`Invalid cell value: ${value}. Must be between ${min} and ${max}`, 'INVALID_CELL_VALUE');
    this.name = 'InvalidCellValueError';
    this.value = value;
    this.min = min;
    this.max = max;
  }
}

export class InvalidCoordinatesError extends SudokuError {
  constructor(x, y, maxX, maxY) {
    super(
      `Invalid coordinates: (${x}, ${y}). Must be within [0, ${maxX}] x [0, ${maxY}]`,
      'INVALID_COORDINATES'
    );
    this.name = 'InvalidCoordinatesError';
  }
}

export class UnsolvablePuzzleError extends SudokuError {
  constructor() {
    super('Puzzle has no solution', 'UNSOLVABLE_PUZZLE');
    this.name = 'UnsolvablePuzzleError';
  }
}

export class SolverTimeoutError extends SudokuError {
  constructor(timeoutMs) {
    super(`Solver timed out after ${timeoutMs}ms`, 'SOLVER_TIMEOUT');
    this.name = 'SolverTimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

export class InvalidDifficultyError extends SudokuError {
  constructor(level, validLevels) {
    super(
      `Invalid difficulty level: "${level}". Must be one of: ${validLevels.join(', ')}`,
      'INVALID_DIFFICULTY'
    );
    this.name = 'InvalidDifficultyError';
    this.level = level;
    this.validLevels = validLevels;
  }
}

export class ValidationError extends SudokuError {
  constructor(errors) {
    super('Validation failed', 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}
