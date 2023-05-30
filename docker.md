docker build -t sudoku-api:1.0.0 .
docker run --name sudoku-api -d -p 3000 sudoku-api:1.0.0
