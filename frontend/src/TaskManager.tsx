import React, { useState, useEffect } from 'react';
import { 
  Plus, X, Sun, Moon, Check, Star, Calendar, 
  Bell, Tag, Search, Menu, Home, User, Settings,
  ChevronRight, Clock, Flag, MoreHorizontal,
  Edit3, Trash2, Archive, Copy
} from 'lucide-react';
import './TaskManager.css';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  important: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  reminder: string | null;
  notes: string;
  category: string;
  createdAt: Date;
  isNew?: boolean;
  isDeleting?: boolean;
}

interface List {
  id: string;
  name: string;
  icon: any;
  color: string;
}

interface Priority {
  id: string;
  name: string;
  color: string;
  flag: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('my-day');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [nextId, setNextId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for dynamic backgrounds
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Sample lists for sidebar
  const [lists] = useState<List[]>([
    { id: 'my-day', name: 'My Day', icon: Sun, color: '#ff6b6b' },
    { id: 'important', name: 'Important', icon: Star, color: '#ffd93d' },
    { id: 'planned', name: 'Planned', icon: Calendar, color: '#6bcf7f' },
    { id: 'all', name: 'All Tasks', icon: Home, color: '#4ecdc4' },
  ]);

  // Priority levels
  const priorities: Priority[] = [
    { id: 'low', name: 'Low', color: '#6bcf7f', flag: '🟢' },
    { id: 'medium', name: 'Medium', color: '#ffd93d', flag: '🟡' },
    { id: 'high', name: 'High', color: '#ff6b6b', flag: '🔴' },
  ];

  // Add task function with animations
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      const newTask: Task = {
        id: nextId,
        text: inputValue.trim(),
        completed: false,
        important: false,
        priority: 'medium',
        dueDate: null,
        reminder: null,
        notes: '',
        category: filter === 'all' ? 'my-day' : filter,
        createdAt: new Date(),
        isNew: true
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
      setNextId(nextId + 1);
      
      setTimeout(() => {
        setTasks(prev => prev.map(task => 
          task.id === newTask.id ? { ...task, isNew: false } : task
        ));
      }, 500);
    }
  };

