/**
 * @fileoverview API response formatting utilities
 * @module utils/response
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta: ResponseMeta;
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

export interface ResponseMeta {
  timestamp: string;
  durationMs?: number;
  [key: string]: unknown;
}

export function successResponse<T>(data: T, meta: Record<string, unknown> = {}): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

export function errorResponse(err: Error, meta: Record<string, unknown> = {}): ApiResponse {
  const error = err as Error & { code?: string; errors?: unknown };
  return {
    success: false,
    data: null,
    error: {
      message: error.message || 'An error occurred',
      code: error.code || 'UNKNOWN_ERROR',
      ...(error.errors ? { details: error.errors } : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

export function formatSolveResponse(
  solution: unknown,
  meta: Record<string, unknown> = {}
): ApiResponse {
  return successResponse({ solution }, meta);
}

export function formatGenerateResponse(
  results: unknown,
  meta: Record<string, unknown> = {}
): ApiResponse {
  return successResponse(results, meta);
}
