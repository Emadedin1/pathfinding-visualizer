import type { Position, GridNode, AlgorithmResult } from './types';
import {
  getNeighbors,
  manhattanDistance,
  positionKey,
  reconstructPath,
  isWalkable,
} from './helpers';

// Greedy Best-First Search - Uses heuristic, does not guarantee shortest path
export const greedyBestFirst = (
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

  // Priority queue: sorted by heuristic distance to target
  const openSet: Position[] = [start];

  const heuristic = (pos: Position): number => {
    return manhattanDistance(pos, target);
  };

  const getKey = (pos: Position): string => positionKey(pos);

  visited_set.add(getKey(start));

  while (openSet.length > 0) {
    // Find node with lowest heuristic
    let current = openSet[0];
    let lowestIdx = 0;
    let lowestH = heuristic(current);

    for (let i = 1; i < openSet.length; i++) {
      const h = heuristic(openSet[i]);
      if (h < lowestH) {
        lowestH = h;
        current = openSet[i];
        lowestIdx = i;
      }
    }

    openSet.splice(lowestIdx, 1);
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
      const neighborKey = getKey(neighbor);
      const neighborNode = grid[neighbor.row][neighbor.col];

      if (!isWalkable(neighborNode) || visited_set.has(neighborKey)) {
        continue;
      }

      visited_set.add(neighborKey);
      previousMap.set(neighborKey, current);
      openSet.push(neighbor);
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
