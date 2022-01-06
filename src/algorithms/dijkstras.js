/**
 * Return an array containing the order of nodes visited from dijkstras algorithm.
 * @param {Object[][]} graph 
 * @param {Object} start 
 * @returns {Object[]}
 */
 function dijkstras(graph, start) {
  let journey = [];
  let path = [];
  let dist = {};
  let prev = {};

  let Q = [];
  let added = new Set();

  dist[start["toString"]] = 0;

  let node;
  let neighbors;
  let neighbor;
  let len;

  // init all distances & predecessors
  for (let row = 0; row < graph.length; row++) {
    for (let col = 0; col < graph[row].length; col++) {

      node = graph[row][col];

      if (node["toString"] !== start["toString"]) {
        dist[node["toString"]] = Infinity;
        prev[node["toString"]] = null;
      }
    }
  }

  Q.push([start, 0]);

  while (Q.length > 0) {
    node = Q[findMin(Q)];
    Q = Q.filter(n => n !== node);
    node = node[0]

    neighbors = node.getNodeNeighbors(graph, [node["row"], node["col"]]);

    for (let i = 0; i < neighbors.length; i++) {
      neighbor = neighbors[i];

      len = dist[node["toString"]] + neighbor["weight"];

      // end search
      if (neighbor["isEndNode"]) {
        prev[neighbor["toString"]] = node;

        if (prev.hasOwnProperty(node["toString"]) || neighbor["toString"] === start["toString"]) {
          while (prev[neighbor["toString"]].toString !== start.toString) {
            path.push(prev[neighbor["toString"]]);
            neighbor = prev[neighbor["toString"]]
          }
        }
        return [journey, path];
      }

      if (len < dist[neighbor["toString"]]) {
        journey.push(neighbor);

        dist[neighbor["toString"]] = len;
        prev[neighbor["toString"]] = node;

        // only add to queue if not seen
        if (!added.has(neighbor)) {
          Q.push([neighbor, len]);
          added.add(neighbor);
        }
      }
    }
  }

  return [journey, path];

}

function findMin(arr) {
  let mini = 0
  let min = arr[mini][1]
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][1] < min) {
      min = arr[i][1];
      mini = i;
    }
  }
  return mini;
}



export default dijkstras;