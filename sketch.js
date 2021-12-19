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

function heuristic(a, b) {
  // Euclidean distance

  const distance = Math.sqrt(
    Math.pow(a.row - b.row, 2) + Math.pow(b.col - b.col, 2)
  );

  // Manhattan distance
  // const distance = Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

  return distance + a.risk;
}

const grid = createGrid([], 50, 75);

console.log(grid);

const rows = grid.length;
const cols = grid[0].length;

const startNode = grid[0][0];
const endNode = grid[rows - 1][cols - 1];
startNode.wall = false;
endNode.wall = false;

const openSet = [];
const closedSet = [];

let w, h;

function setup() {
  createCanvas(1200, 800);
  console.log("A*");

  w = width / cols;
  h = height / rows;

  openSet.push(startNode);
}

function draw() {
  let current = null;
  if (openSet.length > 0) {
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) lowestIndex = i;
    }

    current = openSet[lowestIndex];

    if (current === endNode) noLoop();

    openSet.splice(lowestIndex, 1);
    closedSet.push(current);

    for (const neighbor of current.neighbors) {
      if (closedSet.includes(neighbor) || neighbor.wall) continue;

      const testG = current.g + heuristic(neighbor, endNode);

      if (testG < neighbor.g || !openSet.includes(neighbor)) {
        neighbor.g = testG;
        neighbor.h = heuristic(neighbor, endNode);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previousNode = current;

        if (!openSet.includes(neighbor)) openSet.push(neighbor);
      }
    }
  } else {
    console.log("no solution");
    noLoop();
    return;
  }

  // Draw current state of everything
  background(255);
  frameRate(500);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      grid[row][col].show();
    }
  }

  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0, 50));
  }

  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0, 50));
  }

  const path = [current];
  while (current.previousNode) {
    path.push(current.previousNode);

    current = current.previousNode;
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255, 50));
  }
}
