import React from 'react';
import type { AlgorithmResult } from '../../algorithms/types';
import './Stats.css';

interface StatsProps {
  result: AlgorithmResult | null;
  isVisualizing: boolean;
}

const Stats: React.FC<StatsProps> = ({ result, isVisualizing }) => {
  if (!result || isVisualizing) {
    return null;
  }

  return (
    <div className={`stats-container ${result.pathFound ? 'success' : 'no-path'}`}>
      <div className="stats-header">
        {result.pathFound ? '✅ Path Found!' : '❌ No Path Found'}
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Path Length:</span>
          <span className="stat-value">
            {result.pathFound ? result.path.length : '—'}
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Nodes Visited:</span>
          <span className="stat-value">{result.visited.length}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Total Cost:</span>
          <span className="stat-value">
            {result.totalCost !== undefined ? result.totalCost.toFixed(1) : '—'}
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Time:</span>
          <span className="stat-value">
            {result.executionTime.toFixed(2)}ms
          </span>
        </div>
      </div>

      {result.pathFound && (
        <div className="stats-info">
          <p>
            Found shortest path in <strong>{result.visited.length}</strong> nodes
            {result.totalCost !== undefined && (
              <>
                {' '}
                with total cost of <strong>{result.totalCost.toFixed(1)}</strong>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default Stats;
