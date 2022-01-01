function createGrid(input, rows, cols) {
  if (input.length) {
    rows = input.length;
    cols = input[0].length;
  }

  const grid = [];

  for (let row = 0; row < rows; row++) {
    const newRow = [];
    for (let col = 0; col < cols; col++) {
      newRow.push(new Node(row, col, input.length ? input[row][col] : 0));
    }

    grid.push(newRow);
  }

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      grid[row][col].addNeighbors(grid);
    }
  }

  return grid;
}
