function createGrid(input, rows, cols, diagonalsAllowed) {
  if (input.length) {
    rows = input.length;
    cols = input[0].length;
  }

  const grid = [];

  for (let row = 0; row < rows; row++) {
    const newRow = [];
    for (let col = 0; col < cols; col++) {
      newRow.push(
        new Node(row, col, input.length ? input[row][col] : 0, diagonalsAllowed)
      );
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

function heuristic(a, b, diagonalsAllowed) {
  if (diagonalsAllowed) {
    // Euclidean distance
    return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(b.col - b.col, 2));
  } else {
    // Manhattan distance
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  }
}

function aStar(startNode, endNode) {
  const states = [];
  const openSet = [];
  const closedSet = [];

  openSet.push(startNode);

  let current = null;
  while (openSet.length > 0) {
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) lowestIndex = i;
    }

    current = openSet[lowestIndex];

    if (current === endNode) {
      const path = [current];
      while (current.previousNode) {
        path.push(current.previousNode);

        current = current.previousNode;

        current.isPath = true;
      }

      states.push({ path: path.reverse() });

      return states;
    }

    openSet.splice(lowestIndex, 1);
    closedSet.push(current);

    for (const neighbor of current.neighbors) {
      if (closedSet.includes(neighbor) || neighbor.isWall) continue;

      const g = current.g + neighbor.cost;

      if (g < neighbor.g || !openSet.includes(neighbor)) {
        neighbor.g = g;
        neighbor.f =
          g + heuristic(neighbor, endNode, neighbor.diagonalsAllowed);
        neighbor.previousNode = current;

        if (!openSet.includes(neighbor)) openSet.push(neighbor);
      }
    }

    states.push({ openSet: openSet.slice(), closedSet: closedSet.slice() });
  }

  return states;
}
