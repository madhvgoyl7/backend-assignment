import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './Downline.css';

function Downline() {
  const [downline, setDownline] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDownline();
  }, []);

  const fetchDownline = async () => {
    try {
      const response = await axios.get('/downline');
      setDownline(response.data);
    } catch (error) {
      console.error('Error fetching downline:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTree = (node, level = 0) => {
    if (!node) return null;

    const hasChildren = node.left_member || node.right_member;

    return (
      <div className="tree-node" style={{ '--level': level }}>
        <div className="node-card">
          <div className="node-header">
            <div className="node-code">{node.member_code}</div>
            {node.position && (
              <div className={`node-position ${node.position}`}>
                {node.position}
              </div>
            )}
          </div>
          <div className="node-name">{node.name}</div>
          <div className="node-stats">
            <span className="stat-left">L: {node.left_count}</span>
            <span className="stat-right">R: {node.right_count}</span>
          </div>
        </div>

        {hasChildren && (
          <div className="node-children">
            {node.left_member && (
              <div className="child-branch left-branch">
                <div className="branch-line"></div>
                {renderTree(node.left_member, level + 1)}
              </div>
            )}
            {node.right_member && (
              <div className="child-branch right-branch">
                <div className="branch-line"></div>
                {renderTree(node.right_member, level + 1)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="downline-container">
        <div className="loading">Loading downline...</div>
      </div>
    );
  }

  return (
    <div className="downline-container">
      <div className="downline-header">
        <button onClick={() => navigate('/profile')} className="back-button">
          ← Back to Profile
        </button>
        <h1 className="downline-title">My Downline Tree</h1>
      </div>

      <div className="tree-container">
        {downline ? renderTree(downline) : <div>No downline data available</div>}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color left"></div>
          <span>Left Position</span>
        </div>
        <div className="legend-item">
          <div className="legend-color right"></div>
          <span>Right Position</span>
        </div>
        <div className="legend-item">
          <span>L / R = Left Count / Right Count</span>
        </div>
      </div>
    </div>
  );
}

export default Downline;
