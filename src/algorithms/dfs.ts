import type { Position, GridNode, AlgorithmResult } from './types';
import {
  getNeighbors,
  positionKey,
  reconstructPath,
  isWalkable,
} from './helpers';

// Depth-First Search - Unweighted, does not guarantee shortest path
export const dfs = (
  grid: GridNode[][],
  start: Position,
  target: Position
): AlgorithmResult => {
  const startTime = performance.now();
  const rows = grid.length;
  const cols = grid[0].length;
  const visited: Position[] = [];

  const previousMap = new Map<string, Position>();
  const visited_set = new Set<string>();
  const stack: Position[] = [start];

  visited_set.add(positionKey(start));

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) break;

    visited.push(current);

    // Found target
    if (current.row === target.row && current.col === target.col) {
      const path = reconstructPath(previousMap, start, target);
      const endTime = performance.now();

      return {
        visited,
        path,
        pathFound: true,
        totalCost: path.length - 1,
        executionTime: endTime - startTime,
      };
    }

    // Check neighbors (in reverse order for consistent exploration)
    const neighbors = getNeighbors(current, rows, cols);

    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      const neighborKey = positionKey(neighbor);
      const neighborNode = grid[neighbor.row][neighbor.col];

      if (!isWalkable(neighborNode) || visited_set.has(neighborKey)) {
        continue;
      }

      visited_set.add(neighborKey);
      previousMap.set(neighborKey, current);
      stack.push(neighbor);
    }
  }

  const endTime = performance.now();
  return {
    visited,
    path: [],
    pathFound: false,
    executionTime: endTime - startTime,
  };
};
