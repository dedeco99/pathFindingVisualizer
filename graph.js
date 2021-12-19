class Node {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.key = `${this.row}${this.col}`;
    this.neighbors = [];
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.previousNode = null;
  }
}

function addNeighbors(grid) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];

      if (grid[row - 1]) cell.neighbors.push(grid[row - 1][col]);
      if (grid[row][col + 1]) cell.neighbors.push(grid[row][col + 1]);
      if (grid[row + 1]) cell.neighbors.push(grid[row + 1][col]);
      if (grid[row][col - 1]) cell.neighbors.push(grid[row][col - 1]);
    }
  }
}

function createGrid(rows, cols) {
  const grid = [];

  for (let row = 0; row < rows; row++) {
    const newRow = [];
    for (let col = 0; col < cols; col++) {
      newRow.push(new Node(row, col));
    }

    grid.push(newRow);
  }

  addNeighbors(grid);

  return grid;
}

function heuristic(a, b) {
  // Euclidean distance
  /*
	const distance = Math.sqrt(
    Math.pow(a.row - b.row, 2) + Math.pow(b.col - b.col, 2)
  );
	*/

  // Manhattan distance
  const distance = Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

  return distance;
}

function aStar(startNode, endNode) {
  const openSet = [startNode];
  const closedSet = [];

  while (openSet.length > 0) {
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) lowestIndex = i;
    }

    let current = openSet[lowestIndex];

    if (current === endNode) {
      const path = [current];

      while (current.previousNode) {
        path.push(current.previousNode);

        current = current.previousNode;
      }

      return path;
    }

    openSet.splice(lowestIndex, 1);
    closedSet.push(current);

    for (const neighbor of current.neighbors) {
      if (closedSet.includes(neighbor)) continue;

      if (openSet.includes(neighbor)) {
        if (current.g + 1 < neighbor.g) neighbor.g = current.g + 1;
      } else {
        neighbor.g = current.g + 1;

        openSet.push(neighbor);
      }

      neighbor.h = heuristic(neighbor, endNode);
      neighbor.f = neighbor.g + neighbor.h;
      neighbor.previousNode = current;
    }
  }

  return [];
}

const grid = createGrid(10, 10);

console.log(
  grid.map((row) => row.map((cell) => cell.key).join(" ")).join("\n")
);

console.log(aStar(grid[0][0], grid[9][9]).map((node) => node.key));
