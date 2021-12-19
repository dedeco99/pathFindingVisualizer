const graph = { a: ["b", "c"], b: ["d"], c: ["e"], d: ["f"], e: [], f: [] };

function depthFirst(graph, source) {
  const order = [];
  const stack = [source];

  while (stack.length > 0) {
    const current = stack.pop();

    order.push(current);

    for (const neighbor of graph[current]) {
      stack.push(neighbor);
    }
  }

  return order;
}

console.log("depth first", depthFirst(graph, "a"));

const order = [];
function depthFirstRecursive(graph, source) {
  order.push(source);

  for (const neighbor of graph[source]) {
    depthFirstRecursive(graph, neighbor, order);
  }
}

depthFirstRecursive(graph, "a");

console.log("depth first recursive", order);

function breadthFirst(graph, source) {
  const order = [];
  const queue = [source];

  while (queue.length > 0) {
    const current = queue.shift();

    order.push(current);

    for (const neighbor of graph[current]) {
      queue.push(neighbor);
    }
  }

  return order;
}

console.log("breadth first", breadthFirst(graph, "a"));
