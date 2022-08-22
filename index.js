import express from "express";
import SudokuSolver from "./src/SudokuSolver/SudokuSolver.mjs";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", function (req, res) {
  res.send(
    "Normal usage of the API is send a string with get request to the solve endpoint, with the stringified puzzle, the values separated with coma e.g.: apipath/solve/2,.,.,.,.,.,.,.,.,.,.,.,.,.,6,2,.,.,.,.,1,.,.,.,.,7,.,.,.,6,.,.,8,.,.,.,3,.,.,.,9,.,.,.,7,.,.,.,6,.,.,4,.,.,.,4,.,.,.,.,8,.,.,.,.,5,2,.,.,.,.,.,.,.,.,.,.,.,.,.,3"
  );
});

app.get("/solve", function (req, res) {
  res.send(
    "You forgot the string what describes, the puzzle, the xdimension and y dimension of the puzzle."
  );
});

app.get("/solve/:puzzle", function (req, res) {
  const { puzzle } = {
    puzzle: req.params.puzzle,
  };
  const xdim = 9;
  const ydim = 9;

  const sudoku = new SudokuSolver(Math.sqrt(xdim), Math.sqrt(ydim));
  const solution = sudoku.solvePuzzle({
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
  res.send(solution);
});

app.listen(PORT, () => console.log(`App is listening now on port ${PORT}!`));
