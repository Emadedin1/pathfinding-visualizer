import type { Position, GridNode, AlgorithmResult } from './types';
import {
  getNeighbors,
  positionKey,
  reconstructPath,
  getMoveCost,
  isWalkable,
} from './helpers';

// Dijkstra's Algorithm - Weighted, guarantees shortest path
export const dijkstra = (
  grid: GridNode[][],
  start: Position,
  target: Position
): AlgorithmResult => {
  const startTime = performance.now();
  const rows = grid.length;
  const cols = grid[0].length;
  const visited: Position[] = [];

  // Distance from start to each node
  const distances = new Map<string, number>();
  const previousMap = new Map<string, Position>();
  const unvisited = new Set<string>();

  // Initialize distances
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = positionKey({ row: r, col: c });
      distances.set(key, Infinity);
      unvisited.add(key);
    }
  }

  distances.set(positionKey(start), 0);

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let current: Position | null = null;
    let minDistance = Infinity;

    for (const key of unvisited) {
      const dist = distances.get(key) ?? Infinity;
      if (dist < minDistance) {
        minDistance = dist;
        const [row, col] = key.split(',').map(Number);
        current = { row, col };
      }
    }

    if (current === null || minDistance === Infinity) {
      break; // No path found
    }

    const currentKey = positionKey(current);
    unvisited.delete(currentKey);
    visited.push(current);

    // Found target
    if (current.row === target.row && current.col === target.col) {
      const path = reconstructPath(previousMap, start, target);
      const endTime = performance.now();
      const totalCost = distances.get(positionKey(target)) ?? 0;

      return {
        visited,
        path,
        pathFound: true,
        totalCost,
        executionTime: endTime - startTime,
      };
    }

    // Check neighbors
    const neighbors = getNeighbors(current, rows, cols);
    const currentDistance = distances.get(currentKey) ?? Infinity;

    for (const neighbor of neighbors) {
      const neighborKey = positionKey(neighbor);
      const neighborNode = grid[neighbor.row][neighbor.col];

      if (!isWalkable(neighborNode) || !unvisited.has(neighborKey)) {
        continue;
      }

      const moveCost = getMoveCost(neighborNode);
      const newDistance = currentDistance + moveCost;
      const oldDistance = distances.get(neighborKey) ?? Infinity;

      // Edge relaxation
      if (newDistance < oldDistance) {
        distances.set(neighborKey, newDistance);
        previousMap.set(neighborKey, current);
      }
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
