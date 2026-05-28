import React, { useState, useCallback, useEffect, useRef } from 'react';
import type {
  GridNode as GridNodeType,
  Position,
  AlgorithmName,
  MazeName,
  AlgorithmResult,
} from './algorithms/types';
import Grid from './components/Grid/Grid';
import Controls from './components/Controls/Controls';
import Legend from './components/Legend/Legend';
import Stats from './components/Stats/Stats';
import {
  dijkstra,
  astar,
  bfs,
  dfs,
  greedyBestFirst,
} from './algorithms';
import {
  recursiveDivisionMaze,
  randomWallsMaze,
  randomWeightsMaze,
  stairsPattern,
} from './maze';
import {
  createEmptyGrid,
  cloneGrid,
  setNodeType,
  setNodeWeight,
  clearVisualization,
  clearWallsAndWeights,
  resetGrid,
  calculateResponsiveGridSize,
} from './utils/grid';
import { getAnimationDelay } from './utils/animation';
import './App.css';

const App: React.FC = () => {
  const [gridState, setGridState] = useState<GridNodeType[][]>(() => {
    const gridSize = calculateResponsiveGridSize(window.innerWidth);
    const grid = createEmptyGrid(gridSize.rows, gridSize.cols);
    const start: Position = { row: Math.floor(gridSize.rows / 2), col: 5 };
    const target: Position = { row: Math.floor(gridSize.rows / 2), col: gridSize.cols - 6 };
    grid[start.row][start.col].type = 'start';
    grid[target.row][target.col].type = 'target';
    return grid;
  });

  const [startPos, setStartPos] = useState<Position>({
    row: Math.floor(gridState.length / 2),
    col: 5,
  });
  const [targetPos, setTargetPos] = useState<Position>({
    row: Math.floor(gridState.length / 2),
    col: gridState[0].length - 6,
  });

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmName>('dijkstra');
  const [selectedMaze, setSelectedMaze] = useState<MazeName>('recursive-division');
  const [toolMode, setToolMode] = useState<'wall' | 'weight'>('wall');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [draggingNode, setDraggingNode] = useState<'start' | 'target' | null>(null);

  const visualizationRef = useRef<{ shouldStop: boolean }>({ shouldStop: false });

  // Run algorithm and animate
  const runVisualization = useCallback(async () => {
    setIsVisualizing(true);
    setResult(null);
    visualizationRef.current.shouldStop = false;

    // Create a copy of the current grid for algorithm
    const gridForAlgo = cloneGrid(gridState);

    let algorithmResult: AlgorithmResult;

    // Run selected algorithm
    switch (selectedAlgorithm) {
      case 'dijkstra':
        algorithmResult = dijkstra(gridForAlgo, startPos, targetPos);
        break;
      case 'astar':
        algorithmResult = astar(gridForAlgo, startPos, targetPos);
        break;
      case 'bfs':
        algorithmResult = bfs(gridForAlgo, startPos, targetPos);
        break;
      case 'dfs':
        algorithmResult = dfs(gridForAlgo, startPos, targetPos);
        break;
      case 'greedy-best-first':
        algorithmResult = greedyBestFirst(gridForAlgo, startPos, targetPos);
        break;
      default:
        algorithmResult = dijkstra(gridForAlgo, startPos, targetPos);
    }

    const delay = getAnimationDelay('normal');

    // Visualize visited nodes
    const visualGrid = cloneGrid(gridState);
    for (const pos of algorithmResult.visited) {
      if (visualizationRef.current.shouldStop) break;
      
      if (visualGrid[pos.row][pos.col].type === 'empty') {
        visualGrid[pos.row][pos.col].type = 'visited';
      }
      setGridState(cloneGrid(visualGrid));
      
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Visualize path (only if not stopped)
    if (!visualizationRef.current.shouldStop) {
      for (const pos of algorithmResult.path) {
        if (visualizationRef.current.shouldStop) break;
        
        if (visualGrid[pos.row][pos.col].type !== 'start' && visualGrid[pos.row][pos.col].type !== 'target') {
          visualGrid[pos.row][pos.col].type = 'path';
        }
        setGridState(cloneGrid(visualGrid));
        
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      setResult(algorithmResult);
    }

    setIsVisualizing(false);
  }, [gridState, startPos, targetPos, selectedAlgorithm]);

  // Stop visualization
  const stopVisualization = useCallback(() => {
    visualizationRef.current.shouldStop = true;
    setIsVisualizing(false);
  }, []);

  // Handle node mouse down
  const handleNodeMouseDown = useCallback(
    (pos: Position, button: number) => {
      if (isVisualizing) return;

      const node = gridState[pos.row][pos.col];

      if (button === 2) {
        // Right-click: erase wall or weight
        if (node.type === 'wall' || node.type === 'weight') {
          const newGrid = cloneGrid(gridState);
          setNodeType(newGrid, pos, 'empty');
          setNodeWeight(newGrid, pos, 1);
          setGridState(newGrid);
        }
      } else if (button === 0) {
        // Left-click
        if (node.type === 'start') {
          setDraggingNode('start');
        } else if (node.type === 'target') {
          setDraggingNode('target');
        } else if (toolMode === 'wall' && node.type === 'empty') {
          const newGrid = cloneGrid(gridState);
          setNodeType(newGrid, pos, 'wall');
          setGridState(newGrid);
        } else if (toolMode === 'weight' && node.type === 'empty') {
          const newGrid = cloneGrid(gridState);
          setNodeType(newGrid, pos, 'weight');
          setNodeWeight(newGrid, pos, 5);
          setGridState(newGrid);
        }
      }
    },
    [gridState, toolMode, isVisualizing]
  );

  // Handle node mouse enter (for dragging)
  const handleNodeMouseEnter = useCallback(
    (pos: Position, button: number | null) => {
      if (isVisualizing) return;

      const node = gridState[pos.row][pos.col];
      const newGrid = cloneGrid(gridState);

      if (draggingNode === 'start') {
        setNodeType(newGrid, startPos, 'empty');
        setNodeType(newGrid, pos, 'start');
        setStartPos(pos);
        setGridState(newGrid);
        return;
      }

      if (draggingNode === 'target') {
        setNodeType(newGrid, targetPos, 'empty');
        setNodeType(newGrid, pos, 'target');
        setTargetPos(pos);
        setGridState(newGrid);
        return;
      }

      if (button === 0) {
        if (toolMode === 'wall' && node.type === 'empty') {
          setNodeType(newGrid, pos, 'wall');
          setGridState(newGrid);
        } else if (toolMode === 'weight' && node.type === 'empty') {
          setNodeType(newGrid, pos, 'weight');
          setNodeWeight(newGrid, pos, 5);
          setGridState(newGrid);
        }
      } else if (button === 2) {
        if (node.type === 'wall' || node.type === 'weight') {
          setNodeType(newGrid, pos, 'empty');
          setNodeWeight(newGrid, pos, 1);
          setGridState(newGrid);
        }
      }
    },
    [draggingNode, startPos, targetPos, gridState, toolMode, isVisualizing]
  );

  // Handle mouse up
  const handleNodeMouseUp = useCallback(() => {
    setDraggingNode(null);
  }, []);

  // Handle context menu
  const handleNodeContextMenu = useCallback(
    (e: React.MouseEvent, pos: Position) => {
      e.preventDefault();
      if (isVisualizing) return;

      const node = gridState[pos.row][pos.col];
      if (node.type === 'wall' || node.type === 'weight') {
        const newGrid = cloneGrid(gridState);
        setNodeType(newGrid, pos, 'empty');
        setNodeWeight(newGrid, pos, 1);
        setGridState(newGrid);
      }
    },
    [gridState, isVisualizing]
  );

  // Generate maze for the selected maze type
  const generateMaze = useCallback(
    (mazeType: MazeName) => {
      if (isVisualizing) return;

      let walls: Position[] = [];

      switch (mazeType) {
        case 'recursive-division':
          walls = recursiveDivisionMaze(gridState.length, gridState[0].length, startPos, targetPos);
          break;
        case 'random-walls':
          walls = randomWallsMaze(gridState.length, gridState[0].length, startPos, targetPos, 0.25);
          break;
        case 'random-weights':
          walls = randomWeightsMaze(gridState.length, gridState[0].length, startPos, targetPos, 0.20);
          break;
        case 'stairs':
          walls = stairsPattern(gridState.length, gridState[0].length, startPos, targetPos);
          break;
      }

      const newGrid = clearVisualization(clearWallsAndWeights(gridState));

      for (const pos of walls) {
        if (mazeType === 'random-weights') {
          setNodeType(newGrid, pos, 'weight');
          setNodeWeight(newGrid, pos, 5);
        } else {
          setNodeType(newGrid, pos, 'wall');
        }
      }

      setGridState(newGrid);
      setResult(null);
    },
    [gridState, startPos, targetPos, isVisualizing]
  );

  // Reset entire board
  const handleClearBoard = useCallback(() => {
    const newGrid = resetGrid(gridState.length, gridState[0].length, startPos, targetPos);
    setGridState(newGrid);
    setResult(null);
  }, [gridState, startPos, targetPos]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVisualizing) return;

      switch (e.key.toLowerCase()) {
        case 'w':
          setToolMode('wall');
          break;
        case 'e':
          setToolMode('weight');
          break;
        case 'r':
          handleClearBoard();
          break;
        case ' ':
        case 'enter':
          e.preventDefault();
          runVisualization();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClearBoard, runVisualization, isVisualizing]);

  return (
    <div className="app">
      <div className="app-layout">
        <div className="main-content">
          <div className="grid-wrapper">
            <Grid
              grid={gridState}
              onNodeMouseDown={handleNodeMouseDown}
              onNodeMouseEnter={handleNodeMouseEnter}
              onNodeMouseUp={handleNodeMouseUp}
              onNodeContextMenu={handleNodeContextMenu}
              isVisualizing={isVisualizing}
            />
          </div>
          <div className="bottom-panel">
            <Stats result={result} isVisualizing={isVisualizing} />
          </div>
        </div>

        <div className="sidebar">
          <Controls
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmChange={setSelectedAlgorithm}
            selectedMaze={selectedMaze}
            onMazeChange={(maze) => {
              setSelectedMaze(maze);
              // Auto-generate maze when selected using the new option directly
              setTimeout(() => generateMaze(maze), 50);
            }}
            onVisualize={runVisualization}
            onClearBoard={handleClearBoard}
            toolMode={toolMode}
            onToolModeChange={setToolMode}
            isVisualizing={isVisualizing}
            onStop={stopVisualization}
          />
          <Legend />
        </div>
      </div>
    </div>
  );
};

export default App;
