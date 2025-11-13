import { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const addTodo = () => {
    if (inputValue.trim() === '') {
      alert('Please enter a task');
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toLocaleDateString(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    if (editingText.trim() === '') {
      alert('Task cannot be empty');
      return;
    }
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editingText } : todo
    ));
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'pending':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>📋 My Todo List</h1>
          <p className="header-subtitle">Stay organized and productive</p>
        </div>
      </header>

      <main className="app-main">
        <div className="todo-input-section">
          <div className="input-group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="todo-input"
            />
            <button onClick={addTodo} className="add-btn">
              ➕ Add Task
            </button>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{todos.length}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{pendingCount}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tasks
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="todos-section">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>
                {todos.length === 0
                  ? 'No tasks yet. Add one to get started!'
                  : `No ${filter} tasks`}
              </p>
            </div>
          ) : (
            <ul className="todos-list">
              {filteredTodos.map((todo) => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="todo-checkbox"
                    />
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => handleEditKeyPress(e, todo.id)}
                        className="edit-input"
                        autoFocus
                      />
                    ) : (
                      <div className="todo-text-section">
                        <span className="todo-text">{todo.text}</span>
                        <span className="todo-date">{todo.createdAt}</span>
                      </div>
                    )}
                  </div>
                  <div className="todo-actions">
                    {editingId === todo.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(todo.id)}
                          className="action-btn save-btn"
                          title="Save"
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="action-btn cancel-btn"
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(todo.id, todo.text)}
                          className="action-btn edit-btn"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="action-btn delete-btn"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {todos.length > 0 && (
          <div className="action-section">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all completed tasks?')) {
                  setTodos(todos.filter(todo => !todo.completed));
                }
              }}
              className="clear-completed-btn"
            >
              Clear Completed Tasks
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Todo List App. Stay productive! ✨</p>
      </footer>
    </div>
  );
}

export default App;