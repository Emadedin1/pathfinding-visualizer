import React, { useState } from 'react';
import type { AlgorithmName, MazeName } from '../../algorithms/types';
import './Controls.css';

interface ControlsProps {
  selectedAlgorithm: AlgorithmName;
  onAlgorithmChange: (algo: AlgorithmName) => void;
  
  selectedMaze: MazeName;
  onMazeChange: (maze: MazeName) => void;
  
  onVisualize: () => void;
  onClearPath: () => void;
  onClearBoard: () => void;
  onClearWalls: () => void;
  
  toolMode: 'wall' | 'weight';
  onToolModeChange: (mode: 'wall' | 'weight') => void;
  
  isVisualizing: boolean;
  onStop?: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  selectedAlgorithm,
  onAlgorithmChange,
  selectedMaze,
  onMazeChange,
  onVisualize,
  onClearPath,
  onClearBoard,
  onClearWalls,
  toolMode,
  onToolModeChange,
  isVisualizing,
  onStop,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('algorithm');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="controls-container">
      <h1 className="controls-title">Pathfinding Visualizer</h1>

      {/* Algorithm Section */}
      <div className="control-section">
        <button
          className="section-header"
          onClick={() => toggleSection('algorithm')}
        >
          <span>🔍 Algorithm</span>
          <span>{expandedSection === 'algorithm' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'algorithm' && (
          <div className="section-content">
            <select
              value={selectedAlgorithm}
              onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmName)}
              disabled={isVisualizing}
              className="control-select"
            >
              <option value="dijkstra">Dijkstra</option>
              <option value="astar">A* Search</option>
              <option value="bfs">Breadth-First Search</option>
              <option value="dfs">Depth-First Search</option>
              <option value="greedy-best-first">Greedy Best-First</option>
            </select>
            <p className="algorithm-description">
              {getAlgorithmDescription(selectedAlgorithm)}
            </p>
          </div>
        )}
      </div>

      {/* Maze Section */}
      <div className="control-section">
        <button
          className="section-header"
          onClick={() => toggleSection('maze')}
        >
          <span>🏗️ Maze</span>
          <span>{expandedSection === 'maze' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'maze' && (
          <div className="section-content">
            <select
              value={selectedMaze}
              onChange={(e) => onMazeChange(e.target.value as MazeName)}
              disabled={isVisualizing}
              className="control-select"
            >
              <option value="recursive-division">Recursive Division</option>
              <option value="random-walls">Random Walls</option>
              <option value="random-weights">Random Weights</option>
              <option value="stairs">Stairs</option>
            </select>
          </div>
        )}
      </div>


      {/* Tools Section */}
      <div className="control-section">
        <button
          className="section-header"
          onClick={() => toggleSection('tools')}
        >
          <span>🛠️ Tools</span>
          <span>{expandedSection === 'tools' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'tools' && (
          <div className="section-content">
            <div className="button-group">
              <button
                className={`tool-button ${toolMode === 'wall' ? 'active' : ''}`}
                onClick={() => onToolModeChange('wall')}
                disabled={isVisualizing}
                title="W"
              >
                🧱 Wall
              </button>
              <button
                className={`tool-button ${toolMode === 'weight' ? 'active' : ''}`}
                onClick={() => onToolModeChange('weight')}
                disabled={isVisualizing}
                title="E"
              >
                ⚖️ Weight
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="control-section">
        <div className="section-content action-buttons">
          <button
            onClick={onVisualize}
            disabled={isVisualizing}
            className="btn btn-primary"
            title="Space or Enter"
          >
            🎬 Visualize
          </button>
          {isVisualizing && onStop && (
            <button
              onClick={onStop}
              className="btn btn-danger"
            >
              ⏹️ Stop
            </button>
          )}
          <button
            onClick={onClearPath}
            disabled={isVisualizing}
            className="btn btn-secondary"
            title="C"
          >
            Clear Path
          </button>
          <button
            onClick={onClearWalls}
            disabled={isVisualizing}
            className="btn btn-secondary"
          >
            Clear Walls
          </button>
          <button
            onClick={onClearBoard}
            disabled={isVisualizing}
            className="btn btn-secondary"
            title="R"
          >
            Reset Board
          </button>
        </div>
      </div>
    </div>
  );
};

const getAlgorithmDescription = (algo: AlgorithmName): string => {
  const descriptions: Record<AlgorithmName, string> = {
    dijkstra: 'Weighted algorithm that guarantees the shortest path. Uses edge relaxation.',
    astar: 'Weighted algorithm using Manhattan distance heuristic. Guarantees shortest path.',
    bfs: 'Unweighted algorithm that guarantees the shortest path. Uses a queue.',
    dfs: 'Unweighted algorithm that explores deeply. Does not guarantee shortest path.',
    'greedy-best-first': 'Uses heuristic to prioritize direction. Fast but not optimal.',
  };
  return descriptions[algo] || '';
};


export default Controls;
