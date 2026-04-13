import { z } from 'zod';
import { ValidationError } from './errors.js';
import { solveRequestSchema, generateRequestSchema } from './zod.js';

export type SolveRequest = z.infer<typeof solveRequestSchema>;
export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export function validateSolveRequest(body: unknown): SolveRequest {
  try {
    return solveRequestSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new ValidationError(
        err.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }))
      );
    }
    throw err;
  }
}

export function validateGenerateRequest(params: unknown): GenerateRequest {
  try {
    return generateRequestSchema.parse(params);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new ValidationError(
        err.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }))
      );
    }
    throw err;
  }
}