  // Toggle task completion with animation
  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Toggle important
  const toggleImportant = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, important: !task.important } : task
    ));
  };

  // Delete task with animation
  const deleteTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isDeleting: true } : task
    ));
    
    setTimeout(() => {
      setTasks(tasks.filter(task => task.id !== id));
      if (selectedTask?.id === id) {
        setSelectedTask(null);
        setShowTaskDetails(false);
      }
    }, 300);
  };

  // Update task
  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
    if (selectedTask?.id === id) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
  };

  // Filter tasks based on current view
  const getFilteredTasks = () => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filter) {
      case 'my-day':
        const today = new Date().toDateString();
        filtered = filtered.filter(task => 
          task.category === 'my-day' || 
          (task.dueDate && new Date(task.dueDate).toDateString() === today)
        );
        break;
      case 'important':
        filtered = filtered.filter(task => task.important);
        break;
      case 'planned':
        filtered = filtered.filter(task => task.dueDate);
        break;
      case 'all':
      default:
        break;
    }

    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.important !== b.important) return b.important ? 1 : -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const filteredTasks = getFilteredTasks();
  const completedTasks = filteredTasks.filter(task => task.completed);
  const activeTasks = filteredTasks.filter(task => !task.completed);

  // Get current list info
  const currentList = lists.find(list => list.id === filter) || lists[0];

  // Get dynamic gradient based on time
  const getTimeBasedGradient = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) {
      return isDarkMode ? 'morning-dark' : 'morning-light';
    } else if (hour >= 12 && hour < 18) {
      return isDarkMode ? 'afternoon-dark' : 'afternoon-light';
    } else if (hour >= 18 && hour < 21) {
      return isDarkMode ? 'evening-dark' : 'evening-light';
    } else {
      return isDarkMode ? 'night-dark' : 'night-light';
    }
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'} ${getTimeBasedGradient()}`}>
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-glass">
          <div className="sidebar-header">
            <div className="user-info">
              <div className="user-avatar neumorphic">
                <User size={20} />
              </div>
              <div className="user-details">
                <h3>My Tasks</h3>
                <p>Stay productive</p>
              </div>
            </div>
            <button 
              className="sidebar-toggle neumorphic-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="sidebar-content">
            <div className="search-container">
              <div className="search-wrapper neumorphic-inset">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <nav className="sidebar-nav">
              {lists.map(list => {
                const Icon = list.icon;
                const count = list.id === 'important' 
                  ? tasks.filter(t => t.important && !t.completed).length
                  : list.id === 'planned'
                  ? tasks.filter(t => t.dueDate && !t.completed).length
                  : list.id === 'my-day'
                  ? tasks.filter(t => t.category === 'my-day' && !t.completed).length
                  : tasks.filter(t => !t.completed).length;

                return (
                  <button
                    key={list.id}
                    onClick={() => setFilter(list.id)}
                    className={`nav-item ${filter === list.id ? 'active' : ''} neumorphic-btn`}
                    style={{ '--accent-color': list.color } as React.CSSProperties}
                  >
                    <Icon size={20} />
                    <span>{list.name}</span>
                    {count > 0 && (
                      <span className="count glass-badge" style={{ backgroundColor: list.color }}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="sidebar-footer">
              <button className="footer-btn neumorphic-btn">
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <button 
                className="footer-btn theme-toggle neumorphic-btn"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span>{isDarkMode ? 'Light' : 'Dark'} mode</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-glass">
          {/* Header */}
          <header className="main-header">
            <div className="header-title">
              <div className="title-icon neumorphic" style={{ color: currentList.color }}>
                <currentList.icon size={24} />
              </div>
              <div>
                <h1>{currentList.name}</h1>
                <span className="task-count">
                  {activeTasks.length} {activeTasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
            </div>
            <div className="header-actions">
              <button className="action-btn neumorphic-btn">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </header>

          {/* Add Task Form */}
          <div className="add-task-container">
            <form onSubmit={addTask} className="add-task-form glass-card">
              <div className="add-task-icon">
                <Plus size={20} />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a task"
                className="task-input"
              />
              {inputValue && (
                <button type="submit" className="submit-btn floating-btn">
                  <Check size={16} />
                </button>
              )}
            </form>
          </div>

          {/* Task List */}
          <div className="tasks-container">
            {/* Active Tasks */}
            <div className="task-section">
              {activeTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onToggleImportant={toggleImportant}
                  onDelete={deleteTask}
                  onSelect={(task) => {
                    setSelectedTask(task);
                    setShowTaskDetails(true);
                  }}
                  onUpdate={updateTask}
                  priorities={priorities}
                />
              ))}
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="completed-section">
                <details className="completed-toggle glass-card">
                  <summary>
                    <div className="completed-header">
                      <div className="check-icon neumorphic">
                        <Check size={16} />
                      </div>
                      <span>Completed ({completedTasks.length})</span>
                    </div>
                  </summary>
                  <div className="completed-tasks">
                    {completedTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onToggleImportant={toggleImportant}
                        onDelete={deleteTask}
                        onSelect={(task) => {
                          setSelectedTask(task);
                          setShowTaskDetails(true);
                        }}
                        onUpdate={updateTask}
                        priorities={priorities}
                      />
                    ))}
                  </div>
                </details>
              </div>
            )}

            {filteredTasks.length === 0 && (
              <div className="empty-state">
                <div className="empty-illustration neumorphic">
                  <currentList.icon size={64} style={{ color: currentList.color, opacity: 0.6 }} />
                </div>
                <h3>No tasks yet</h3>
                <p>Add a task above to get started</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button for mobile */}
      <button className="fab floating-btn" onClick={() => {
        const input = document.querySelector('.task-input') as HTMLInputElement;
        input?.focus();
      }}>
        <Plus size={24} />
      </button>

      {/* Task Details Panel */}
      {showTaskDetails && selectedTask && (
        <TaskDetailsPanel
          task={selectedTask}
          onClose={() => {
            setShowTaskDetails(false);
            setSelectedTask(null);
          }}
          onUpdate={updateTask}
          onDelete={deleteTask}
          priorities={priorities}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

// Task Item Component with modern styling
interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onToggleImportant: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect: (task: Task) => void;
  onUpdate: (id: number, updates: Partial<Task>) => void;
  priorities: Priority[];
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, onToggle, onToggleImportant, onDelete, onSelect, onUpdate, priorities 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const priority = priorities.find(p => p.id === task.priority);

  return (
    <div className={`task-item glass-card ${task.completed ? 'completed' : ''} ${task.isNew ? 'slide-in' : ''} ${task.isDeleting ? 'slide-out' : ''}`}>
      <div className="task-main" onClick={() => onSelect(task)}>
        <button
          className={`task-checkbox neumorphic-btn ${task.completed ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          style={{ '--checkbox-color': priority?.color } as React.CSSProperties}
        >
          {task.completed && <Check size={14} />}
        </button>

        <div className="task-content">
          <div className="task-text">{task.text}</div>
          <div className="task-meta">
            {task.dueDate && (
              <span className="due-date glass-badge">
                <Calendar size={12} />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.notes && (
              <span className="has-notes glass-badge">
                <Edit3 size={12} />
              </span>
            )}
          </div>
        </div>

        <div className="task-actions">
          {task.priority !== 'medium' && (
            <span 
              className="priority-flag glass-badge"
              style={{ backgroundColor: priority?.color }}
            >
              {priority?.flag}
            </span>
          )}
          
          <button
            className={`important-btn neumorphic-btn ${task.important ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleImportant(task.id);
            }}
          >
            <Star size={16} fill={task.important ? 'currentColor' : 'none'} />
          </button>

          <div className="task-menu">
            <button
              className="menu-trigger neumorphic-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreHorizontal size={16} />
            </button>
            
            {showMenu && (
              <div className="menu-dropdown glass-card">
                <button onClick={() => onSelect(task)}>
                  <Edit3 size={14} />
                  Edit
                </button>
                <button onClick={() => onDelete(task.id)} className="delete-option">
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Details Panel Component with glassmorphism
interface TaskDetailsPanelProps {
  task: Task;
  onClose: () => void;
  onUpdate: (id: number, updates: Partial<Task>) => void;
  onDelete: (id: number) => void;
  priorities: Priority[];
  isDarkMode: boolean;
}

const TaskDetailsPanel: React.FC<TaskDetailsPanelProps> = ({ 
  task, onClose, onUpdate, onDelete, priorities, isDarkMode 
}) => {
  const [editingText, setEditingText] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempText, setTempText] = useState(task.text);
  const [tempNotes, setTempNotes] = useState(task.notes);

  const saveText = () => {
    onUpdate(task.id, { text: tempText });
    setEditingText(false);
  };

  const saveNotes = () => {
    onUpdate(task.id, { notes: tempNotes });
    setEditingNotes(false);
  };

  return (
    <div className="task-details-overlay">
      <div className="task-details-panel glass-panel">
        <div className="panel-header">
          <h2>Task Details</h2>
          <button className="close-btn neumorphic-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="panel-content">
          {/* Task Title */}
          <div className="detail-section">
            {editingText ? (
              <div className="edit-field">
                <input
                  type="text"
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                  onBlur={saveText}
                  onKeyDown={(e) => e.key === 'Enter' && saveText()}
                  autoFocus
                  className="edit-input neumorphic-inset"
                />
              </div>
            ) : (
              <div className="task-title glass-card" onClick={() => setEditingText(true)}>
                <h3>{task.text}</h3>
                <Edit3 size={16} />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="detail-section">
            <label>Status</label>
            <div className="status-toggle neumorphic-inset">
              <button
                className={`status-btn ${!task.completed ? 'active' : ''}`}
                onClick={() => onUpdate(task.id, { completed: false })}
              >
                Active
              </button>
              <button
                className={`status-btn ${task.completed ? 'active' : ''}`}
                onClick={() => onUpdate(task.id, { completed: true })}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Priority */}
          <div className="detail-section">
            <label>Priority</label>
            <div className="priority-selector">
              {priorities.map(priority => (
                <button
                  key={priority.id}
                  className={`priority-btn glass-card ${task.priority === priority.id ? 'active' : ''}`}
                  onClick={() => onUpdate(task.id, { priority: priority.id as 'low' | 'medium' | 'high' })}
                  style={{ '--priority-color': priority.color } as React.CSSProperties}
                >
                  <span className="priority-flag">{priority.flag}</span>
                  {priority.name}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div className="detail-section">
            <label>Due Date</label>
            <input
              type="date"
              value={task.dueDate || ''}
              onChange={(e) => onUpdate(task.id, { dueDate: e.target.value })}
              className="date-input neumorphic-inset"
            />
          </div>

          {/* Notes */}
          <div className="detail-section">
            <label>Notes</label>
            {editingNotes ? (
              <textarea
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                onBlur={saveNotes}
                onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && saveNotes()}
                placeholder="Add notes..."
                className="notes-textarea neumorphic-inset"
                autoFocus
              />
            ) : (
              <div 
                className="notes-display glass-card"
                onClick={() => setEditingNotes(true)}
              >
                {task.notes || 'Add notes...'}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="panel-actions">
            <button
              className="action-btn important floating-btn"
              onClick={() => onUpdate(task.id, { important: !task.important })}
            >
              <Star size={16} fill={task.important ? 'currentColor' : 'none'} />
              {task.important ? 'Remove from Important' : 'Mark as Important'}
            </button>
            
            <button
              className="action-btn delete floating-btn"
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
            >
              <Trash2 size={16} />
              Delete Task
            </button>
          </div>

          {/* Created Date */}
          <div className="task-meta-info">
            <small>Created {new Date(task.createdAt).toLocaleString()}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
