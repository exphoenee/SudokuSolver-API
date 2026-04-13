/**
 * @fileoverview API response formatting utilities
 * @module utils/response
 */

/**
 * Standard API response format
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request was successful
 * @property {*} data - Response data (null on error)
 * @property {Object|null} error - Error details (null on success)
 * @property {Object} meta - Metadata about the response
 */

export function successResponse(data, meta = {}) {
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

export function errorResponse(error, meta = {}) {
  return {
    success: false,
    data: null,
    error: {
      message: error.message || 'An error occurred',
      code: error.code || 'UNKNOWN_ERROR',
      ...(error.errors && { details: error.errors }),
    },
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

export function formatSolveResponse(solution, meta = {}) {
  return successResponse({ solution }, meta);
}

export function formatGenerateResponse(results, meta = {}) {
  return successResponse(results, meta);
}
