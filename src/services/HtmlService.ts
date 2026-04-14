import { version } from '../utils/version.js';

export function getHomeHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sudoku Solver API</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
    .endpoint { background: white; border-radius: 8px; padding: 15px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .method { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; margin-right: 10px; }
    .get { background: #61affe; color: white; }
    .post { background: #49cc90; color: white; }
    .path { font-family: monospace; font-size: 1.1em; color: #333; }
    .description { color: #666; margin-top: 8px; }
    code { background: #eee; padding: 2px 6px; border-radius: 3px; }
    pre { background: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 6px; overflow-x: auto; white-space: pre-wrap; }
    .docs-link { background: #ff6b6b; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 20px; font-weight: bold; }
    .docs-link:hover { background: #ee5a5a; }
  </style>
</head>
<body>
  <h1>Sudoku Solver API</h1>
  <p><strong>Version:</strong> ${version}</p>

  <div class="endpoint">
    <span class="method post">POST</span>
    <span class="path">/solve</span>
    <p class="description">Solve a Sudoku puzzle</p>
    <pre>body: { puzzle: string, format?: "string" | "1D" | "2D", unfilledChar?: string }</pre>
    <p class="description"><strong>Example puzzle (string format):</strong></p>
    <pre>{
  "puzzle": "1,5,7,0,0,0,3,0,0,9,0,6,0,0,0,8,2,0,0,4,0,0,3,0,0,5,2,0,0,0,9,
             0,0,0,0,0,3,0,9,0,0,0,0,1,5,0,0,0,0,0,5,0,0,0,9,0,0,0,
             0,1,2,0,0,0,4,7,0,2,0,0,0,6,5,0,1,0,0,5,0,8,1,0,0,0,7,0,2,6,0,0,0,7",
  "unfilledChar": "0",
  "format": "string"
}</pre>
  </div>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/generate/:level</span>
    <p class="description">Generate a random puzzle</p>
    <p><strong>Levels:</strong> <code>easy</code> | <code>medium</code> | <code>hard</code> | <code>evil</code></p>
  </div>

  <div class="endpoint">
    <span class="method get">GET</span>
    <span class="path">/health</span>
    <p class="description">Health check endpoint</p>
  </div>

  <a href="/api-docs" class="docs-link">Open API Documentation</a>
</body>
</html>`;
}
