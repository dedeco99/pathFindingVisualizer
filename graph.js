function createGrid(rows, cols) {
  const grid = [];

  let i = 0;
  for (let row = 0; row < rows; row++) {
    const newRow = [];
    for (let col = 0; col < cols; col++) {
      newRow.push(i++);
    }

    grid.push(newRow);
  }

  console.log(grid.map((row) => row.join(" ")).join("\n"));

  return grid;
}

function getNeighbors(grid, row, col) {
  const neighbors = [];

  if (grid[row - 1]) neighbors.push(grid[row - 1][col]);
  if (grid[row + 1]) neighbors.push(grid[row + 1][col]);
  if (grid[row][col - 1] >= 0) neighbors.push(grid[row][col - 1]);
  if (grid[row][col + 1] >= 0) neighbors.push(grid[row][col + 1]);

  return neighbors;
}

function createGraph(grid) {
  const graph = {};
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];

      graph[cell] = getNeighbors(grid, row, col);
    }
  }

  return graph;
}

function shortestPath(grid, startNode, endNode) {
  const graph = createGraph(grid);

  const visited = new Set([startNode]);

  const queue = [[startNode, 0]];

  while (queue.length > 0) {
    const [node, distance] = queue.shift();

    if (node === endNode) return distance;

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, distance + 1]);
      }
    }
  }

  return -1;
}

console.log(shortestPath(createGrid(10, 3), 0, 29));
