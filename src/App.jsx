import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newPriority, setNewPriority] = useState("Prioritas Sedang");
  const [filter, setFilter] = useState("Semua");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const newEntry = {
      id: Date.now(),
      text: newTask.trim(),
      deadline: newDeadline || null,
      priority: newPriority,
      completed: false,
    };
    setTasks((prev) => [newEntry, ...prev]);
    setNewTask("");
    setNewDeadline("");
    setNewPriority("Prioritas Sedang");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTask();
  };

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Aktif") return !task.completed;
    if (filter === "Selesai") return task.completed;
    return true;
  });

  const isDeadlineNear = (deadline) => {
    if (!deadline) return false;
    const now = new Date();
    const dead = new Date(deadline);
    const diffDays = (dead - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 2;
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <div className="todo-card">
        <header>
          <h1>📋 ToDo List</h1>
          <label className="dark-switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode((p) => !p)}
            />
            <span className="slider" />
            <span className="label-text">Mode Gelap</span>
          </label>
        </header>

        <section className="input-group">
          <input
            type="text"
            placeholder="Tambah tugas baru..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <input
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
          >
            <option>Prioritas Rendah</option>
            <option>Prioritas Sedang</option>
            <option>Prioritas Tinggi</option>
          </select>
          <button
            className="add-btn"
            onClick={addTask}
            disabled={!newTask.trim()}
          >
            Tambah
          </button>
        </section>

        <nav className="filter-buttons">
          {["Semua", "Aktif", "Selesai"].map((label) => (
            <button
              key={label}
              className={filter === label ? "active" : ""}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </nav>

        <main className="tasks-list">
          {filteredTasks.length === 0 && (
            <p className="empty-msg">Tidak ada tugas</p>
          )}
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""} ${
                isDeadlineNear(task.deadline) && !task.completed
                  ? "deadline-near"
                  : ""
              }`}
            >
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                />
                <span className="checkmark" />
              </label>
              <div className="task-text">
                <p className="task-title">{task.text}</p>
                <p className="task-meta">
                  {task.deadline
                    ? new Date(task.deadline).toLocaleDateString()
                    : "Tanpa deadline"}{" "}
                  |{" "}
                  <span
                    className={`priority ${task.priority
                      .replace(" ", "-")
                      .toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                </p>
              </div>
              <button
                className="delete-btn"
                aria-label="Hapus tugas"
                onClick={() => deleteTask(task.id)}
              >
                &times;
              </button>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;
