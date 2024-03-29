import express from "express";
import SudokuSolver from "./src/SudokuSolver/SudokuSolver.mjs";
import SudokuBoard from "./src/SudokuBoard/SudokuBoard.mjs";
import SudokuGenerator from "./src/SudokuGenerator/SudokuGenerator.mjs";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", function (req, res) {
  res.json({
    error: {
      solver:
        "Normal usage of the solver endpoint of the API is send a string with get request, with the stringified puzzle, the values separated with coma e.g.: apipath/solve/2,.,.,.,.,.,.,.,.,.,.,.,.,.,6,2,.,.,.,.,1,.,.,.,.,7,.,.,.,6,.,.,8,.,.,.,3,.,.,.,9,.,.,.,7,.,.,.,6,.,.,4,.,.,.,4,.,.,.,.,8,.,.,.,.,5,2,.,.,.,.,.,.,.,.,.,.,.,.,.,3",
      generator:
        "Normal usage of the generator endpoint of the API is send a string with get request, with the level [easy, medium, hard, evil] parameter e.g.: apipath/generate/easy",
    },
  });
});

app.get("/solve", function (req, res) {
  res.json({
    error: "You forgot the string what describes, the puzzle.",
  });
});

app.get("/generate", function (req, res) {
  res.json({
    error: "You forgot the string what describes, the puzzle level.",
  });
});

app.get("/solve/:puzzle", function (req, res) {
  const { puzzle } = {
    puzzle: req.params.puzzle,
  };
  const xdim = 9;
  const ydim = 9;

  const board = new SudokuBoard(Math.sqrt(xdim), Math.sqrt(ydim));
  const solver = new SudokuSolver(board);
  const solution = solver.solvePuzzle({
    puzzle,
    format: "string",
    unfilledChar: ".",
  });
  console.log(
    "Requested puzzle: " + puzzle,
    "x: " + xdim,
    "y: " + ydim,
    "Solution: " + solution
  );
  res.json({ solution });
});

app.get("/generate/:level", function (req, res) {
  const { level } = {
    level: req.params.level,
  };
  const xdim = 9;
  const ydim = 9;

  const board = new SudokuBoard(Math.sqrt(xdim), Math.sqrt(ydim));
  const generator = new SudokuGenerator({ sudokuboard: board });
  const results = generator.generatePuzzle({
    level,
  });

  res.json({ results });
});

app.listen(PORT, () => console.log(`App is listening now on port ${PORT}!`));

module.exports = app;
