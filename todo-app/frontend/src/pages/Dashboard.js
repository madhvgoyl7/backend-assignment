import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Fetch tasks error:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.trim()) {
      setError('⚠️ Task title cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/tasks', { title: newTask });
      setTasks([...tasks, response.data.task]);
      setNewTask('');
    } catch (err) {
      setError(err.response?.data?.message || '❌ Failed to add task');
      console.error('Add task error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data.task : task
      ));
    } catch (err) {
      setError('Failed to update task');
      console.error('Toggle status error:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Delete task error:', err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
  };

  const handleSaveEdit = async (taskId) => {
    if (!editTitle.trim()) {
      setError('⚠️ Task title cannot be empty');
      return;
    }

    try {
      const response = await axios.put(`/api/tasks/${taskId}`, { title: editTitle });
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data.task : task
      ));
      setEditingTask(null);
      setEditTitle('');
    } catch (err) {
      setError('Failed to update task');
      console.error('Save edit error:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="dashboard-container">
      <div className="animated-background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="dashboard-card">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              <span className="icon-animate">📝</span>
              My Todo Dashboard
            </h1>
            <p className="welcome-text">Welcome back, <strong>{user?.username}</strong>!</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span>🚪</span> Logout
          </button>
        </div>

        {/* Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <div>
              <div className="stat-number">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>
          <div className="stat-card pending">
            <span className="stat-icon">⏳</span>
            <div>
              <div className="stat-number">{pendingTasks.length}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card completed">
            <span className="stat-icon">✅</span>
            <div>
              <div className="stat-number">{completedTasks.length}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="add-task-form">
          <div className="input-wrapper-task">
            <span className="input-icon">➕</span>
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="task-input"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`add-btn ${loading ? 'loading' : ''}`}
          >
            {loading ? <span className="spinner-small"></span> : '+ Add'}
          </button>
        </form>

        {error && <div className="message error">{error}</div>}

        {/* Tasks List */}
        <div className="tasks-section">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>No tasks yet. Add your first task above!</p>
            </div>
          ) : (
            <>
              {/* Pending Tasks */}
              {pendingTasks.length > 0 && (
                <div className="task-group">
                  <h3 className="task-group-title">
                    <span>⏳</span> Pending Tasks
                  </h3>
                  {pendingTasks.map(task => (
                    <div key={task.id} className="task-item pending-item">
                      {editingTask === task.id ? (
                        <div className="edit-task-form">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="edit-input"
                            autoFocus
                          />
                          <div className="edit-actions">
                            <button 
                              onClick={() => handleSaveEdit(task.id)}
                              className="save-btn"
                            >
                              ✓ Save
                            </button>
                            <button 
                              onClick={handleCancelEdit}
                              className="cancel-btn"
                            >
                              ✗ Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="task-content">
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => handleToggleStatus(task.id, task.status)}
                              className="task-checkbox"
                            />
                            <span className="task-title">{task.title}</span>
                          </div>
                          <div className="task-actions">
                            <button 
                              onClick={() => handleEditTask(task)}
                              className="edit-btn"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDeleteTask(task.id)}
                              className="delete-btn"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div className="task-group">
                  <h3 className="task-group-title">
                    <span>✅</span> Completed Tasks
                  </h3>
                  {completedTasks.map(task => (
                    <div key={task.id} className="task-item completed-item">
                      <div className="task-content">
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => handleToggleStatus(task.id, task.status)}
                          className="task-checkbox"
                        />
                        <span className="task-title completed">{task.title}</span>
                      </div>
                      <div className="task-actions">
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="delete-btn"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
