import { Queue } from 'buckets-js'

function bfs(graph, start) {

  let node;

  let journey = [];
  let path = [];

  let Q = new Queue();
  let added = new Set();

  let prev = {};

  Q.enqueue(start);

  for (let row = 0; row < graph.length; row++) {
    for (let col = 0; col < graph[row].length; col++) {

      node = graph[row][col];

      if (node["toString"] !== start["toString"]) {
        prev[node["toString"]] = null;
      }
    }
  }

  while (!Q.isEmpty()) {

    node = Q.dequeue();

    let neighbors = node.getNodeNeighbors(graph, [node["row"], node["col"]]);

    for (let i = 0; i < neighbors.length; i++) {

      let neighbor = neighbors[i];

      // this prevents a loop of 'prev' nodes from occuring
      if (prev[neighbor["toString"]] === null) {
        prev[neighbor["toString"]] = node;
      }

      if (neighbor["isEndNode"]) {

        while (prev[neighbor["toString"]].toString !== start["toString"]) {
          path.push(prev[neighbor["toString"]]);
          neighbor = prev[neighbor["toString"]];
        }

        return [journey, path];
      }

      if (!added.has(neighbor["toString"])) {
        journey.push(neighbor);
        Q.enqueue(neighbor);
        added.add(neighbor["toString"]);
      }
    }
  }

  return [journey, path];

}

export default bfs;