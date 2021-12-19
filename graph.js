class Node {
  constructor(row, col, risk) {
    this.row = row;
    this.col = col;
    this.key = `${this.row}${this.col}`;
    this.risk = risk;
    this.neighbors = [];
    this.f = 0;
    this.g = risk;
    this.h = 0;
    this.previousNode = null;
    this.isPath = false;
  }
}

function addNeighbors(grid) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const node = grid[row][col];

      if (grid[row - 1]) node.neighbors.push(grid[row - 1][col]);
      if (grid[row][col + 1]) node.neighbors.push(grid[row][col + 1]);
      if (grid[row + 1]) node.neighbors.push(grid[row + 1][col]);
      if (grid[row][col - 1]) node.neighbors.push(grid[row][col - 1]);

      /*
      if (grid[row - 1] && grid[row - 1][col + 1]) {
        node.neighbors.push(grid[row - 1][col + 1]);
      }
      if (grid[row + 1] && grid[row + 1][col + 1]) {
        node.neighbors.push(grid[row + 1][col + 1]);
      }
      if (grid[row + 1] && grid[row + 1][col - 1]) {
        node.neighbors.push(grid[row + 1][col - 1]);
      }
      if (grid[row - 1] && grid[row - 1][col - 1]) {
        node.neighbors.push(grid[row - 1][col - 1]);
      }
			*/
    }
  }
}

function createGrid(input, rows, cols) {
  if (input.length) {
    rows = input.length;
    cols = input[0].length;
  }

  const grid = [];

  for (let row = 0; row < rows; row++) {
    const newRow = [];
    for (let col = 0; col < cols; col++) {
      newRow.push(new Node(row, col, input[row][col]));
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
  //const distance = Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  const distance = a.risk;

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
      current.isPath = true;
      const path = [current];

      while (current.previousNode) {
        path.push(current.previousNode);

        current = current.previousNode;

        current.isPath = true;
      }

      return path;
    }

    openSet.splice(lowestIndex, 1);
    closedSet.push(current);

    for (const neighbor of current.neighbors) {
      if (closedSet.includes(neighbor)) continue;

      let newPath = false;
      if (openSet.includes(neighbor)) {
        if (current.g + 1 < neighbor.g) {
          neighbor.g = current.g + 1;
          newPath = true;
        }
      } else {
        neighbor.g = current.g + 1;

        openSet.push(neighbor);
        newPath = true;
      }

      if (newPath) {
        neighbor.h = heuristic(neighbor, endNode);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previousNode = current;
      }
    }
  }

  return [];
}

const grid = createGrid([
  [1, 1, 6, 3, 7, 5, 1, 7, 4, 2],
  [1, 3, 8, 1, 3, 7, 3, 6, 7, 2],
  [2, 1, 3, 6, 5, 1, 1, 3, 2, 8],
  [3, 6, 9, 4, 9, 3, 1, 5, 6, 9],
  [7, 4, 6, 3, 4, 1, 7, 1, 1, 1],
  [1, 3, 1, 9, 1, 2, 8, 1, 3, 7],
  [1, 3, 5, 9, 9, 1, 2, 4, 2, 1],
  [3, 1, 2, 5, 4, 2, 1, 6, 3, 9],
  [1, 2, 9, 3, 1, 3, 8, 5, 2, 1],
  [2, 3, 1, 1, 9, 4, 4, 5, 8, 1],
]);

console.log(
  grid.map((row) => row.map((node) => node.risk).join(" ")).join("\n"),
  "\n"
);

aStar(grid[0][0], grid[9][9]);

console.log(
  grid
    .map((row) =>
      row.map((node) => `${node.risk}${node.isPath ? "*" : ""}`).join(" ")
    )
    .join("\n")
);
