/**
 * @fileoverview Shared type definitions for SudokuSolver-API
 * @module types
 */

export type CellValue = number;

export interface CellAccepted {
  unfilled: CellValue;
  min: CellValue;
  max: CellValue;
}

export interface CellInfo {
  id: number;
  given: boolean;
  issued: boolean;
  value: CellValue;
  x: number;
  y: number;
  bx: number;
  by: number;
  boxId: number;
  accepted: CellAccepted;
}

export interface BoardSize {
  x: number;
  y: number;
  boxSizeX: number;
  boxSizeY: number;
}

export type PuzzleFormat = 'string' | '1D' | '2D';

export type PuzzleInput = number[][] | number[] | string;

export interface TileSizes {
  width: number;
  height: number;
  padding: number;
  margin: number;
  fontSize: number;
  boxGap: number;
  [key: string]: number;
}

export interface BoardSizes {
  padding: number;
  width: number;
  height: number;
  [key: string]: number;
}

export interface CellParams {
  x: number;
  y: number;
  bx: number;
  by: number;
  id: number;
  boxId: number;
  accepted: CellAccepted;
  given?: boolean;
  issued?: boolean;
  reference?: unknown;
}

export interface CellSelector {
  x?: number;
  y?: number;
  cell?: unknown;
  id?: number;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'evil';

export interface GeneratorLevels {
  easy: number;
  medium: number;
  hard: number;
  evil: number;
  default?: number;
}

export interface GenerationResult {
  puzzle: string;
  solution: string;
  generationTime: number;
  trialStep: number;
  level: string;
}

export interface ConfigOptions {
  warnings?: boolean;
  errors?: boolean;
}
