import type { Position, GridNode } from './types';

// Calculate Manhattan distance between two positions
export const manhattanDistance = (from: Position, to: Position): number => {
  return Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
};

// Check if a position is within grid bounds
export const isWithinBounds = (
  pos: Position,
  rows: number,
  cols: number
): boolean => {
  return pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols;
};

// Check if two positions are equal
export const isEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.row === pos2.row && pos1.col === pos2.col;
};

// Get neighbors (4-directional: up, down, left, right)
export const getNeighbors = (
  pos: Position,
  rows: number,
  cols: number
): Position[] => {
  const neighbors: Position[] = [];
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 },  // right
  ];

  for (const dir of directions) {
    const newPos = { row: pos.row + dir.row, col: pos.col + dir.col };
    if (isWithinBounds(newPos, rows, cols)) {
      neighbors.push(newPos);
    }
  }

  return neighbors;
};

// Create a position key for use in maps/sets
export const positionKey = (pos: Position): string => {
  return `${pos.row},${pos.col}`;
};

// Parse position key back to Position
export const parsePositionKey = (key: string): Position => {
  const [row, col] = key.split(',').map(Number);
  return { row, col };
};

// Reconstruct path by backtracking from target to start
export const reconstructPath = (
  previousMap: Map<string, Position>,
  start: Position,
  end: Position
): Position[] => {
  const path: Position[] = [];
  let current = end;

  while (!isEqual(current, start)) {
    path.push(current);
    const key = positionKey(current);
    const prev = previousMap.get(key);
    if (!prev) break;
    current = prev;
  }

  path.push(start);
  return path.reverse();
};

// Check if a node is walkable (not wall)
export const isWalkable = (node: GridNode): boolean => {
  return node.type !== 'wall';
};

// Get the cost to move to a node
export const getMoveCost = (node: GridNode): number => {
  return node.weight;
};
