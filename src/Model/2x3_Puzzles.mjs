export const clearBoardSolution1 = [
  [1, 2, 3, 4, 5, 6],
  [4, 5, 6, 1, 2, 3],
  [1, 2, 3, 4, 5, 6],
  [2, 1, 4, 3, 6, 5],
  [3, 6, 5, 2, 1, 4],
  [2, 1, 4, 3, 6, 5],
  [5, 3, 1, 6, 4, 2],
  [6, 4, 2, 5, 3, 1],
  [5, 3, 1, 6, 4, 2],
];
export const clearBoardSolution2 = [
  [1, 2, 3, 4, 5, 6],
  [4, 5, 6, 1, 2, 3],
  [1, 2, 3, 4, 5, 6],
  [2, 3, 1, 6, 4, 5],
  [5, 1, 2, 3, 6, 4],
  [6, 4, 5, 3, 2, 1],
  [3, 1, 2, 6, 5, 4],
  [5, 4, 2, 6, 3, 1],
  [6, 3, 4, 1, 5, 2],
];
/* easy puzzle */
export const puzzle2d = [
  [1, 0, 0, 0, 0, 0, 0],
  [0, 6, 0, 0, 2, 0, 4],
  [0, 3, 0, 5, 2, 0, 0],
  [3, 0, 0, 0, 1, 5, 0],
  [0, 0, 5, 0, 0, 0, 0],
  [0, 0, 1, 2, 0, 0, 0],
  [0, 2, 0, 0, 6, 5, 0],
  [5, 0, 1, 0, 0, 0, 2],
  [6, 0, 0, 0, 0, 0, 0],
];
export const puzzle1d = puzzle2d.flat(1);
export const puzzleStr = puzzle1d.join(",");
export const puzzleSolution = [
  [1, 2, 4, 6, 5, 3],
  [5, 6, 3, 1, 2, 4],
  [4, 3, 5, 2, 6, 1],
  [3, 4, 1, 5, 2, 6],
  [2, 5, 6, 3, 4, 1],
  [6, 1, 2, 5, 3, 4],
  [2, 3, 4, 6, 5, 1],
  [5, 4, 1, 3, 6, 2],
  [6, 1, 2, 4, 3, 5],
];
/* Unsolvable puzzle */
export const unsolvable2d = [
  [0, 1, 2, 3, 4, 5],
  [1, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0],
  [5, 0, 0, 0, 0, 0],
];
export const unsolvable1d = unsolvable2d.flat(1);
export const unsolvableStr = unsolvable1d.join(",");
/* Wrong puzzle */
export const wrong2d = [
  [1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5, 6],
  [1, 2, 3, 4, 5, 6],
];
export const wrong1d = wrong2d.flat(1);
export const wrongStr = wrong1d.join(",");
