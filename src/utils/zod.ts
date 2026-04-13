import { z } from 'zod';

const puzzleStringSchema = z
  .string()
  .regex(/^([0-9.],){80}[0-9.]$/, 'String puzzle must have 81 comma-separated values');

const puzzle1DSchema = z
  .array(z.number().min(0).max(9))
  .length(81, '1D array must have 81 elements');

const puzzle2DSchema = z
  .array(z.array(z.number().min(0).max(9)).length(9))
  .length(9, '2D array must be 9x9');

const puzzleSchema = z.union([puzzleStringSchema, puzzle1DSchema, puzzle2DSchema]).refine(
  val => {
    if (typeof val === 'string') {
      return val.split(',').length === 81;
    }
    if (Array.isArray(val) && !Array.isArray(val[0])) {
      return val.length === 81;
    }
    return true;
  },
  { message: 'Invalid puzzle format' }
);

export const solveRequestSchema = z.object({
  puzzle: puzzleSchema,
  format: z.enum(['string', '1D', '2D']).default('string'),
  unfilledChar: z.string().default('.'),
});

export const generateRequestSchema = z.object({
  level: z.enum(['easy', 'medium', 'hard', 'evil']),
});

export type SolveRequest = z.infer<typeof solveRequestSchema>;
export type GenerateRequest = z.infer<typeof generateRequestSchema>;
