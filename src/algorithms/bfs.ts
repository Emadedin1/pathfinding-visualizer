import type { Position, GridNode, AlgorithmResult } from './types';
import {
  getNeighbors,
  positionKey,
  reconstructPath,
  isWalkable,
} from './helpers';

// Breadth-First Search - Unweighted, guarantees shortest path
export const bfs = (
  grid: GridNode[][],
  start: Position,
  target: Position
): AlgorithmResult => {
  const startTime = performance.now();
  const rows = grid.length;
  const cols = grid[0].length;
  const visited: Position[] = [];

  const previousMap = new Map<string, Position>();
  const queue: Position[] = [start];
  const visited_set = new Set<string>();

  visited_set.add(positionKey(start));

  while (queue.length > 0) {
    const current = queue.shift();
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

    // Check neighbors
    const neighbors = getNeighbors(current, rows, cols);

    for (const neighbor of neighbors) {
      const neighborKey = positionKey(neighbor);
      const neighborNode = grid[neighbor.row][neighbor.col];

      if (!isWalkable(neighborNode) || visited_set.has(neighborKey)) {
        continue;
      }

      visited_set.add(neighborKey);
      previousMap.set(neighborKey, current);
      queue.push(neighbor);
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
