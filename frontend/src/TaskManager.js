import React, { useState, useEffect } from 'react';
import { Plus, X, Sun, Moon, Check } from 'lucide-react';
import './TaskManager.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [nextId, setNextId] = useState(1);

  // Add task function
  const addTask = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      const newTask = {
        id: nextId,
        text: inputValue.trim(),
        completed: false,
        isNew: true
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
      setNextId(nextId + 1);
      
      // Remove the new animation class after animation completes
      setTimeout(() => {
        setTasks(prev => prev.map(task => 
          task.id === newTask.id ? { ...task, isNew: false } : task
        ));
      }, 500);
    }
  };

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isDeleting: true } : task
    ));
    
    setTimeout(() => {
      setTasks(tasks.filter(task => task.id !== id));
    }, 300);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Get task counts
  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-top">
            <div></div>
            <h1 className="app-title">TaskFlow</h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="theme-toggle"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <p className="app-subtitle">Stay organized, stay productive</p>
        </header>

        {/* Add Task Form */}
        <div className="add-task-form">
          <div className="input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask(e)}
              placeholder="What needs to be done?"
              className="task-input"
            />
            <button
              type="button"
              onClick={addTask}
              disabled={!inputValue.trim()}
              className="add-button"
            >
              <Plus size={18} />
              Add Task
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {[
            { key: 'all', label: 'All', count: tasks.length },
            { key: 'active', label: 'Active', count: activeCount },
            { key: 'completed', label: 'Completed', count: completedCount }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`filter-tab ${filter === key ? 'active' : ''}`}
            >
              {label}
              <span className="count-badge">{count}</span>
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <p className="empty-text">
                {filter === 'completed' ? 'No completed tasks yet' :
                 filter === 'active' ? 'No active tasks' :
                 'No tasks yet. Add one above!'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`task-item ${task.isNew ? 'slide-in' : ''} ${task.isDeleting ? 'slide-out' : ''}`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`checkbox ${task.completed ? 'checked' : ''}`}
                >
                  {task.completed && <Check size={14} className="check-icon" />}
                </button>

                {/* Task Text */}
                <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                  {task.text}
                </span>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="delete-button"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Task Summary */}
        {tasks.length > 0 && (
          <div className="task-summary">
            {activeCount > 0 && (
              <p>{activeCount} task{activeCount !== 1 ? 's' : ''} remaining</p>
            )}
            {completedCount > 0 && activeCount === 0 && (
              <p>🎉 All tasks completed! Great job!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;