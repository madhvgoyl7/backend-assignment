import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import './Profile.css';

function Profile() {
  const { member, logout, refreshProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  const viewDownline = () => {
    navigate('/downline');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Member Profile</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-info">
            <div className="info-group">
              <label>Member Code</label>
              <div className="info-value member-code">{member?.member_code}</div>
            </div>
            
            <div className="info-group">
              <label>Full Name</label>
              <div className="info-value">{member?.name}</div>
            </div>
            
            <div className="info-group">
              <label>Email</label>
              <div className="info-value">{member?.email}</div>
            </div>
            
            <div className="info-group">
              <label>Sponsor Code</label>
              <div className="info-value">
                {member?.sponsor_code || 'Root Member'}
              </div>
            </div>
            
            {member?.position && (
              <div className="info-group">
                <label>Position</label>
                <div className="info-value position-badge">
                  {member.position.toUpperCase()}
                </div>
              </div>
            )}
            
            <div className="info-group">
              <label>Joined Date</label>
              <div className="info-value">
                {new Date(member?.joined_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {stats && (
          <div className="stats-section">
            <h2 className="stats-title">Network Statistics</h2>
            
            <div className="stats-grid">
              <div className="stat-card total">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.total_members}</div>
                  <div className="stat-label">Total Members</div>
                </div>
              </div>
              
              <div className="stat-card left">
                <div className="stat-icon">⬅️</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.left_count}</div>
                  <div className="stat-label">Left Team</div>
                  <div className="stat-sublabel">
                    Direct: {stats.direct_left}
                  </div>
                </div>
              </div>
              
              <div className="stat-card right">
                <div className="stat-icon">➡️</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.right_count}</div>
                  <div className="stat-label">Right Team</div>
                  <div className="stat-sublabel">
                    Direct: {stats.direct_right}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="action-section">
          <button onClick={viewDownline} className="view-downline-button">
            View Complete Downline Tree
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
