import React from 'react';
import './Legend.css';

const Legend: React.FC = () => {
  const items = [
    { color: 'node-start', label: 'Start Node', emoji: '🟢' },
    { color: 'node-target', label: 'Target Node', emoji: '🔴' },
    { color: 'node-empty', label: 'Empty Node', emoji: '⚪' },
    { color: 'node-wall', label: 'Wall Node', emoji: '⬛' },
    { color: 'node-weight', label: 'Weighted Node', emoji: '🟣' },
    { color: 'node-visited', label: 'Visited Node', emoji: '🔵' },
    { color: 'node-path', label: 'Shortest Path', emoji: '🟡' },
  ];

  return (
    <div className="legend-container">
      <h3 className="legend-title">Legend</h3>
      <div className="legend-items">
        {items.map((item) => (
          <div key={item.label} className="legend-item">
            <div className={`legend-color ${item.color}`} />
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="legend-instructions">
        <h4>How to use:</h4>
        <ul>
          <li><strong>Click</strong> to draw walls</li>
          <li><strong>Right-click</strong> to draw weights</li>
          <li><strong>Drag</strong> start/target to move them</li>
          <li>Generate a maze or customize your board</li>
          <li>Select algorithm and click Visualize</li>
        </ul>
      </div>
    </div>
  );
};

export default Legend;
