class Node {
  constructor(row, col, risk) {
    this.row = row;
    this.col = col;
    this.key = `${this.row}${this.col}`;
    this.risk = risk;
    this.neighbors = [];
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.previousNode = null;
    this.walls = false;

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
      //text(this.risk, this.col * w + 25, this.row * h + 35);
      //text(this.f, this.col * w + 10, this.row * h + 20);
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
