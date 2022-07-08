function dfs(graph, start) {
  let node;

  const visited = {};
  const stack = [start];
  
  let journey = [];

  while (stack.length) {
    node = stack.pop();

    if (node["isEndNode"]) {
      return [journey, journey.slice().reverse()];
    }

    if (!visited[node["toString"]]) {
      journey.push(node);
      visited[node["toString"]] = true;
      stack.push(...graph[node.row][node.col].getNodeNeighbors(graph, [node.row, node.col]));
    }
  }

  return [journey, []];
}

export default dfs;