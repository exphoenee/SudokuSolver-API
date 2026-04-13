import { createApp } from './dist/app.js';

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Sudoku Solver API running on port ${PORT}`);
});

export default app;
