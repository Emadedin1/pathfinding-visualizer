import type { Position, GridNode, AlgorithmResult } from './types';
import {
  getNeighbors,
  manhattanDistance,
  positionKey,
  reconstructPath,
  getMoveCost,
  isWalkable,
} from './helpers';

// A* Search - Weighted, uses Manhattan distance heuristic
export const astar = (
  grid: GridNode[][],
  start: Position,
  target: Position
): AlgorithmResult => {
  const startTime = performance.now();
  const rows = grid.length;
  const cols = grid[0].length;
  const visited: Position[] = [];

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const previousMap = new Map<string, Position>();

  // Priority queue: list of unvisited nodes sorted by fScore
  let openSet: Position[] = [start];

  const heuristic = (pos: Position): number => {
    return manhattanDistance(pos, target);
  };

  const getKey = (pos: Position): string => positionKey(pos);

  // Initialize
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = getKey({ row: r, col: c });
      gScore.set(key, Infinity);
      fScore.set(key, Infinity);
    }
  }

  const startKey = getKey(start);
  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(start));

  while (openSet.length > 0) {
    // Find node with lowest fScore
    let current = openSet[0];
    let lowestIdx = 0;
    let lowestFScore = fScore.get(getKey(current)) ?? Infinity;

    for (let i = 1; i < openSet.length; i++) {
      const f = fScore.get(getKey(openSet[i])) ?? Infinity;
      if (f < lowestFScore) {
        lowestFScore = f;
        current = openSet[i];
        lowestIdx = i;
      }
    }

    // Remove from open set
    openSet.splice(lowestIdx, 1);
    visited.push(current);

    // Found target
    if (current.row === target.row && current.col === target.col) {
      const path = reconstructPath(previousMap, start, target);
      const endTime = performance.now();
      const totalCost = gScore.get(getKey(target)) ?? 0;

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
    const currentG = gScore.get(getKey(current)) ?? Infinity;

    for (const neighbor of neighbors) {
      const neighborKey = getKey(neighbor);
      const neighborNode = grid[neighbor.row][neighbor.col];

      if (!isWalkable(neighborNode)) {
        continue;
      }

      // Skip if already visited
      const isInOpen = openSet.some(
        (n) => n.row === neighbor.row && n.col === neighbor.col
      );
      if (visited.some((n) => n.row === neighbor.row && n.col === neighbor.col)) {
        if (!isInOpen) continue;
      }

      const moveCost = getMoveCost(neighborNode);
      const tentativeG = currentG + moveCost;
      const oldG = gScore.get(neighborKey) ?? Infinity;

      if (tentativeG < oldG) {
        previousMap.set(neighborKey, current);
        gScore.set(neighborKey, tentativeG);
        const newF = tentativeG + heuristic(neighbor);
        fScore.set(neighborKey, newF);

        if (!isInOpen) {
          openSet.push(neighbor);
        }
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
