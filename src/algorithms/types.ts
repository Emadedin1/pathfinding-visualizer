export type NodeType =
  | 'empty'
  | 'wall'
  | 'weight'
  | 'start'
  | 'target'
  | 'visited'
  | 'path';

export interface Position {
  row: number;
  col: number;
}

export interface GridNode {
  position: Position;
  type: NodeType;
  distance?: number;
  weight: number;
}

export interface AlgorithmResult {
  visited: Position[];
  path: Position[];
  pathFound: boolean;
  totalCost?: number;
  executionTime: number;
}

export type AlgorithmName =
  | 'dijkstra'
  | 'astar'
  | 'bfs'
  | 'dfs'
  | 'greedy-best-first';

export type MazeName =
  | 'recursive-division'
  | 'random-walls'
  | 'random-weights'
  | 'stairs';

export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'instant';

export interface GridState {
  nodes: GridNode[][];
  startPos: Position;
  targetPos: Position;
}
