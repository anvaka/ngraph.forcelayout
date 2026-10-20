// Finds each hub's "fan": the small branches that hang off it by a single link (a leaf is a
// branch of one node). A link is such a hanging link when cutting it splits the graph in two
// (a bridge), and the smaller side has at most `maxBranch` nodes.
//
// Returns { load, hubOfLink }: load.get(hubId) is the number of nodes in all of the hub's fan
// branches, and hubOfLink.get(linkId) is the hub a hanging link belongs to.
//
// One pass over the graph (iterative Tarjan bridge search with subtree sizes): O(nodes + links).
export default function findFans(graph, maxBranch) {
  let ids = [];
  let indexOf = new Map();
  graph.forEachNode(node => {
    indexOf.set(node.id, ids.length);
    ids.push(node.id);
  });
  let n = ids.length;

  // Adjacency with link ids, so parallel links are not mistaken for bridges
  let adjacency = Array.from({length: n}, () => []);
  graph.forEachLink(link => {
    let a = indexOf.get(link.fromId), b = indexOf.get(link.toId);
    if (a === undefined || b === undefined || a === b) return;
    adjacency[a].push(b, link.id);
    adjacency[b].push(a, link.id);
  });

  let enter = new Int32Array(n).fill(-1);
  let low = new Int32Array(n);
  let size = new Int32Array(n);
  let parent = new Int32Array(n).fill(-1);
  let parentLink = new Array(n);
  let componentOf = new Int32Array(n);
  let componentSize = [];
  let clock = 0;

  for (let root = 0; root < n; ++root) {
    if (enter[root] >= 0) continue;
    let component = componentSize.length;
    let count = 0;
    let stack = [root], cursor = [0];
    enter[root] = low[root] = clock++;
    size[root] = 1;
    componentOf[root] = component;
    count += 1;
    while (stack.length) {
      let top = stack.length - 1;
      let u = stack[top];
      let list = adjacency[u];
      if (cursor[top] < list.length) {
        let v = list[cursor[top]], linkId = list[cursor[top] + 1];
        cursor[top] += 2;
        if (enter[v] < 0) {
          parent[v] = u;
          parentLink[v] = linkId;
          enter[v] = low[v] = clock++;
          size[v] = 1;
          componentOf[v] = component;
          count += 1;
          stack.push(v);
          cursor.push(0);
        } else if (linkId !== parentLink[u]) {
          if (enter[v] < low[u]) low[u] = enter[v];
        }
      } else {
        stack.pop();
        cursor.pop();
        let p = parent[u];
        if (p >= 0) {
          if (low[u] < low[p]) low[p] = low[u];
          size[p] += size[u];
        }
      }
    }
    componentSize.push(count);
  }

  let load = new Map();
  let hubOfLink = new Map();
  for (let v = 0; v < n; ++v) {
    let p = parent[v];
    if (p < 0 || low[v] <= enter[p]) continue; // not a bridge
    let below = size[v];
    let above = componentSize[componentOf[v]] - below;
    let hub, branch;
    if (below <= maxBranch && below < above) {
      hub = p;
      branch = below;
    } else if (above <= maxBranch && above < below) {
      hub = v;
      branch = above;
    } else {
      continue;
    }
    let hubId = ids[hub];
    load.set(hubId, (load.get(hubId) || 0) + branch);
    hubOfLink.set(parentLink[v], hubId);
  }
  return {load, hubOfLink};
}
