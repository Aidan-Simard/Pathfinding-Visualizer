function randomMaze(graph) {
  const sets = {};
  const queue = [];
  for (const row of graph) {
    for (const node of row) {
      if ((node["row"] % 2 === 0 || node["col"] % 2 === 0) && !(node["isStartNode"] || node["isEndNode"])) {
        graph[node["row"]][node["col"]]["isWall"] = true;

        // dont push corners
        if (!(node["row"] % 2 === 0 && node["col"] % 2 === 0)) {
          queue.push(node);
        }
      } else {
        graph[node["row"]][node["col"]]["isWall"] = false;
        sets[node["toString"]] = new Set();
        sets[node["toString"]].add(node["toString"]);
      }
    }
  }

  let randomQueue = queue
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

  while (randomQueue.length > 0) {
    const node = randomQueue.pop();

    // skip corners
    if (node["row"] % 2 === 0 && node["col"] % 2 === 0) {
      continue;
    }

    const neighbors = node._getNodeNeighbors(graph, [node["row"], node["col"]]);

    let n1, n2;

    if ((neighbors[1] && neighbors[1]["isWall"]) || (neighbors[3] && neighbors[3]["isWall"])) {
      if (neighbors[0]) n1 = neighbors[0];
      if (neighbors[2]) n2 = neighbors[2];
    } else if ((neighbors[0] && neighbors[0]["isWall"]) || (neighbors[2] && neighbors[2]["isWall"])) {
      if (neighbors[1]) n1 = neighbors[1];
      if (neighbors[3]) n2 = neighbors[3];
    }

    if (n1 && n2) {
      if (isDistinct(sets[n1["toString"]], sets[n2["toString"]])) {
        graph[node["row"]][node["col"]]["isWall"] = false;        
        const newSet = union(sets[n1["toString"]], sets[n2["toString"]]);
        sets[n1["toString"]] = newSet;
        sets[n2["toString"]] = newSet;

        for (const subSet of newSet) {
          sets[subSet] = union(newSet, sets[subSet]);
        }
      }
    }
  }

  return graph;
}

function union(setA, setB) {
  const _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

function isDistinct(setA, setB) {
  const maxSet = setA.size > setB.size ? setA : setB;
  const minSet = setA.size > setB.size ? setB : setA;

  for (const elem of maxSet) {
    if (minSet.has(elem)) {
      return false;
    }
  }
  return true;
}

export default randomMaze;
