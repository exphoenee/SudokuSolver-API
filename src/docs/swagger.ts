import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config/index.js';

const baseUrl = config.get<string>('api.baseUrl') || 'http://localhost:3005';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sudoku Solver API',
      version: '3.0.0',
      description: 'REST API for solving and generating Sudoku puzzles',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: baseUrl,
        description: 'API Server',
      },
    ],
    tags: [
      { name: 'Solve', description: 'Sudoku solving endpoints' },
      { name: 'Generate', description: 'Puzzle generation endpoints' },
      { name: 'Health', description: 'Service health endpoints' },
    ],
    paths: {
      '/solve': {
        post: {
          tags: ['Solve'],
          summary: 'Solve a Sudoku puzzle',
          description: 'Solves a given Sudoku puzzle and returns the solution',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['puzzle'],
                  properties: {
                    puzzle: {
                      type: 'string',
                      description: 'Sudoku puzzle as comma-separated values (0 = empty)',
                      example:
                        '1,0,0,0,0,7,0,0,3,9,0,6,0,0,8,2,0,4,0,3,0,5,2,0,0,9,0,3,9,0,0,0,1,5,0,0,0,0,5,0,0,0,9,0,0,0,0,1,2,0,0,0,4,7,0,2,0,0,6,5,0,1,0,5,0,8,1,0,0,7,0,2,6,0,0,7,0,0,0,0,5',
                    },
                    format: {
                      type: 'string',
                      enum: ['string', '1D', '2D'],
                      default: 'string',
                      description: 'Output format for the solution',
                    },
                    unfilledChar: {
                      type: 'string',
                      default: '.',
                      description: 'Character to use for empty cells in string format',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Puzzle solved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          solution: {
                            type: 'string',
                            example: '1,8,2,9,4,7,6,5,3,9,5,6,3,1,8,2,7,4,...',
                          },
                          format: { type: 'string', example: 'string' },
                          durationMs: { type: 'number', example: 150 },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid puzzle format',
            },
            '500': {
              description: 'Internal server error or unsolvable puzzle',
            },
          },
        },
      },
      '/generate/{level}': {
        get: {
          tags: ['Generate'],
          summary: 'Generate a random Sudoku puzzle',
          description: 'Generates a random Sudoku puzzle at the specified difficulty level',
          parameters: [
            {
              name: 'level',
              in: 'path',
              required: true,
              description: 'Difficulty level of the puzzle',
              schema: {
                type: 'string',
                enum: ['easy', 'medium', 'hard', 'evil'],
                default: 'easy',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Puzzle generated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          puzzle: { type: 'string', example: '1,0,0,0,0,7,0,0,3,...' },
                          solution: { type: 'string', example: '1,8,2,9,4,7,6,5,3,...' },
                          level: { type: 'string', example: 'easy' },
                          generationTime: { type: 'number', example: 245 },
                          trialStep: { type: 'number', example: 42 },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid difficulty level',
            },
          },
        },
      },
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          description: 'Check if the API is running',
          responses: {
            '200': {
              description: 'Service is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          status: { type: 'string', example: 'healthy' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
