/**
 * @fileoverview Input validation for SudokuSolver-API
 * @module utils/validation
 */

import { ValidationError, type ValidationErrorDetail } from './errors.js';

const VALID_FORMATS = ['string', '1D', '2D'];
const VALID_LEVELS = ['easy', 'medium', 'hard', 'evil'];

export function validatePuzzle(puzzle: unknown): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];

  if (!puzzle) {
    errors.push({ field: 'puzzle', message: 'Puzzle is required' });
    return errors;
  }

  if (typeof puzzle === 'string') {
    const values = puzzle.split(',').map(v => v.trim());
    if (values.length !== 81) {
      errors.push({
        field: 'puzzle',
        message: `String puzzle must have 81 values, got ${values.length}`,
      });
    }
    if (!values.every(v => /^[0-9.]$/.test(v))) {
      errors.push({
        field: 'puzzle',
        message: 'String puzzle must contain only digits 0-9 and dots',
      });
    }
  } else if (Array.isArray(puzzle)) {
    if (puzzle.length === 81) {
      if (!puzzle.every(v => typeof v === 'number' && v >= 0 && v <= 9)) {
        errors.push({ field: 'puzzle', message: '1D array must contain only numbers 0-9' });
      }
    } else if (puzzle.length === 9 && puzzle.every(row => Array.isArray(row))) {
      if (!puzzle.every(row => row.length === 9)) {
        errors.push({ field: 'puzzle', message: '2D array must be 9x9' });
      }
      if (!puzzle.flat().every(v => typeof v === 'number' && v >= 0 && v <= 9)) {
        errors.push({ field: 'puzzle', message: '2D array must contain only numbers 0-9' });
      }
    } else {
      errors.push({ field: 'puzzle', message: 'Array must be 1D (81 elements) or 2D (9x9)' });
    }
  } else {
    errors.push({ field: 'puzzle', message: 'Puzzle must be a string, 1D array, or 2D array' });
  }

  return errors;
}

export function validateFormat(format: unknown): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];

  if (format && typeof format === 'string' && !VALID_FORMATS.includes(format.toLowerCase())) {
    errors.push({
      field: 'format',
      message: `Invalid format "${format}". Must be one of: ${VALID_FORMATS.join(', ')}`,
    });
  }

  return errors;
}

export function validateLevel(level: unknown): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];

  if (!level) {
    errors.push({ field: 'level', message: 'Level is required' });
    return errors;
  }

  if (typeof level === 'string' && !VALID_LEVELS.includes(level.toLowerCase())) {
    errors.push({
      field: 'level',
      message: `Invalid level "${level}". Must be one of: ${VALID_LEVELS.join(', ')}`,
    });
  }

  return errors;
}

export function validateSolveRequest(body: {
  puzzle?: unknown;
  format?: unknown;
  unfilledChar?: unknown;
}): ValidationErrorDetail[] {
  const errors = [...validatePuzzle(body.puzzle), ...validateFormat(body.format)];

  if (body.unfilledChar && typeof body.unfilledChar !== 'string') {
    errors.push({ field: 'unfilledChar', message: 'Unfilled character must be a string' });
  }

  return errors;
}

export function validateGenerateRequest(params: { level?: unknown }): ValidationErrorDetail[] {
  return validateLevel(params.level);
}

export function throwIfErrors(errors: ValidationErrorDetail[]): void {
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}
