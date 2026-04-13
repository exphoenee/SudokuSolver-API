import SudokuBoard from './dist/core/SudokuBoard/SudokuBoard.js';
import SudokuSolver from './dist/solver/SudokuSolver.js';
import SudokuGenerator from './dist/generator/SudokuGenerator.js';

interface BenchmarkResult {
  name: string;
  runs: number;
  avgMs: number;
  minMs: number;
  maxMs: number;
}

const testPuzzle2D = [
  [1, 0, 0, 0, 0, 7, 0, 0, 3],
  [9, 0, 6, 0, 0, 8, 2, 0, 4],
  [0, 3, 0, 5, 2, 0, 0, 9, 0],
  [3, 9, 0, 0, 0, 1, 5, 0, 0],
  [0, 0, 0, 0, 5, 0, 0, 0, 9],
  [0, 0, 1, 2, 0, 0, 0, 4, 7],
  [0, 2, 0, 0, 6, 5, 0, 1, 0],
  [5, 0, 8, 1, 0, 0, 7, 0, 2],
  [6, 0, 0, 0, 0, 7, 0, 0, 5],
];

const testPuzzleString =
  '1,0,0,0,0,7,0,0,3,9,0,6,0,0,8,2,0,4,0,3,0,5,2,0,0,9,0,3,9,0,0,0,1,5,0,0,0,0,5,0,0,0,9,0,0,0,0,1,2,0,0,0,4,7,0,2,0,0,6,5,0,1,0,5,0,8,1,0,0,7,0,2,6,0,0,7,0,0,0,0,5';

function runBenchmark(name: string, fn: () => void, runs: number = 100): BenchmarkResult {
  const times: number[] = [];

  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    times.push(end - start);
  }

  const avgMs = times.reduce((a, b) => a + b, 0) / runs;
  const minMs = Math.min(...times);
  const maxMs = Math.max(...times);

  return {
    name,
    runs,
    avgMs: Number(avgMs.toFixed(2)),
    minMs: Number(minMs.toFixed(2)),
    maxMs: Number(maxMs.toFixed(2)),
  };
}

function printResult(result: BenchmarkResult) {
  console.log(
    `${result.name}: avg=${result.avgMs}ms, min=${result.minMs}ms, max=${result.maxMs}ms (${result.runs} runs)`
  );
}

console.log('\n=== Performance Benchmarks ===\n');

const board = new SudokuBoard(3, 3);
const solver = new SudokuSolver(board);
const generator = new SudokuGenerator({ sudokuboard: board });

const solveResult = runBenchmark(
  'Solve 2D puzzle',
  () => {
    solver.clearBoard();
    solver.setBoard(testPuzzle2D);
    solver.solvePuzzle();
  },
  100
);
printResult(solveResult);

const solveStringResult = runBenchmark(
  'Solve string puzzle',
  () => {
    solver.clearBoard();
    solver.setBoard(testPuzzleString);
    solver.solvePuzzle();
  },
  20
);
printResult(solveStringResult);

const genEasy = runBenchmark(
  'Generate easy puzzle',
  () => {
    generator.generatePuzzle('easy');
  },
  5
);
printResult(genEasy);

const genMedium = runBenchmark(
  'Generate medium puzzle',
  () => {
    generator.generatePuzzle('medium');
  },
  5
);
printResult(genMedium);

const genHard = runBenchmark(
  'Generate hard puzzle',
  () => {
    generator.generatePuzzle('hard');
  },
  5
);
printResult(genHard);

const boardInit = runBenchmark(
  'Create empty board',
  () => {
    new SudokuBoard(3, 3);
  },
  500
);
printResult(boardInit);

const solveWithFormat = runBenchmark(
  'Solve + format output',
  () => {
    solver.clearBoard();
    solver.setBoard(testPuzzle2D);
    solver.solvePuzzle({ format: 'string' });
  },
  100
);
printResult(solveWithFormat);

console.log('\n=== Benchmarks Complete ===\n');
