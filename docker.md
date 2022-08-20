docker build -t sudoku-api:1.0.0 .
docker run --name sudoku-api -d -p 8080 sudoku-api:1.0.0
