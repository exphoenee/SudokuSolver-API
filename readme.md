# Sudoku Solver API

REST API for solving and generating Sudoku puzzles using a backtracking algorithm.
Built with Node.js, Express.js, and TypeScript.

Live demo: [https://sudoku-solver-api.fly.dev/](https://sudoku-solver-api.fly.dev/)

## Quick Start

```bash
npm install
npm run dev
```

Server runs at `http://localhost:3005`

## API Endpoints

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/`                | Help page with links  |
| POST   | `/solve`           | Solve a Sudoku puzzle |
| GET    | `/generate/:level` | Generate a puzzle     |
| GET    | `/health`          | Health check          |
| GET    | `/api-docs`        | Swagger documentation |

### POST /solve

Solve a Sudoku puzzle.

**Request Body:**

```json
{
  "puzzle": "1,0,0,0,0,7,0,0,3,9,0,6,0,0,8,2,0,4,0,3,0,5,2,0,0,9,0,3,9,0,0,0,1,5,0,0,0,0,5,0,0,0,9,0,0,0,0,1,2,0,0,0,4,7,0,2,0,0,6,5,0,1,0,5,0,8,1,0,0,7,0,2,6,0,0,7,0,0,0,0,5",
  "format": "string",
  "unfilledChar": "."
}
```

**Parameters:**

- `puzzle` (required): Sudoku puzzle as comma-separated values (0 = empty)
- `format` (optional): Output format - `"string"`, `"1D"`, or `"2D"` (default: `"string"`)
- `unfilledChar` (optional): Character for empty cells in string format (default: `"."`)

**Response:**

```json
{
  "success": true,
  "data": {
    "solution": "1,8,2,9,4,7,6,5,3,9,5,6,3,1,8,2,7,4,...",
    "format": "string",
    "durationMs": 2
  },
  "error": null,
  "meta": {
    "timestamp": "2026-04-13T18:49:02.951Z"
  }
}
```

### GET /generate/:level

Generate a random puzzle.

**Levels:** `easy`, `medium`, `hard`, `evil`

**Response:**

```json
{
  "success": true,
  "data": {
    "puzzle": "1,8,9,0,5,0,0,0,4...",
    "solution": "1,8,9,2,5,6,7,3,4...",
    "level": "easy",
    "generationTime": 674,
    "trialStep": 1
  },
  "error": null,
  "meta": {
    "timestamp": "2026-04-13T18:50:06.999Z"
  }
}
```

### GET /health

Returns service health status.

```json
{
  "success": true,
  "data": { "status": "healthy" },
  "error": null,
  "meta": { "timestamp": "..." }
}
```

## Swagger Documentation

Full API documentation available at: `http://localhost:3005/api-docs`

Interactive API explorer with request builder and response examples.

## Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Development mode with auto-rebuild |
| `npm run build`     | Build TypeScript                   |
| `npm start`         | Run production server              |
| `npm test`          | Run tests                          |
| `npm run benchmark` | Run performance benchmarks         |

## Performance Benchmarks

| Operation              | Average | Min    | Max     |
| ---------------------- | ------- | ------ | ------- |
| Solve 2D puzzle        | 1.79ms  | 1.18ms | 6.44ms  |
| Solve string puzzle    | 449ms   | 335ms  | 569ms   |
| Generate easy puzzle   | 2782ms  | 690ms  | 10794ms |
| Generate medium puzzle | 2717ms  | 698ms  | 10749ms |
| Generate hard puzzle   | 736ms   | 535ms  | 1271ms  |
| Create empty board     | 2.49ms  | 1.45ms | 55ms    |
| Solve + format output  | 2.89ms  | 1.07ms | 142ms   |

## Docker

```bash
docker build -t sudoku-api:1.0.0 .
docker run --name sudoku-api -d -p 3005:3005 sudoku-api:1.0.0
```

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Zod (input validation)
- Swagger UI
- Jest (testing)
