# Suodku API
This REST API solves 9x9 sudoku puzzles using a backtracking algorithm.
Api written in JavaSctipt using Node.js and Express.js

Currently the API runs on [fly.dev](https://sudoku-solver-api.fly.dev/) and is deployed using [flyctl](https://fly.io/docs/flyctl/).

## API
### GET /
Help page
### GET /api/solver/:sudokupuzzle
Solves a sudoku puzzle and returns the solution
#### Example
```/api/solver/003020600900305001001806400008102900700000008006708200002609500800203009005010300```
returns the solution:
```483921657967345821251876493548132976729564138136798245372689514814253769695417382```
### GET /generate/:difficulty
Generates a sudoku puzzle with the given difficulty
#### Example
```GET /api/solver/difficulty/easy``` returns a puzzle with 40 clues
```GET /api/solver/difficulty/medium``` returns a puzzle with 30 clues
```GET /api/solver/difficulty/hard``` returns a puzzle with 20 clues
```GET /api/solver/difficulty/veryhard``` returns a puzzle with 10 clues

## Run locally
### Prerequisites
- Node.js

### Run
```
npm install
npm start
```


# install docker
docker build -t sudoku-api:1.0.0 .
docker run --name sudoku-api -d -p 8080 sudoku-api:1.0.0