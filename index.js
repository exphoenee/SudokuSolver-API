const express = require("express");
const SudokuSolver = require("./SudokuSolver/SudokuSolver");
const app = express();

const port = 3000;

app.listen(port, () => console.log("App is listening now!"));

app.get("/", function (req, res) {
  res.send(
    "Normal usage of the API is send a string with get request to the solve endpoint, with the stringified puzzle e.g. apipath/solve/2.............62....1....7...6..8...3...9...7...6..4...4....8....52.............3"
  );
});

app.get("/solve", function (req, res) {
  res.send("You forgot the string what describes, the puzzle.");
});

app.get("/solve/:id", function (req, res) {
  console.log("Requested id: " + req.params.id);
  const sudoku = new SudokuSolver({ sectionSizeX: 3, sectionSizeY: 3 });
  const solution = sudoku.solvePuzzle(req.params.id, "string");
  res.send("Requested id: " + req.params.id);
});

app.use(express.urlencoded({ extended: true }));
