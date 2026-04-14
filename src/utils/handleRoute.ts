import type { Request, Response } from 'express';
import { SudokuError, ValidationError } from './errors.js';
import { errorResponse } from './response.js';

interface RouteResult {
  durationMs?: number;
  generationTime?: number;
}

export function handleRoute(
  _req: Request,
  res: Response,
  handler: () => unknown,
  formatter: (result: unknown, duration: number) => unknown
): void {
  const startTime = Date.now();
  try {
    const result = handler();
    const duration =
      result && typeof result === 'object' && 'durationMs' in result
        ? ((result as RouteResult).durationMs ?? Date.now() - startTime)
        : result && typeof result === 'object' && 'generationTime' in result
          ? ((result as RouteResult).generationTime ?? Date.now() - startTime)
          : Date.now() - startTime;
    res.json(formatter(result, duration));
  } catch (err) {
    const duration = Date.now() - startTime;
    const statusCode = err instanceof ValidationError ? 400 : 500;
    const error =
      err instanceof SudokuError ? err : new SudokuError((err as Error).message, 'INTERNAL_ERROR');
    res.status(statusCode).json(errorResponse(error, { durationMs: duration }));
  }
}
