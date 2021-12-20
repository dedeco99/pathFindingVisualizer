class Node {
  constructor(row, col, cost) {
    this.row = row;
    this.col = col;
    this.neighbors = [];
    this.f = Infinity;
    this.g = Infinity;
    this.cost = cost;
    this.previousNode = null;
    this.wall = false;

    if (Math.random(1) < 0.3) this.wall = true;
  }

  show(col) {
    if (this.wall) {
      fill(0);
      noStroke();
      ellipse(this.col * w + w / 2, this.row * h + h / 2, w / 2, h / 2);
    } else if (col) {
      fill(col);
      rect(this.col * h, this.row * w, w, h);
      fill(0);
    }
  }

  addNeighbors(grid) {
    if (grid[this.row - 1]) {
      this.neighbors.push(grid[this.row - 1][this.col]);
    }
    if (grid[this.row][this.col + 1]) {
      this.neighbors.push(grid[this.row][this.col + 1]);
    }
    if (grid[this.row + 1]) {
      this.neighbors.push(grid[this.row + 1][this.col]);
    }
    if (grid[this.row][this.col - 1]) {
      this.neighbors.push(grid[this.row][this.col - 1]);
    }

    if (grid[this.row - 1] && grid[this.row - 1][this.col + 1]) {
      this.neighbors.push(grid[this.row - 1][this.col + 1]);
    }
    if (grid[this.row + 1] && grid[this.row + 1][this.col + 1]) {
      this.neighbors.push(grid[this.row + 1][this.col + 1]);
    }
    if (grid[this.row + 1] && grid[this.row + 1][this.col - 1]) {
      this.neighbors.push(grid[this.row + 1][this.col - 1]);
    }
    if (grid[this.row - 1] && grid[this.row - 1][this.col - 1]) {
      this.neighbors.push(grid[this.row - 1][this.col - 1]);
    }
  }
}
